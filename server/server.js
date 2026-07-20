import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectdb from "./configr/db.js"
import userrouter from "./routes/userrouter.js"
import resumerouter from "./routes/resumeroutes.js"
import airoute from "./routes/ai routes.js"

const app=express()
const PORT =process.env.PORT|| 5000

await connectdb()

app.use(express.json())
app.use(cors())

app.get("/",(req,res)=> res.send("server is running"))
app.use("/api/user",userrouter)
app.use("/api/resume",resumerouter)
app.use("/api/ai",airoute)

app.listen(PORT,()=>{
    console.log(`serveris running ${PORT}`)
})
