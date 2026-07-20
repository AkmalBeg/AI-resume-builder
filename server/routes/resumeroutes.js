import express from "express"
import { createResume, updateResume, deleteResume, getResume, getAllResume, uploadResume } from "../controllers/resumecontroller.js"
import upload from "../configr/multer.js"
import protect from "../middleware/authmiddleware.js";

const resumerouter = express.Router()
resumerouter.post("/create",protect,createResume)
resumerouter.put("/update",upload.single('image'),protect,updateResume)
resumerouter.delete("/delete/:id",protect,deleteResume)
resumerouter.get("/get/:id",protect,getResume)
resumerouter.get("/getall",protect,getAllResume)
resumerouter.post("/upload", protect, uploadResume)


export default resumerouter