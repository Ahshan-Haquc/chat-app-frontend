import { baseApi } from "@/redux/api/baseApi";
import { conversationsApi } from "@/redux/api/conversationsApi";
import type { RootState } from "@/redux/store";
import type { Message } from "@/types";

export function makeTempMessageId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const messagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation<null, { conversationId: string; text: string; tempId: string }>({
      query: ({ conversationId, text }) => ({
        url: "/messages",
        method: "POST",
        body: { conversationId, text }
      }),
      async onQueryStarted({ conversationId, text, tempId }, { dispatch, queryFulfilled, getState }) {
        const state = getState() as RootState;
        const currentUser = state.auth.user;
        if (!currentUser) return;

        const optimisticMessage: Message = {
          _id: tempId,
          conversationId,
          sender: currentUser,
          text,
          createdAt: new Date().toISOString(),
          status: "sending"
        };

        const patch = dispatch(
          conversationsApi.util.updateQueryData("getMessageHistory", { conversationId }, (draft) => {
            draft.byId[tempId] = optimisticMessage;
          })
        );

        const listPatch = dispatch(
          conversationsApi.util.updateQueryData("listConversations", undefined, (draft) => {
            const target = draft.find((c) => c._id === conversationId);
            if (target) {
              target.lastMessage = optimisticMessage;
              target.updatedAt = optimisticMessage.createdAt;
            }
          })
        );

        try {
          await queryFulfilled;
          dispatch(
            conversationsApi.util.updateQueryData("getMessageHistory", { conversationId }, (draft) => {
              if (draft.byId[tempId]) {
                draft.byId[tempId] = { ...draft.byId[tempId], status: "sent" };
              }
            })
          );
        } catch {
          patch.undo();
          listPatch.undo();
          dispatch(
            conversationsApi.util.updateQueryData("getMessageHistory", { conversationId }, (draft) => {
              draft.byId[tempId] = { ...optimisticMessage, status: "failed" };
            })
          );
        }
      }
    })
  }),
  overrideExisting: false
});

export const { useSendMessageMutation } = messagesApi;
