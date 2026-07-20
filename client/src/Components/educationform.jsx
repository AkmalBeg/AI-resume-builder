import { GraduationCap, Plus, Trash2 } from "lucide-react";
import React from 'react'

const EducationForm = ({ data = [], onChange }) => {
    const addeducation = () => {
        const neweducation = {
            institution: '',
            degree: "",
            field: "",
            graduation_date: "",
            gpa: "",
        }

        onChange([...data, neweducation])
    }

    const removeducation = (index) => {
        const updated = data.filter((_, i) => i !== index)
        onChange(updated)
    }

    const updateducation = (index, field, value) => {
        const updated = [...data]
        updated[index] = { ...updated[index], [field]: value }
        onChange(updated)
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
                        qualification
                    </h3>
                    <p className='text-sm text-gray-500'>
                        add your education
                    </p>
                </div>
                <button onClick={addeducation} className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors'>
                    <Plus className='size-4' />
                    add education
                </button>
            </div>

            {data.length === 0 ? (
                <div className='text-center py-8 text-gray-500'>
                    <GraduationCap className='w-12 h-12 mx-auto mb-3 text-gray-300' />
                    <p>
                        no education is added...
                    </p>
                    <p className='text-sm'>
                        click "add education" to get started
                    </p>
                </div>
            ) : (
                <div className='space-y-4'>
                    {data.map((education, index) => (
                        <div key={index} className='p-4 border border-gray-200 rounded-lg space-y-3'>
                            <div className='flex justify-between items-start'>
                                <h4>education #{index + 1}</h4>
                                <button onClick={() => removeducation(index)} className='text-red-500 hover:text-red-700 transition-colors'>
                                    <Trash2 className='size-4' />
                                </button>
                            </div>
                            <div className='grid md:grid-cols-2 gap-3'>
                                <input
                                    value={education.institution || ""}
                                    onChange={(e) => updateducation(index, "institution", e.target.value)}
                                    type='text'
                                    placeholder='institution name'
                                    className='px-3 py-2 text-sm'
                                />

                                <input
                                    value={education.degree || ""}
                                    onChange={(e) => updateducation(index, "degree", e.target.value)}
                                    type='text'
                                    placeholder="degree (e.g., bachelor's, master's)"
                                    className='px-3 py-2 text-sm'
                                />

                                <input
                                    value={education.field || ""}
                                    onChange={(e) => updateducation(index, "field", e.target.value)}
                                    type='text'
                                    placeholder='field of study'
                                    className='px-3 py-2 text-sm'
                                />

                                <input
                                    value={education.graduation_date || ""}
                                    onChange={(e) => updateducation(index, "graduation_date", e.target.value)}
                                    type='text'
                                    placeholder='graduation year'
                                    className='px-3 py-2 text-sm disabled:bg-gray-100'
                                />
                            </div>
                            <input
                                value={education.gpa || ""}
                                onChange={(e) => updateducation(index, "gpa", e.target.value)}
                                type='text'
                                placeholder='gpa (optional)'
                                className='px-3 py-2 text-sm'
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default EducationForm