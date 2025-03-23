import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  contests: [],
  currentContest: null,
  loading: false,
  error: null,
};

const contestSlice = createSlice({
  name: 'contests',
  initialState,
  reducers: {
    fetchContestsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchContestsSuccess: (state, action) => {
      state.loading = false;
      state.contests = action.payload;
    },
    fetchContestsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentContest: (state, action) => {
      state.currentContest = action.payload;
    },
    clearCurrentContest: (state) => {
      state.currentContest = null;
    },
  },
});

export const {
  fetchContestsStart,
  fetchContestsSuccess,
  fetchContestsFailure,
  setCurrentContest,
  clearCurrentContest,
} = contestSlice.actions;

export default contestSlice.reducer;