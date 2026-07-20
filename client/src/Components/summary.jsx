import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Loader2, Sparkles } from 'lucide-react'
import { Toaster } from 'react-hot-toast';
import api from '../configs/api'

const SummaryForm = ({ data, onChange }) => {
  const { token } = useSelector(state => state.auth)
  const [isgenrating, setisgenrating] = useState(false)

  const genratesummry = async () => {
    try {
      setisgenrating(true)
      const prompt = `enhance my professional summary "${data}"`
     const response = await api.post('/api/ai/enhancesummary', {summary: data  }, {
  headers: { Authorization: `Bearer ${token}` }
})
      onChange(response.data.enhancedSummary)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setisgenrating(false)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
            professional summary
          </h3>
          <p className='text-sm text-gray-500'>
            add summary for your resume here
          </p>
        </div>
        <button
          disabled={isgenrating}
          onClick={genratesummry}
          className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'
        >
          {isgenrating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className='size-4' />
          )}
          {isgenrating ? "enhancing..." : "ai enhance"}
        </button>
      </div>

      <div className='mt-6'>
        <textarea
          value={data || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={7}
          className='w-full p-3 px-4 mt-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none'
          placeholder='write a compelling professional summary that highlights your key strengths and career objectives...'
        />
        <p className='text-xs text-gray-500 max-w-4/5 mx-auto text-center'>
          tip: keep it concise (3-4 sentences) and focus on your most relevant achievements and skills.
        </p>
      </div>
    </div>
  )
}

export default SummaryForm