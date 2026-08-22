"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { sessionRestored } from "@/redux/slice/authSlice";
import type { User } from "@/types";

export function useSessionRestore() {
  const dispatch = useAppDispatch();
  const hydrated = useAppSelector((state) => state.auth.hydrated);

  useEffect(() => {
    if (hydrated) return;
    const token = localStorage.getItem("chatapp_token");
    const rawUser = localStorage.getItem("chatapp_user");
    if (token && rawUser) {
      try {
        const user = JSON.parse(rawUser) as User;
        dispatch(sessionRestored({ token, user }));
        return;
      } catch {
        dispatch(sessionRestored(null));
        return;
      }
    }
    dispatch(sessionRestored(null));
  }, [dispatch, hydrated]);

  return { hydrated };
}
