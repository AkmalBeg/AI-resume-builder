

import { FilePenIcon, LoaderCircleIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloudIcon, XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast' // adjust to whatever toast library you're using
import api from '../configs/api' // adjust to your actual api client path
import pdftotext from '../utils/pdftotext' // adjust to your actual pdftotext helper path

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth)

  const colors = ["#F87171", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA", "#F472B6"]
  const [allresumes, setAllResumes] = useState([])
  const [showcreateResume, setShowCreateResume] = useState(false)
  const [uploadResume, setUploadResume] = useState(false)
  const [title, setTitle] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [editresumeid, setEditResumeId] = useState(null)
  const [editResume, setEditResume] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const fetchResumes = async () => {
    try {
      const { data } = await api.get(`/api/resume/getall`, { headers: { 'Authorization': `Bearer ${token}` } })
      setAllResumes(data.resume)
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred while fetching the resumes.")
    }
  }
/*
  const createResume = async (event) => {
    try {
      event.preventDefault()
      const { data } = await api.post(`/api/resume/create`, { title }, { headers: { 'Authorization': `Bearer ${token}` } })
      setAllResumes([...allresumes, data.resume])
      setTitle('')
      setShowCreateResume(false)
      navigate(`/app/builder/${data.resume._id}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred while creating the resume.")
    }
  }*/

    const createResume = async (event) => {
    try {
      event.preventDefault()
      console.log('1: before request')
      const { data } = await api.post(`/api/resume/create`, { title }, { headers: { 'Authorization': `Bearer ${token}` } })
      console.log('2: got response', data)
      setAllResumes([...(Array.isArray(allresumes) ? allresumes : []), data.resume])
      console.log('3: state updated')
      setTitle('')
      setShowCreateResume(false)
      console.log('4: about to navigate to', `/app/builder/${data.resume._id}`)
      navigate(`/app/builder/${data.resume._id}`)
      console.log('5: navigate called')
    } catch (error) {
      console.log('CAUGHT ERROR:', error)
      toast.error(error?.response?.data?.message || "An error occurred while creating the resume.")
    }
  }

  const handleUploadResume = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const resumetext = await pdftotext(resumeFile)
      const { data } = await api.post(`/api/resume/upload`, { title, resumetext }, { headers: { Authorization: `Bearer ${token}` } })

      setTitle('')
      setResumeFile(null)
      setUploadResume(false)

      navigate(`/app/builder/${data.resume.id}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred while uploading the resume.")
      setLoading(false)
    }
  }

 const handleEditResume = async (event) => {
    try {
      event.preventDefault()
      const formdata = new FormData()
      formdata.append("resumeid", editresumeid)
      formdata.append("resumedata", JSON.stringify({ title }))

      const { data } = await api.put(`/api/resume/update`, formdata, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      })
     // setAllResumes(allresumes.map((resume) => (resume.id === editresumeid ? { ...resume, title } : resume)))
     await fetchResumes()
      setTitle("")
      setEditResumeId(null)
      setEditResume(false)
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred while editing the resume.")
    }
  }

const deleteResume = async (id) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this resume?')
      if (confirmDelete) {
        const { data } = await api.delete(`/api/resume/delete/${id}`, { headers: { 'Authorization': `Bearer ${token}` } })
        await fetchResumes()
        toast.success(data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred while deleting the resume.")
    }
}

  useEffect(() => {
    fetchResumes()
  }, [])

  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <p className='text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden'>
          Welcome to your dashboard, {user?.name}!
        </p>

        <div className='flex flex-wrap gap-4' >
          <button onClick={() => setShowCreateResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
            <PlusIcon className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full' />
            <p className='text-sm group-hover:text-purple-500 transition-all'>Create Resume</p>
          </button>

          <button onClick={() => setUploadResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
            <UploadCloudIcon className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full' />
            <p className='text-sm group-hover:text-purple-500 transition-all'>Upload Existing</p>
          </button>
        </div>

        <hr className='border-slate-300 my-6 sm:w-[305px]' />

        <div className='grid grid-cols-2 sm:flex flex-wrap gap-4'>
          {(allresumes || [] ).map((resume, index) => {
            const basecolor = colors[index % 6]
            return (
              <button key={index} onClick={() => navigate(`/app/builder/${resume.id}`)} className='relative w-full sm:w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer' style={{ background: `linear-gradient(135deg, ${basecolor}10, ${basecolor}40)`, borderColor: basecolor + '40' }}>
                <FilePenIcon className='size-7 group-hover:scale-105 transition-all' style={{ color: basecolor }} />
                <p className='text-sm group-hover:text-purple-500 transition-all' style={{ color: basecolor }}>{resume.title}</p>
                <p className='absolute text-xs top-2 right-2 text-slate-500 transition-all duration-300 px-2 text-center' style={{ color: basecolor + '90' }}>
                  {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
                <div className='absolute top-1 right-1 group-hover:flex items-center hidden'>
                  <TrashIcon onClick={(e) => { e.stopPropagation(); deleteResume(resume.id) }} className='size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors' />
                  <PencilIcon onClick={(e) => {
                    e.stopPropagation()
                    setEditResumeId(resume.id)
                    setTitle(resume.title)
                    setEditResume(true)
                  }} className='size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors' />
                </div>
              </button>
            )
          })}
        </div>

        {showcreateResume && (
          <form onSubmit={createResume} onClick={() => setShowCreateResume(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div onClick={(e) => e.stopPropagation()} className='bg-white rounded-lg p-6 w-full max-w-md relative'>
              <h2 className='text-xl font-bold mb-4'>Create New Resume</h2>
              <input onChange={(e) => setTitle(e.target.value)} value={title} type='text' placeholder='Resume Title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' />
              <button className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>Create Resume</button>
              <XIcon className='absolute top-3 right-3 size-6 text-slate-500 hover:text-slate-700 cursor-pointer transition-colors' onClick={() => { setShowCreateResume(false); setTitle('') }} />
            </div>
          </form>
        )}

        {uploadResume && (
          <form onSubmit={handleUploadResume} onClick={() => setUploadResume(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div onClick={(e) => e.stopPropagation()} className='bg-white rounded-lg p-6 w-full max-w-md relative'>
              <h2 className='text-xl font-bold mb-4'>Upload Resume</h2>
              <input onChange={(e) => setTitle(e.target.value)} value={title} type='text' placeholder='Resume Title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' />
              <label htmlFor='resume-input' className='block text-sm text-slate-700'>
                Select Resume file
                <div className='mt-1 flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded cursor-pointer hover:border-green-600 transition-colors'>
                  {resumeFile ? (
                    <p className='text-sm text-slate-500'>{resumeFile.name}</p>
                  ) : (
                    <>
                      <UploadCloudIcon className='size-10 text-slate-500 hover:text-green-600 transition-colors' />
                      <p>Upload Resume</p>
                    </>
                  )}
                </div>
              </label>
              <input id='resume-input' type='file' accept='.pdf,.doc,.docx' hidden onChange={(e) => setResumeFile(e.target.files[0])} className='hidden' />

              <button type='submit' disabled={loading} className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2'>
                {loading && <LoaderCircleIcon className="animate-spin size-4 text-white" />}
                {loading ? 'Uploading...' : 'Upload Resume'}
              </button>
              <XIcon className='absolute top-3 right-3 size-6 text-slate-500 hover:text-slate-700 cursor-pointer transition-colors' onClick={() => { setUploadResume(false); setTitle('') }} />
            </div>
          </form>
        )}

        {editResume && (
          <form onSubmit={handleEditResume} onClick={() => setEditResume(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div onClick={(e) => e.stopPropagation()} className='bg-white rounded-lg p-6 w-full max-w-md relative'>
              <h2 className='text-xl font-bold mb-4'>Edit Resume</h2>
              <input onChange={(e) => setTitle(e.target.value)} value={title} type='text' placeholder='Resume Title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' />
              <button type='submit' className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>Edit Resume</button>
              <XIcon className='absolute top-3 right-3 size-6 text-slate-500 hover:text-slate-700 cursor-pointer transition-colors' onClick={() => { setEditResume(false); setTitle('') }} />
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Dashboard