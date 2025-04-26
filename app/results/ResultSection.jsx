'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const ResultSection = () => {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const savedResults = localStorage.getItem('quizResults')
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults)
        setResults(parsedResults)
      } catch (error) {
        console.error('Error parsing results:', error)
      }
    }
    setLoading(false)
  }, [])

  const handleDone = () => {
    localStorage.removeItem('quizResults')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading results...</p>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-xl mb-4">No results found!</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const totalQuestions = results.questions?.length || 100
  const correctAnswers = results.quizResults?.correct_answers || 0
  const incorrectAnswers = results.quizResults?.incorrect_answers || 0
  const notAttendedQuestions = results.quizResults?.not_attended || 0

  const score = results.quizResults?.score || 0
  const maxScore = totalQuestions

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">

          <div className=" text-white p-6 text-center" style={{
            background: 'linear-gradient(307.95deg, #1C3141 2.54%, #177A9C 79.7%)',
            color: 'white',
            padding: '1.5rem',
            textAlign: 'center',
          }}>
            <h2 className="text-lg font-medium mb-1">Marks Obtained:</h2>
            <div className="text-5xl font-bold">{score} / {maxScore}</div>
          </div>


          <div className="p-4">
            <div className="flex justify-between items-center py-3 border-b">
              <div className="flex items-center">
                <div className="bg-yellow-500 w-6 h-6 flex justify-center items-center rounded text-white mr-3">
                  <span className="text-sm">?</span>
                </div>
                <span className="text-gray-700">Total Questions:</span>
              </div>
              <span className="font-medium">{totalQuestions}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b">
              <div className="flex items-center">
                <div className="bg-green-500 w-6 h-6 flex justify-center items-center rounded text-white mr-3">
                  <span className="text-sm">✓</span>
                </div>
                <span className="text-gray-700">Correct Answers:</span>
              </div>
              <span className="font-medium">{correctAnswers.toString().padStart(3, '0')}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b">
              <div className="flex items-center">
                <div className="bg-red-500 w-6 h-6 flex justify-center items-center rounded text-white mr-3">
                  <span className="text-sm">✗</span>
                </div>
                <span className="text-gray-700">Incorrect Answers:</span>
              </div>
              <span className="font-medium">{incorrectAnswers.toString().padStart(3, '0')}</span>
            </div>

            <div className="flex justify-between items-center py-3">
              <div className="flex items-center">
                <div className="bg-gray-500 w-6 h-6 flex justify-center items-center rounded text-white mr-3">
                  <span className="text-sm">-</span>
                </div>
                <span className="text-gray-700">Not Attended Questions:</span>
              </div>
              <span className="font-medium">{notAttendedQuestions.toString().padStart(3, '0')}</span>
            </div>
          </div>

       
          <div className="p-4">
            <button
              onClick={handleDone}
              className="w-full  hover:bg-blue-900 text-white py-3 rounded font-medium transition-colors"
              style={{
                background: 'linear-gradient(307.95deg, #1C3141 2.54%, #177A9C 79.7%)',
                
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultSection