
import React, { useState, useRef } from 'react'
import { User, Mail, Phone, MapPin, Briefcase } from 'lucide-react'
import { FaLinkedin, FaGithub } from 'react-icons/fa'
import { removeBackground } from '@imgly/background-removal'

const PersonalInfo = ({ data, onChange, removebackground, setRemovebackground }) => {
  const [processing, setProcessing] = useState(false)
  const originalFileRef = useRef(null)

  const handlechange = (field, value) => {
    onChange({ ...data, [field]: value })
  }

  const handleImageChange = async (file) => {
    if (!file) return
    originalFileRef.current = file

    if (removebackground) {
      await processRemoval(file)
    } else {
      handlechange("image", file)
    }
  }

  const processRemoval = async (file) => {
    setProcessing(true)
    try {
      const blob = await removeBackground(file)
      const processedFile = new File([blob], file.name.replace(/\.\w+$/, '.png'), { type: 'image/png' })
      handlechange("image", processedFile)
    } catch (error) {
      console.error("Background removal failed:", error)
      handlechange("image", file) // fall back to original image
    } finally {
      setProcessing(false)
    }
  }

  const handleToggleRemoveBackground = async (checked) => {
    setRemovebackground(checked)
    if (!originalFileRef.current) return

    if (checked) {
      await processRemoval(originalFileRef.current)
    } else {
      handlechange("image", originalFileRef.current)
    }
  }

  const fields = [
    { key: "full_name", label: "full name", icon: User, type: "text", required: true },
    { key: "email", label: "email address", icon: Mail, type: "email", required: true },
    { key: "phone", label: "phone number", icon: Phone, type: "tel" },
    { key: "location", label: "location", icon: MapPin, type: "text" },
    { key: "profession", label: "profession", icon: Briefcase, type: "text" },
    { key: "linkedin", label: "linkedin profile", icon: FaLinkedin, type: "url" },
    { key: "github", label: "github profile", icon: FaGithub, type: "url" }
  ]

  return (
    <div>
      <h3 className='text-lg font-semibold text-gray-900'>
        Personal Information
      </h3>
      <p className='text-sm text-gray-600'>
        Get started with the personal information
      </p>

      <div className='flex items-center gap-2'>
        <label>
          {processing ? (
            <div className='w-16 h-16 rounded-full mt-5 flex items-center justify-center bg-slate-100 ring ring-slate-300 text-xs text-slate-500 text-center'>
              removing...
            </div>
          ) : data.image ? (
            <img
              src={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image)}
              alt='user-image'
              className='w-16 h-16 rounded-full object-cover mt-5 ring ring-slate-300 hover:opacity-80'
            />
          ) : (
            <div className='inline-flex items-center gap-2 mt-5 text-slate-600 hover:text-slate-700 cursor-pointer'>
              <User className='size-10 p-2.5 border rounded-full' />
              upload user image
            </div>
          )}

          <input
            type='file'
            accept='image/jpeg,image/png'
            className="hidden"
            onChange={(e) => handleImageChange(e.target.files[0])}
          />
        </label>

        {typeof data.image === "object" && (
          <div className='flex flex-col gap-1 pl-4 text-sm'>
            <p>remove background</p>

            <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
              <input
                type='checkbox'
                className='sr-only peer'
                onChange={(e) => handleToggleRemoveBackground(e.target.checked)}
                checked={removebackground}
              />
              <div className='w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200'></div>
              <span className='dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4'></span>
            </label>
          </div>
        )}
      </div>

      {fields.map((f) => {
        const Icon = f.icon
        return (
          <div key={f.key} className='space-y-1 mt-5'>
            <label className='flex items-center gap-2 text-sm font-medium text-gray-600'>
              <Icon className="size-4" />
              {f.label}
              {f.required && <span className='text-red-500'>*</span>}
            </label>
            <input
              type={f.type}
              value={data[f.key] || ""}
              onChange={(e) => handlechange(f.key, e.target.value)}
              className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm'
              placeholder={`enter your ${f.label.toLowerCase()}`}
              required={f.required}
            />
          </div>
        )
      })}
    </div>
  )
}

export default PersonalInfo