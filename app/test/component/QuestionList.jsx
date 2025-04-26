'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Header from './Header';
import QuestionDisplay from './QuestionDisplay';
import QuestionNavigation from './QuestionNavigation';

import { getQuestions, postAnswer } from '@/app/ApiService/apiServices';
import Cookies from 'js-cookie';
import { setAnswer, toggleMarked, clearQuiz } from '@/app/redux/slice/quizSlice';
import SubmitConfirmationModal from '@/app/shared/SubmitConfirmationModal';

const QuestionList = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { answers, markedForReview } = useSelector((state) => state.quiz);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(8 * 60 + 30);
    const [questionStatus, setQuestionStatus] = useState({});
    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const hasFetched = useRef(false);

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

    useEffect(() => {
        if (quizData?.questions) {
            const questionNumber = quizData.questions[currentQuestionIndex].number;
            setQuestionStatus(prev => ({
                ...prev,
                [questionNumber]: prev[questionNumber] === 'unanswered' ? 'attended' : prev[questionNumber]
            }));
        }
    }, [currentQuestionIndex, quizData]);

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
                        const questionNumber = question.number;
                        if (answers[question.question_id] !== undefined) {
                            initialStatus[questionNumber] = markedForReview.includes(question.question_id)
                                ? 'answered-review'
                                : 'answered';
                        } else if (markedForReview.includes(question.question_id)) {
                            initialStatus[questionNumber] = 'review';
                        } else {
                            initialStatus[questionNumber] = 'unanswered';
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

        const questionNumber = quizData.questions.find(q => q.question_id === questionId)?.number;
        if (questionNumber) {
            setQuestionStatus(prev => ({
                ...prev,
                [questionNumber]: markedForReview.includes(questionId)
                    ? 'answered-review'
                    : 'answered'
            }));
        }
    };

    const handleMarkForReview = () => {
        const questionId = quizData.questions[currentQuestionIndex].question_id;
        const questionNumber = quizData.questions[currentQuestionIndex].number;
        dispatch(toggleMarked(questionId));

        setQuestionStatus(prev => ({
            ...prev,
            [questionNumber]: markedForReview.includes(questionId)
                ? answers[questionId] ? 'answered' : 'attended'
                : answers[questionId] ? 'answered-review' : 'review'
        }));
    };

    const confirmSubmit = () => {
        setShowSubmitModal(true);
    };

    const submitAnswers = async (isFinalSubmit = false) => {
        if (isSubmitting || !quizData?.questions) return;

        setIsSubmitting(true);
        try {
            const token = Cookies.get("access_token");
            if (!token) throw new Error("Token not found");

            quizData.questions.forEach(question => {
                if (answers[question.question_id] === undefined) {
                    dispatch(setAnswer({ questionId: question.question_id, answer: null }));
                }
            });

            const answersArray = quizData.questions.map(question => ({
                question_id: question.question_id,
                selected_option_id: answers[question.question_id] || null,
                marked_for_review: markedForReview.includes(question.question_id)
            }));

            const formData = new FormData();
            formData.append('answers', JSON.stringify(answersArray));

            await postAnswer(token, formData);

            if (isFinalSubmit) {
                dispatch(clearQuiz());
                router.push('/results');
            }
        } catch (err) {
            console.error("Submission error:", err);
        } finally {
            setIsSubmitting(false);
            setShowSubmitModal(false);
        }
    };

    const goToQuestion = (index) => {
        setCurrentQuestionIndex(index);
    };

    const navigateQuestion = (direction) => {
        const questionId = quizData.questions[currentQuestionIndex].question_id;
        const questionNumber = quizData.questions[currentQuestionIndex].number;


        if (answers[questionId] === undefined) {
            dispatch(setAnswer({ questionId, answer: null }));
            setQuestionStatus(prev => ({
                ...prev,
                [questionNumber]: markedForReview.includes(questionId)
                    ? 'review'
                    : 'attended'
            }));
        }

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


    const questionsAnswered = Object.keys(answers).filter(key => answers[key] !== null && answers[key] !== undefined).length;

    return (

        <>
            <div className="flex flex-col h-screen px-10">
                <Header
                    title="Web Design MCQ Quiz"
                    questionNumber={currentQuestion.number}
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
                                className={`px-6 py-2 rounded flex-1 ${markedForReview.includes(currentQuestion.question_id)
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
                                    onClick={confirmSubmit}
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
                            totalQuestions={quizData.questions.length}
                            currentQuestion={currentQuestion.number}
                            questionStatus={questionStatus}
                            onQuestionClick={(num) => {
                                const index = quizData.questions.findIndex(q => q.number === num);
                                if (index !== -1) goToQuestion(index);
                            }}
                        />
                    </div>
                </div>

                {/* Submit Confirmation Modal */}

            </div>
            <SubmitConfirmationModal
                isOpen={showSubmitModal}
                onClose={() => setShowSubmitModal(false)}
                onSubmit={() => submitAnswers(true)}
                timeRemaining={formatTime(timeRemaining)}
                totalQuestions={quizData.questions.length}
                questionsAnswered={questionsAnswered}
                markedForReviewCount={markedForReview.length}
            />
        </>
    );
};

export default QuestionList;