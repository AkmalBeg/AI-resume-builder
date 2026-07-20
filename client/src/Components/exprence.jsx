import { Briefcase, Loader2, Trash2, Plus, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from "react-redux"
import { Toaster } from 'react-hot-toast';
import api from '../configs/api'

const ExperienceForm = ({ data = [], onChange }) => {

    const { token } = useSelector((state) => state.auth)
    const [genrateindex, setgebrateindex] = useState(-1)

    const addexprenceform = () => {
        const newexprence = {
            company: '',
            position: "",
            start_date: "",
            end_date: "",
            description: "",
            is_current: false
        }

        onChange([...data, newexprence])
    }

    const removeexprence = (index) => {
        const updated = data.filter((_, i) => i !== index)
        onChange(updated)
    }

    const updateexprence = (index, field, value) => {
        const updated = [...data]
        updated[index] = { ...updated[index], [field]: value }
        onChange(updated)
    }

    const genratediscription = async (index) => {
        setgebrateindex(index)
        const exprence = data[index]

        try {
            const response = await api.post('/api/ai/enhancedescription', { description: exprence.description }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            updateexprence(index, "description", response.data.enhancedDescription)
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
        finally {
            setgebrateindex(-1)
        }
    }

   return (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          Professional Experience
        </h3>
        <p className="text-sm text-gray-500">
          Add your job experience
        </p>
      </div>

      <button
        onClick={addexprenceform}
        className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
      >
        <Plus className="size-4" />
        Add Experience
      </button>
    </div>

    {data.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>No work experience added...</p>
        <p className="text-sm">Click "Add Experience" to get started.</p>
      </div>
    ) : (
      <div className="space-y-4">
        {data.map((exprence, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg space-y-3"
          >
            <div className="flex justify-between items-start">
              <h4>Experience #{index + 1}</h4>

              <button
                onClick={() => removeexprence(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="size-4" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <input
                value={exprence.company || ""}
                onChange={(e) =>
                  updateexprence(index, "company", e.target.value)
                }
                type="text"
                placeholder="Company Name"
                className="px-3 py-2 text-sm rounded-lg border"
              />

              <input
                value={exprence.position || ""}
                onChange={(e) =>
                  updateexprence(index, "position", e.target.value)
                }
                type="text"
                placeholder="Job Title"
                className="px-3 py-2 text-sm rounded-lg border"
              />

              <input
                value={exprence.start_date || ""}
                onChange={(e) =>
                  updateexprence(index, "start_date", e.target.value)
                }
                type="month"
                className="px-3 py-2 text-sm rounded-lg border"
              />

              <input
                value={exprence.end_date || ""}
                onChange={(e) =>
                  updateexprence(index, "end_date", e.target.value)
                }
                type="month"
                disabled={exprence.is_current}
                className="px-3 py-2 text-sm rounded-lg border disabled:bg-gray-100"
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={exprence.is_current || false}
                onChange={(e) =>
                  updateexprence(index, "is_current", e.target.checked)
                }
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Currently Working
              </span>
            </label>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Job Description
                </label>

                <button
                  onClick={() => genratediscription(index)}
                  disabled={genrateindex === index || !exprence.company}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                >
                  {genrateindex === index ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}

                  Enhance with AI
                </button>
              </div>

              <textarea
                value={exprence.description || ""}
                onChange={(e) =>
                  updateexprence(index, "description", e.target.value)
                }
                rows={4}
                className="w-full text-sm px-3 py-2 rounded-lg border resize-none"
                placeholder="Describe your key responsibilities and achievements"
              />
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}

export default ExperienceForm