import { createSlice } from '@reduxjs/toolkit';

export const commentSlice = createSlice({
  name: 'collaboration',
  initialState: {
    comments: [],
  },
  reducers: {
    addComments: (state, action) => {
      return { ...state, comments: [...action.payload] };
    },
    deleteComment: (state, action) => {
      const comments = state.comments.filter((comment, index) => index !== action.payload.id);
      return { ...state, comments: [...comments] };
    },
  },
});

export const { addComments, deleteComment } = commentSlice.actions;
export const savedComments = (state) => state.collaboration.comments;
export default commentSlice.reducer;
