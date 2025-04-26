'use client'
import { useRouter } from 'next/navigation';
import React from 'react';

const Instructions = () => {
  const router = useRouter();

  const handleStartTest = () => {
    router.push('/test');
  };
  const instructionsList = [
    'You have 100 minutes to complete the test.',
    'Test consists of 100 multiple-choice q\'s.',
    'You are allowed 2 retest attempts if you do not pass on the first try.',
    'Each incorrect answer will incur a negative mark of -1/4.',
    'Ensure you are in a quiet environment and have a stable internet connection.',
    'Keep an eye on the timer, and try to answer all questions within the given time.',
    'Do not use any external resources such as dictionaries, websites, or assistance.',
    'Complete the test honestly to accurately assess your proficiency level.',
    'Check answers before submitting.',
    'Your test results will be displayed immediately after submission, indicating whether you have passed or need to retake the test.'
  ];

  return (
    <div className='bg-blue-50 h-screen'>
      <div className="max-w-4xl mx-auto py-8 px-4 ">
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-8">Ancient Indian History MCQ</h1>

        <div className="bg-slate-800 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-700">
              <div className="text-sm text-gray-300 mb-1">Total MCQ's:</div>
              <div className="text-4xl font-bold text-white">100</div>
            </div>

            <div className="flex-1 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-700">
              <div className="text-sm text-gray-300 mb-1">Total marks:</div>
              <div className="text-4xl font-bold text-white">100</div>
            </div>

            <div className="flex-1 p-6 flex flex-col items-center justify-center">
              <div className="text-sm text-gray-300 mb-1">Total time:</div>
              <div className="text-4xl font-bold text-white">90:00</div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4 text-slate-700">Instructions:</h2>
          <ol className="space-y-2 list-decimal pl-6">
            {instructionsList.map((instruction, index) => (
              <li key={index} className="text-slate-600">{instruction}</li>
            ))}
          </ol>
        </div>

        <div className="text-center">
          <button
            onClick={handleStartTest}
            className="bg-slate-800 text-white px-8 py-3 rounded-md hover:bg-slate-700 transition-colors font-medium"
          >
            Start Test
          </button>
        </div>
      </div>
    </div>

  );
};

export default Instructions;