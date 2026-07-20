
import fs from "fs"
import resume from "../models/resume.js"
import imagekit from "../configr/imagekit.js"

export const createResume = async (req, res) => {
    try {
        const userid = req.userId
        const { title } = req.body

       // const newresume = await resume.create({ userid: userid, title })
        const newresume = await resume.create({ userid, title })
       return res.status(201).json({ message: "resume created succesfully", resume: newresume })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

export const uploadResume = async (req, res) => {
    try {
        const userid = req.userId
        const { title, resumetext } = req.body

        if (!title || !resumetext) {
            return res.status(400).json({ message: "title and resume text are required" })
        }

        const text = resumetext.replace(/\r\n/g, "\n")
        const lines = text.split("\n").map(l => l.trim()).filter(Boolean)

        // ---- Contact info ----
        const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
        const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3,5}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/)
        const linkedinMatch = text.match(/(https?:\/\/)?(www\.)?linkedin\.com\/[^\s,]+/i)
        const websiteMatch = text.match(/(https?:\/\/)?(www\.)?(?!linkedin)[a-zA-Z0-9-]+\.(com|dev|io|me|net)[^\s,]*/i)

        // Fullname: assume first non-empty line if it looks like a name (short, no digits/@ symbols)
        const possibleName = lines[0] && lines[0].length < 60 && !/[@0-9]/.test(lines[0]) ? lines[0] : ""

        // Location: look for "City, State" style pattern near the top
        const locationMatch = text.match(/Location:\s*([^\n|]+)/i) || text.match(/([A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z\s]+)/)

        const personal_info = {
            fullname: possibleName,
            email: emailMatch ? emailMatch[0] : "",
            phone: phoneMatch ? phoneMatch[0].trim() : "",
            profession: "",
            location: locationMatch ? locationMatch[1]?.trim() || locationMatch[0].trim() : "",
            linkedin: linkedinMatch ? linkedinMatch[0] : "",
            website: websiteMatch ? websiteMatch[0] : "",
        }

        // ---- Helper: grab the block of text between one section heading and the next ----
        const sectionHeadings = ["professional summary", "summary", "education", "skills", "projects", "experience", "work experience", "languages", "certifications"]
        const getSection = (name) => {
            const pattern = new RegExp(`(?:^|\\n)\\s*${name}\\s*\\n([\\s\\S]*?)(?=\\n\\s*(?:${sectionHeadings.join("|")})\\s*\\n|$)`, "i")
            const match = text.match(pattern)
            return match ? match[1].trim() : ""
        }

        // ---- Professional summary ----
        const professional_summary = getSection("professional summary") || getSection("summary")

        // ---- Skills ----
        const skillsBlock = getSection("skills")
        const skills = skillsBlock
            ? skillsBlock.split(/,|\n|•/).map(s => s.trim()).filter(s => s.length > 0 && s.length < 40)
            : []

        // ---- Education ----
        const eduBlock = getSection("education")
        const educations = []
        if (eduBlock) {
            const eduLines = eduBlock.split("\n").map(l => l.trim()).filter(Boolean)
            // crude pairing: assume alternating "Degree" / "Institution (year)" style lines
            for (let i = 0; i < eduLines.length; i++) {
                const line = eduLines[i]
                const yearMatch = line.match(/(19|20)\d{2}/)
                if (i === 0 || !educations.length) {
                    educations.push({
                        institution: eduLines[i + 1] ? eduLines[i + 1].replace(/\(.*?\)/g, "").trim() : "",
                        degree: line.replace(/\(.*?\)/g, "").trim(),
                        field: "",
                        graduation_date: yearMatch ? new Date(`${yearMatch[0]}-01-01`) : undefined,
                        gpa: "",
                    })
                    i++ // skip the institution line we just consumed
                }
            }
        }

        // ---- Projects ----
        const projectsBlock = getSection("projects")
        const projects = projectsBlock
            ? projectsBlock.split(/\n|•/).map(p => p.trim()).filter(Boolean).map(p => ({
                name: p.replace(/^[-•]\s*/, ""),
                description: "",
                tech: "",
                link: "",
            }))
            : []

        // ---- Experience (best-effort — often the least reliable without AI) ----
        const expBlock = getSection("experience") || getSection("work experience")
        const experiences = []
        if (expBlock) {
            experiences.push({
                company: "",
                position: "",
                start_date: undefined,
                end_date: undefined,
                description: expBlock,
                is_current: false,
            })
        }

        const newresume = await resume.create({
            userid,
            title,
            professional_summary,
            skills,
            personal_info,
            experiences,
            projects,
            educations,
        })

        return res.status(201).json({ message: "resume uploaded successfully", resume: newresume })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

export const deleteResume = async (req, res) => {
    try {
        const userid = req.userId
        const { id } = req.params

        const deletedresume = await resume.findOneAndDelete({ _id: id, userid: userid })
        if (!deletedresume) {
            return res.status(404).json({ message: "resume not found" })
        }
        return res.status(200).json({ message: "resume deleted succesfully", resume: deletedresume })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

export const getResume = async (req, res) => {
    try {
        const userid = req.userId
        const { id } = req.params
        const getresume = await resume.findOne({ _id: id, userid: userid })

        if (!getresume) {
            return res.status(404).json({ message: "resume not found" })
        }
        return res.status(200).json({ resume: getresume })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

export const getAllResume = async (req, res) => {
    try {
        const userid = req.userId
        const allresumes = await resume.find({ userid: userid })
        return res.status(200).json({ resume: allresumes })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

export const updateResume = async (req, res) => {
    try {
        const userid = req.userId
        const { resumeid, resumedata, removebackground } = req.body
        const image = req.file

        let resumedatacopy;
        if (typeof resumedata === 'string') {
            resumedatacopy = JSON.parse(resumedata)
        } else {
            resumedatacopy = structuredClone(resumedata)
        }

        if (image) {
            const imagebuffer = fs.createReadStream(image.path)
            const response = await imagekit.files.upload({
                file: imagebuffer,
                fileName: 'file-name.jpg',
                folder: "user_resume",
            })
            resumedatacopy.personal_info.image = response.url
        }

        const updatedresume = await resume.findOneAndUpdate(
            { _id: resumeid, userid: userid },
            resumedatacopy,
            { new: true }
        )

        if (!updatedresume) {
            return res.status(404).json({ message: "resume not found" })
        }

        return res.status(200).json({ message: "resume updated succesfully", resume: updatedresume })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}