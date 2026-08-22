import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  activeConversationId: string | null;
}

const initialState: UiState = {
  activeConversationId: null
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    activeConversationSet(state, action: PayloadAction<string | null>) {
      state.activeConversationId = action.payload;
    }
  }
});

export const { activeConversationSet } = uiSlice.actions;
export default uiSlice.reducer;
