import openai from "openai";

const ai=new openai({
    apiKey:process.env.OPENAI_API_KEY,
    baseURL:process.env.OPENAI_API_BASE_URL
})

export default ai