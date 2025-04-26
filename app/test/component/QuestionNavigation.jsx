import React from 'react'

const QuestionNavigation = ({ totalQuestions, currentQuestion, questionStatus, markedForReview, onQuestionClick }) => {
 
  const questionNumbers = Array.from({ length: totalQuestions }, (_, i) => i + 1);
  
  const questionRows = [];
  for (let i = 0; i < questionNumbers.length; i += 5) {
    questionRows.push(questionNumbers.slice(i, i + 5));
  }
  
  const getStatusColor = (questionNum) => {
    const status = questionStatus[questionNum];
    
    if (questionNum === currentQuestion) return "bg-purple-500 text-white";
    if (status === 'answered') return "bg-green-100";
    if (status === 'review') return "bg-purple-100";
    if (status === 'answered-review') return "bg-purple-100";
    return "bg-gray-50";
  };
  
  return (
    <div>
      <div className="grid grid-cols-5 gap-2">
        {questionRows.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map(num => (
              <button
                key={num}
                className={`h-10 w-10 rounded flex items-center justify-center ${getStatusColor(num)}`}
                onClick={() => onQuestionClick(num)}
              >
                {num}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
      
      <div className="mt-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100"></div>
          <span className="text-sm">Attended</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100"></div>
          <span className="text-sm">Not Attempted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-100"></div>
          <span className="text-sm">Marked For Review</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500"></div>
          <span className="text-sm">Answered and Marked For Review</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigation
