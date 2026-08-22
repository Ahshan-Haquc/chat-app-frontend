import { baseApi } from "@/redux/api/baseApi";
import type { AuthResponse, User } from "@/types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, { phone: string; name: string }>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body
      })
    }),
    getMe: builder.query<User, void>({
      query: () => "/auth/me",
      providesTags: ["Me"]
    })
  }),
  overrideExisting: false
});

export const { useLoginMutation, useGetMeQuery, useLazyGetMeQuery } = authApi;
