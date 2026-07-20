import mongoose from "mongoose";

const connectdb =async () => {
    try {
        mongoose.connection.on("connected",()=>{
            console.log("dtabase connected sucessfully")
        })
        let mongodburi=process.env.MONGODB_URI
        const projectname= "resume-bulder"
        if (!mongodburi) {
            throw new Error("enviroment variable not set");
            
        }
        if (mongodburi.endsWith('/')) {
            mongodburi=mongodburi.slice(0,-1)
        }

        await mongoose.connect(`${mongodburi}/${projectname}`)

        
    } catch (error) {
        console.log("error connecting to mongodb", error)
    }
}

export default connectdb