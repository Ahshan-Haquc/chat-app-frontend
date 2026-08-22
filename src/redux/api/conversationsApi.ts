import { baseApi } from "@/redux/api/baseApi";
import type {
  ConversationListItem,
  GroupConversation,
  Message,
  MessageHistoryResponse,
  MessagesCache
} from "@/types";

interface ListConversationsResponse {
  data: ConversationListItem[];
}

interface GetMessagesArgs {
  conversationId: string;
  before?: string;
  limit?: number;
}

export const conversationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listConversations: builder.query<ConversationListItem[], void>({
      query: () => "/conversations",
      transformResponse: (response: ListConversationsResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((c) => ({ type: "Conversations" as const, id: c._id })),
              { type: "Conversations" as const, id: "LIST" }
            ]
          : [{ type: "Conversations" as const, id: "LIST" }]
    }),

    startDirectConversation: builder.mutation<ConversationListItem, { userId: string }>({
      query: (body) => ({
        url: "/conversations",
        method: "POST",
        body
      }),
      invalidatesTags: [{ type: "Conversations", id: "LIST" }]
    }),

    createGroup: builder.mutation<GroupConversation, { name: string; participantIds: string[] }>({
      query: (body) => ({
        url: "/conversations/group",
        method: "POST",
        body
      }),
      invalidatesTags: [{ type: "Conversations", id: "LIST" }]
    }),

    addGroupMembers: builder.mutation<GroupConversation, { conversationId: string; userIds: string[] }>({
      query: ({ conversationId, userIds }) => ({
        url: `/conversations/${conversationId}/participants`,
        method: "POST",
        body: { userIds }
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Conversations", id: arg.conversationId }]
    }),

    removeGroupMember: builder.mutation<GroupConversation, { conversationId: string; userId: string }>({
      query: ({ conversationId, userId }) => ({
        url: `/conversations/${conversationId}/participants/${userId}`,
        method: "DELETE"
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Conversations", id: arg.conversationId }, { type: "Conversations", id: "LIST" }]
    }),

    promoteGroupAdmin: builder.mutation<GroupConversation, { conversationId: string; userId: string }>({
      query: ({ conversationId, userId }) => ({
        url: `/conversations/${conversationId}/admins`,
        method: "POST",
        body: { userId }
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Conversations", id: arg.conversationId }]
    }),

    renameGroup: builder.mutation<GroupConversation, { conversationId: string; name: string }>({
      query: ({ conversationId, name }) => ({
        url: `/conversations/${conversationId}`,
        method: "PATCH",
        body: { name }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Conversations", id: arg.conversationId },
        { type: "Conversations", id: "LIST" }
      ]
    }),

    getMessageHistory: builder.query<MessagesCache, GetMessagesArgs>({
      query: ({ conversationId, before, limit = 30 }) => ({
        url: `/conversations/${conversationId}/messages`,
        params: { limit, ...(before ? { before } : {}) }
      }),
      transformResponse: (response: MessageHistoryResponse): MessagesCache => {
        const byId: Record<string, Message> = {};
        for (const message of response.messages) {
          byId[message._id] = { ...message, status: "sent" };
        }
        return { byId, hasMore: response.hasMore };
      },
      serializeQueryArgs: ({ queryArgs }) => queryArgs.conversationId,
      merge: (currentCache, newCache, { arg }) => {
        if (!arg.before) {
          currentCache.byId = newCache.byId;
          currentCache.hasMore = newCache.hasMore;
          return;
        }
        currentCache.byId = { ...newCache.byId, ...currentCache.byId };
        currentCache.hasMore = newCache.hasMore;
      },
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.before !== previousArg?.before,
      providesTags: (result, error, arg) => [{ type: "Messages", id: arg.conversationId }]
    })
  }),
  overrideExisting: false
});

export const {
  useListConversationsQuery,
  useStartDirectConversationMutation,
  useCreateGroupMutation,
  useAddGroupMembersMutation,
  useRemoveGroupMemberMutation,
  usePromoteGroupAdminMutation,
  useRenameGroupMutation,
  useGetMessageHistoryQuery
} = conversationsApi;
