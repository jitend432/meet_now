import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: { conversations: [] },
  reducers: {
    setChats: (state, action) => {
      state.conversations = action.payload;
    },
  },
});

export const { setChats } = chatSlice.actions;
export default chatSlice.reducer;