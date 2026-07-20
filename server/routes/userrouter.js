


import express from "express";
import {
  registeruser,
  loginuser,
  getuser,
  getresume,
} from "../controllers/usercontroller.js";

import protect from "../middleware/authmiddleware.js";

const userrouter = express.Router();

userrouter.post("/register", registeruser);
userrouter.post("/login", loginuser);
userrouter.get("/getuser", protect, getuser);
userrouter.get("/resume", protect, getresume);

export default userrouter;