import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/redux/api/baseApi";
import authReducer from "@/redux/slice/authSlice";
import uiReducer from "@/redux/slice/uiSlice";
import groupsReducer from "@/redux/slice/groupsSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      ui: uiReducer,
      groups: groupsReducer,
      [baseApi.reducerPath]: baseApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware)
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
