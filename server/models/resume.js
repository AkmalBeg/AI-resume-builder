

import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      default: "Untitled Resume",
    },

    public: {
      type: Boolean,
      default: false,
    },

    template: {
      type: String,
      default: "classic",
    },

    accent_color: {
      type: String,
      default: "#3B82F6",
    },

    professional_summary: {
      type: String,
      default: "",
    },

    raw_text: {
  type: String,
  default: "",
},

    skills: [
      {
        type: String,
      },
    ],

    personal_info: {
      image: String,
      fullname: String,
      email: String,
      phone: String,
      profession: String,
      location: String,
      linkedin: String,
      website: String,
    },

    experiences: [
      {
        company: String,
        position: String,
        start_date: Date,
        end_date: Date,
        description: String,
        is_current: Boolean,
      },
    ],

    projects: [
      {
        name: String,
        description: String,
        tech: String,
        link: String,
      },
    ],

    educations: [
      {
        institution: String,
        degree: String,
        field: String,
        graduation_date: Date,
        gpa: String,
      },
    ],
  },
  {
    
  timestamps: true,
  minimize: false,
  toJSON: { virtuals: true },

  }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;