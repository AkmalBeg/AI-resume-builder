
import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ArrowLeftIcon, ChevronRight, ChevronLeft, DownloadIcon, EyeIcon, EyeOffIcon, Share2Icon } from 'lucide-react'
import toast from 'react-hot-toast';
import api from '../configs/api'

// TODO: adjust these paths to wherever your actual components live


import ClassicTemplate from "../assets/templates/ClassicTemplate";
import ModernTemplate from "../assets/templates/ModernTemplate";
import MinimalTemplate from "../assets/templates/MinimalTemplate";
import MinimalImageTemplate from "../assets/templates/MinimalImageTemplate";
import ColorPicker from '../Components/colerpicker'
import PersonalInfo from '../Components/personalinfo'
import SummaryForm from '../Components/summary'
import ExperienceForm from '../Components/exprence'
import EducationForm from '../Components/educationform'
import ProjectForm from '../Components/projectform'
import SkillsForm from '../Components/skillform'
import Preview from '../Components/preview'
import TemplateSelect from '../Components/TemplateSelect'


const ResumeBuilder = () => {
  const { resume_id } = useParams()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)

  const [resumedata, setResumedata] = useState({
    _id: '',
    title: '',
    personal_info: {},
    educations: [],
    experiences: [],
    skills: [],
    projects: [],
    professional_summary: '',
    template: 'classic',
    accent_color: '#3b82F6',
    public: false,
  })

  const [activesectionindex, setActivesectionindex] = useState(0)
  const [removebackground, setRemovebackground] = useState(false)

  const section = [
    { id: 'personal', name: "info", icon: "user" },
    { id: 'summary', name: "summary", icon: "filetext" },
    { id: 'education', name: "education", icon: "graducationcap" },
    { id: 'project', name: "project", icon: "foldericon" },
    { id: 'skills', name: "skills", icon: "sparkles" },
    { id: 'experience', name: "experience", icon: "Briefcase" },
  ]

  const activesection = section[activesectionindex]

  const loadexistingresume = async () => {
    try {
      const { data } = await api.get('/api/resume/get/' + resume_id, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.resume) {
        setResumedata(data.resume)
        document.title = data.resume.title
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    loadexistingresume()
  }, [])

  const changevisibility = async () => {
    try {
      const formdata = new FormData()
      formdata.append("resumeid", resume_id)
      formdata.append("resumedata", JSON.stringify({ public: !resumedata.public }))

      const { data } = await api.put('/api/resume/update', formdata, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setResumedata({ ...resumedata, public: !resumedata.public })
      toast.success(data.message)
    } catch (error) {
      toast.error('Failed to update resume visibility')
    }
  }

  const handleshare = () => {
    const frontendurl = window.location.href.split("/app/")[0]
    const resumeurl = frontendurl + "/view/" + resume_id

    if (navigator.share) {
      navigator.share({ url: resumeurl, text: "Check out my resume", title: "My Resume" })
    } else {
      alert('Share is not supported')
    }
  }

  const downloadresume = () => {
    window.print()
  }
const saveresume = async () => {
    try {
       console.log("IMAGE TYPE AT SAVE:", typeof resumedata.personal_info.image, resumedata.personal_info.image)

      let updateresumedata = structuredClone(resumedata)

      if (typeof resumedata.personal_info.image === 'object') {
        delete updateresumedata.personal_info.image
      }

      const formdata = new FormData()
      formdata.append("resumeid", resume_id)
      formdata.append("resumedata", JSON.stringify(updateresumedata))
      removebackground && formdata.append("removebackground", "true")
      typeof resumedata.personal_info.image === 'object' && formdata.append("image", resumedata.personal_info.image)

      const { data } = await api.put('/api/resume/update', formdata, {
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
    }
})
      setResumedata(data.resume)
      toast.success(data.message)
      navigate('/app')
    } catch (error) {
      console.error("Error saving resume:", error?.response?.data || error.message)
      toast.error(error?.response?.data?.message || "An error occurred while saving the resume.")
    }
}
  return (
    <div>
      <div>
        <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
          <ArrowLeftIcon className='size-4' /> Back to Dashboard
        </Link>
      </div>

      <div className='max-w-7xl mx-auto px-4 pb-8'>
        <div className='grid lg:grid-cols-12 gap-8'>

          {/* left section */}
          <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>

              {/* progress bar */}
              <hr className='absolute top-0 left-0 right-0 border-2 border-gray-200' />
              <hr
                className='absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-2000'
                style={{ width: `${(activesectionindex * 100) / (section.length - 1)}%` }}
              />

              {/* section navigation */}
              <div className='flex justify-between items-center mb-6 border-b border-gray-300 py-1'>
                <div></div>
                <div className='flex items-center'>
                  {activesectionindex !== 0 && (
                    <button
                      onClick={() => setActivesectionindex((previndex) => Math.max(previndex - 1, 0))}
                      className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all'
                    >
                      <ChevronLeft className='size-4' /> Previous
                    </button>
                  )}
                  <button
                    onClick={() => setActivesectionindex((previndex) => Math.min(previndex + 1, section.length - 1))}
                    className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activesectionindex === section.length - 1 ? 'opacity-50' : ''}`}
                    disabled={activesectionindex === section.length - 1}
                  >
                    <ChevronRight className='size-4' /> Next
                  </button>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <TemplateSelect
                  selectedTemplate={resumedata.template}
                  onChange={(template) => setResumedata(prev => ({ ...prev, template }))}
                />
                <ColorPicker
                  selectedColor={resumedata.accent_color}
                  onChange={(color) => setResumedata(prev => ({ ...prev, accent_color: color }))}
                />
              </div>

              {/* form section */}
              <div className='space-y-6'>
               {activesection.id === 'personal' && (
  <PersonalInfo
    data={resumedata.personal_info}
    onChange={(data) => {
      setResumedata(prev => {
        const imageJustAdded = !prev.personal_info.image && data.image
        return {
          ...prev,
          personal_info: data,
          template: imageJustAdded ? 'minimal-image' : prev.template
        }
      })
    }}
    removebackground={removebackground}
    setRemovebackground={setRemovebackground}
  />
)}

                {activesection.id === 'summary' && (
                  <SummaryForm
                    data={resumedata.professional_summary}
                    onChange={(data) => setResumedata(prev => ({ ...prev, professional_summary: data }))}
                  />
                )}

                {activesection.id === 'experience' && (
                  <ExperienceForm
                    data={resumedata.experiences}
                    onChange={(data) => setResumedata(prev => ({ ...prev, experiences: data }))}
                  />
                )}

                {activesection.id === 'education' && (
                  <EducationForm
                    data={resumedata.educations}
                    onChange={(data) => setResumedata(prev => ({ ...prev, educations: data }))}
                  />
                )}

                {activesection.id === 'project' && (
                  <ProjectForm
                    data={resumedata.projects}
                    onChange={(data) => setResumedata(prev => ({ ...prev, projects: data }))}
                  />
                )}

                {activesection.id === 'skills' && (
                  <SkillsForm
                    data={resumedata.skills}
                    onChange={(data) => setResumedata(prev => ({ ...prev, skills: data }))}
                  />
                )}
              </div>

              <button
                onClick={() => { toast.promise(saveresume(), { loading: "Saving..." }) }}
                className='bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 text-sm'
              >
                Save changes
              </button>
            </div>
          </div>

          {/* right side */}
         <div className='lg:col-span-7 max-lg:mt-6'>
  <div className='flex items-center justify-end gap-2 mb-3'>
    {resumedata.public && (
      <button onClick={handleshare} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors'>
        <Share2Icon className='size-4' /> Share
      </button>
    )}
    <button onClick={changevisibility} className="flex items-center p-2 px-4 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 ring-purple-300 rounded-lg hover:ring transition-colors">
      {resumedata.public ? <EyeIcon className='size-4' /> : <EyeOffIcon className='size-4' />}
      {resumedata.public ? 'Public' : 'Private'}
    </button>
    <button onClick={downloadresume} className='flex items-center gap-2 px-6 py-2 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors'>
      <DownloadIcon className='size-4' /> Download
    </button>
  </div>

  <Preview data={resumedata} template={resumedata.template} accentColor={resumedata.accent_color} />
</div>

        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder