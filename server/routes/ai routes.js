

import express from "express";

import {
  enhanceSummary,
  enhanceDescription,
  uploadResume,
} from "../controllers/aiControler.js";

import protect from "../middleware/authmiddleware.js";

const airoute = express.Router();

airoute.post("/enhancesummary", protect, enhanceSummary);

airoute.post("/enhancedescription", protect, enhanceDescription);

airoute.post("/uploadresume", protect, uploadResume);

export default airoute;