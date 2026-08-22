import { baseApi } from "@/redux/api/baseApi";
import type { User } from "@/types";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchUsers: builder.query<User[], string>({
      query: (q) => ({
        url: "/users/search",
        params: { q }
      })
    })
  }),
  overrideExisting: false
});

export const { useSearchUsersQuery, useLazySearchUsersQuery } = usersApi;
