import ai from "../configr/Ai.js";
import Resume from "../models/resume.js";

// Enhance Summary
export const enhanceSummary = async (req, res) => {
  try {
    const { summary } = req.body;

    if (!summary) {
      return res.status(400).json({
        message: "Summary is required",
      });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume writer. Improve the summary professionally.",
        },
        {
          role: "user",
          content: summary,
        },
      ],
    });

    return res.status(200).json({
      enhancedSummary: response.choices[0].message.content,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Enhance Description
export const enhanceDescription = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({
        message: "Description is required",
      });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume writer. Improve the project or experience description professionally.",
        },
        {
          role: "user",
          content: description,
        },
      ],
    });

    return res.status(200).json({
      enhancedDescription: response.choices[0].message.content,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Upload Resume
export const uploadResume = async (req, res) => {
  try {
    const { resumetext, title } = req.body;

    const userid = req.user.userid;

    if (!resumetext || !title) {
      return res.status(400).json({
        message: "Resume text and title are required",
      });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Extract resume information and return ONLY valid JSON.",
        },
        {
          role: "user",
          content: resumetext,
        },
      ],
      response_format: {
        type: "json_object",
      },
    });

    const parsedData = JSON.parse(
      response.choices[0].message.content
    );

    const newResume = await Resume.create({
      ...parsedData,
      userid,
      title,
    });

    return res.status(201).json({
      message: "Resume uploaded successfully",
      resumeid: newResume._id,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};