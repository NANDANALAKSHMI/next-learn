import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    answers: {},
    markedForReview: []
};

export const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        setAnswer: (state, action) => {
            const { questionId, answer } = action.payload;
            state.answers[questionId] = answer;
        },
        toggleMarked: (state, action) => {
            const questionId = action.payload;
            const index = state.markedForReview.indexOf(questionId);
            if (index === -1) {
                state.markedForReview.push(questionId);
            } else {
                state.markedForReview.splice(index, 1);
            }
        },
        clearQuiz: () => initialState
    }
});

export const { setAnswer, toggleMarked, clearQuiz } = quizSlice.actions;
export default quizSlice.reducer;