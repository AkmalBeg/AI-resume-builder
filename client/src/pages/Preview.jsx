import React, { useEffect,usestate } from 'react'
import {useParams} from 'react-router-dom'

const Preview = () => {

  const {resumeid}=useParams()
  const {loading,setloading}=usestate(true)
  const [resumedata,setresumedata]= usestate(null)
  const loadresume =async()=>{

try {
  const {data}=await Api.get('/api/resume/public/'+resumeid)
  setresumedata(data.resume)
} catch (error) {
  console.log(error.message)
}
finally{
  setloading(false)
}

  }
  useEffect(()=>{
    loadresume()
  },[])
  return resumedata ? (
    <div className='bg-slate-100'>
      <div className='max-w-3xl mx-auto py-10'>
<resumeprevevew data={resumedata} template={resumedata.template } accentcolor={resumedata.accent_color} className="py-4 bg-white" />

      </div>

    </div>
  ) : (
    <div>

    {isloading ? <loder/>:(
    <div classname='flex flex-col items-center justify-center h-screen'>
    <p classname='text-center text-6xl text-slate-400 font-medium'>resume not found
</p>
<a classname='mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 ring-green-400 flex items-center transition-colors' href='/'>

<arrowlefticon classname="mr-2 size-4"/>
go to home
</a>
</div>
    )}
    </div>
  )
}

export default Preview