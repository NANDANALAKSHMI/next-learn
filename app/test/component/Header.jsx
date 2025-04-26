import React from 'react'

const Header = ({ title, questionNumber, totalQuestions, timeRemaining }) => {
  return (
    <div className="bg-[#f4fcff]  md:px-10 px-4 sm:flex sm:justify-between justify-center items-center py-4">
      <div className="text-lg font-medium">{title}</div>
      <div className="flex items-center gap-4">
        <div className="text-gray-600">
          {questionNumber}/{totalQuestions}
        </div>
        {/* <div className="text-gray-600">
          Question No. Sheet:
        </div> */}
        <div className="flex items-center">
          <div className="text-gray-600 mr-2">Remaining Time:</div>
          <div className="bg-gray-800 text-white rounded-full px-3 py-1 flex items-center">
            <div className="h-2 w-2 bg-white rounded-full mr-2"></div>
            {timeRemaining}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header