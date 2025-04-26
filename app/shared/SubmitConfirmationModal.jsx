import React from 'react';

const SubmitConfirmationModal = ({
    isOpen,
    onClose,
    onSubmit,
    timeRemaining,
    totalQuestions,
    questionsAnswered,
    markedForReviewCount
}) => {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-medium">Are you sure you want to submit the test?</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl font-light"
                    >
                        ×
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="bg-gray-700 p-2 rounded mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-gray-700">Remaining Time:</span>
                        </div>
                        <span className="font-medium">{timeRemaining}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="bg-yellow-500 p-2 rounded mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <span className="text-gray-700">Total Questions:</span>
                        </div>
                        <span className="font-medium">{totalQuestions}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="bg-green-500 p-2 rounded mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-gray-700">Questions Answered:</span>
                        </div>
                        <span className="font-medium">{questionsAnswered}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="bg-purple-600 p-2 rounded mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                            </div>
                            <span className="text-gray-700">Marked for review:</span>
                        </div>
                        <span className="font-medium">{markedForReviewCount}</span>
                    </div>
                </div>
                
                <div className="px-6 pb-6">
                    <button
                        onClick={onSubmit}
                        className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 px-4 rounded font-medium"
                    >
                        Submit Test
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubmitConfirmationModal;