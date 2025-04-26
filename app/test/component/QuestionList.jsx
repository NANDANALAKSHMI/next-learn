'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Header from './Header';
import QuestionDisplay from './QuestionDisplay';
import QuestionNavigation from './QuestionNavigation';
import { getQuestions, postAnswer } from '@/app/ApiService/apiServices';
import Cookies from 'js-cookie';
import { setAnswer, toggleMarked, clearQuiz } from '@/app/redux/slice/quizSlice';

const QuestionList = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { answers, markedForReview } = useSelector((state) => state.quiz);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(87 * 60 + 13);
    const [questionStatus, setQuestionStatus] = useState({});
    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const hasFetched = useRef(false);
    const autoSaveTimer = useRef(null);

    // Timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    submitAnswers(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Auto-save effect
    // useEffect(() => {
    //     autoSaveTimer.current = setInterval(() => {
    //         submitAnswers(false);
    //     }, 30000); // Auto-save every 30 seconds

    //     return () => {
    //         if (autoSaveTimer.current) {
    //             clearInterval(autoSaveTimer.current);
    //         }
    //     };
    // }, [answers, markedForReview]);

    // Fetch questions
    useEffect(() => {
        if (!hasFetched.current) {
            const fetchQuestions = async () => {
                try {
                    const token = Cookies.get("access_token");
                    if (!token) throw new Error("Authentication token not found");

                    const response = await getQuestions(token);
                    if (!response?.data?.success) throw new Error(response?.data?.message || "Invalid data");

                    const initialStatus = {};
                    response.data.questions.forEach(question => {
                        if (answers[question.question_id] !== undefined) {
                            initialStatus[question.question_id] = markedForReview.includes(question.question_id)
                                ? 'answered-review'
                                : 'answered';
                        } else if (markedForReview.includes(question.question_id)) {
                            initialStatus[question.question_id] = 'review';
                        } else {
                            initialStatus[question.question_id] = 'unanswered';
                        }
                    });

                    setQuizData(response.data);
                    setQuestionStatus(initialStatus);
                } catch (err) {
                    setError(err.message || "Failed to load questions");
                } finally {
                    setLoading(false);
                }
            };

            fetchQuestions();
            hasFetched.current = true;
        }
    }, [answers, markedForReview]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerSelect = (questionId, answer) => {
        dispatch(setAnswer({ questionId, answer }));

        setQuestionStatus(prev => ({
            ...prev,
            [questionId]: markedForReview.includes(questionId)
                ? 'answered-review'
                : 'answered'
        }));
    };

    const handleMarkForReview = () => {
        const questionId = quizData.questions[currentQuestionIndex].question_id;
        dispatch(toggleMarked(questionId));

        setQuestionStatus(prev => ({
            ...prev,
            [questionId]: markedForReview.includes(questionId)
                ? answers[questionId] ? 'answered' : 'attended'
                : answers[questionId] ? 'answered-review' : 'review'
        }));
    };

    const submitAnswers = async (isFinalSubmit = false) => {
        if (isSubmitting || !quizData?.questions) return;
    
        setIsSubmitting(true);
        try {
            const token = Cookies.get("access_token");
            if (!token) throw new Error("Token not found");
    
            const formData = new FormData();
    
            // Convert answers with integer IDs
            const answersArray = Object.entries(answers).map(([question_id, selected_option_id]) => ({
                question_id: parseInt(question_id, 10),
                selected_option_id: parseInt(selected_option_id, 10),
                marked_for_review: markedForReview.includes(question_id)
            }));
    
            // Append as JSON string
            formData.append('answers', JSON.stringify(answersArray));
    
            console.log('Processed answers:', answersArray);
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }
    
            await postAnswer(token, formData);
    
            if (isFinalSubmit) {
                dispatch(clearQuiz());
                // router.push('/results');
            }
        } catch (err) {
            console.error("Submission error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const goToQuestion = async (index) => {
        await submitAnswers(false);
        setCurrentQuestionIndex(index);
    };

    const navigateQuestion = (direction) => {
        const newIndex = direction === 'next'
            ? Math.min(currentQuestionIndex + 1, quizData.questions.length - 1)
            : Math.max(currentQuestionIndex - 1, 0);

        setCurrentQuestionIndex(newIndex);
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
    if (!quizData?.questions?.length) return <div className="flex justify-center items-center h-screen">No questions found.</div>;

    const currentQuestion = quizData.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quizData.questions.length - 1;

    return (
        <div className="flex flex-col h-screen px-10">
            <Header
                title="Ancient Indian History MCQ"
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={quizData.questions.length}
                timeRemaining={formatTime(timeRemaining)}
            />

            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 p-4 overflow-y-auto">
                    <QuestionDisplay
                        questionData={currentQuestion}
                        currentAnswer={answers[currentQuestion.question_id]}
                        onAnswerSelect={(answer) => handleAnswerSelect(currentQuestion.question_id, answer)}
                    />

                    <div className="flex justify-between py-4 gap-3">
                        <button
                            className={`px-6 py-2 rounded flex-1 ${
                                markedForReview.includes(currentQuestion.question_id)
                                    ? "bg-purple-700 text-white"
                                    : "bg-[#800080] text-white"
                            }`}
                            onClick={handleMarkForReview}
                        >
                            {markedForReview.includes(currentQuestion.question_id)
                                ? "Unmark Review"
                                : "Mark for Review"}
                        </button>

                        <button
                            className="bg-gray-300 text-black px-6 py-2 rounded flex-1"
                            onClick={() => navigateQuestion('prev')}
                            disabled={currentQuestionIndex === 0}
                        >
                            Previous
                        </button>

                        {isLastQuestion ? (
                            <button
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded flex-1"
                                onClick={() => submitAnswers(true)}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "Submit Quiz"}
                            </button>
                        ) : (
                            <button
                                className="bg-gray-800 text-white px-6 py-2 rounded flex-1"
                                onClick={() => navigateQuestion('next')}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>

                <div className="w-80 p-4 bg-gray-50 border-l overflow-y-auto">
                <QuestionNavigation
                        totalQuestions={quizData.questions_count}
                        currentQuestion={currentQuestionIndex + 1}
                        questionStatus={questionStatus}
                        markedForReview={markedForReview}
                        onQuestionClick={goToQuestion}
                    />

                </div>
            </div>
        </div>
    );
};

export default QuestionList;