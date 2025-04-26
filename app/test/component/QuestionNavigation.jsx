import React from 'react';

const QuestionNavigation = ({ totalQuestions, currentQuestion, questionStatus, onQuestionClick }) => {
  
  const questionNumbers = Array.from({ length: totalQuestions }, (_, i) => i + 1);
  
  const questionRows = [];
  for (let i = 0; i < questionNumbers.length; i += 5) {
    questionRows.push(questionNumbers.slice(i, i + 5));
  }
  
  const getStatusColor = (questionNum) => {
    const status = questionStatus[questionNum];
    
    if (questionNum === currentQuestion) return "border-2 border-purple-600 font-bold";
    
    switch(status) {
      case 'answered':
        return "bg-[#4CAF50] hover:bg-green-200";
      case 'answered-review':
        return "bg-purple-300 hover:bg-purple-400";
      case 'review':
        return "bg-[#800080] hover:bg-purple-200";
      case 'attended':
        return "bg-yellow-100 hover:bg-yellow-200";
      case 'unanswered':
        return "bg-gray-100 hover:bg-gray-200";
      default:
        return "bg-red-100 hover:bg-red-200";
    }
  };
  
  const getStatusText = (questionNum) => {
    const status = questionStatus[questionNum];
    
    switch(status) {
      case 'answered':
        return "Answered";
      case 'answered-review':
        return "Answered & Marked";
      case 'review':
        return "Marked";
      case 'attended':
        return "Viewed";
      default:
        return "Not Viewed";
    }
  };
  
  return (
    <div className='px-3 bg-[#f4fcff]'>
      <h3 className="text-lg font-semibold mb-2">Question No. Sheet</h3>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {questionRows.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map(num => (
              <button
                key={num}
                className={`xl:h-16 xl:w-16 w-12 h-12 rounded flex items-center justify-center text-sm ${getStatusColor(num)}`}
                style={{
                  border: '0.87px solid #CECECE'
                }}
                onClick={() => onQuestionClick(num)}
                title={`Question ${num} - ${getStatusText(num)}`}
              >
                {num}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#4CAF50] rounded"></div>
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 rounded"></div>
          <span>Not Attended</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 rounded"></div>
          <span>Viewed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#800080] rounded"></div>
          <span>Marked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-300 rounded"></div>
          <span>Answered & Marked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-purple-600 rounded"></div>
          <span>Current</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigation;