
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  answers: {},
  markedForReview: [],
};

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setAnswer: (state, action) => {
      state.answers[action.payload.questionId] = action.payload.answer;
    },
    toggleMarked: (state, action) => {
      const index = state.markedForReview.indexOf(action.payload);
      if (index >= 0) {
        state.markedForReview.splice(index, 1);
      } else {
        state.markedForReview.push(action.payload);
      }
    },
    clearQuiz: () => initialState,
  },
});

export const { setAnswer, toggleMarked, clearQuiz } = quizSlice.actions;
export default quizSlice.reducer;