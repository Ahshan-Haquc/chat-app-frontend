import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";

interface AuthState {
  token: string | null;
  user: User | null;
  hydrated: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  hydrated: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    credentialsSet(state, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      if (typeof window !== "undefined") {
        localStorage.setItem("chatapp_token", action.payload.token);
        localStorage.setItem("chatapp_user", JSON.stringify(action.payload.user));
      }
    },
    sessionRestored(state, action: PayloadAction<{ token: string; user: User } | null>) {
      if (action.payload) {
        state.token = action.payload.token;
        state.user = action.payload.user;
      }
      state.hydrated = true;
    },
    loggedOut(state) {
      state.token = null;
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("chatapp_token");
        localStorage.removeItem("chatapp_user");
      }
    }
  }
});

export const { credentialsSet, sessionRestored, loggedOut } = authSlice.actions;
export default authSlice.reducer;
