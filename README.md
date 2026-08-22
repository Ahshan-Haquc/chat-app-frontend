# Chatly - Chat Application

Next.js 14 (App Router) + TypeScript + TailwindCSS + shadcn-style UI + Redux Toolkit + RTK Query + Socket.io client.

Live link : https://chatly-steel.vercel.app

## Setup

```
npm install
cp .env.local.example .env.local
npm run dev
```

## Folder structure

```
src/
  app/
    layout.tsx            root layout, loads Providers + global styles
    providers.tsx          client component wrapping <Provider store>
    page.tsx                redirects to /login or /chat based on session
    login/page.tsx          phone + name login/registration
    chat/page.tsx            guarded chat route, wires the socket, renders sidebar + panel

  components/
    ui/                     small shadcn-style primitives (button, input, dialog, avatar)
    shared/                 cross-feature reusable pieces (avatar, loading, empty, error states)
    chat/
      ConversationSidebar.tsx   conversation list + new chat / new group entry points
      ConversationRow.tsx       single row in the sidebar
      NewConversationDialog.tsx search users, start a direct conversation
      NewGroupDialog.tsx        search + multi-select users, create a group
      ChatPanel.tsx             header + message list + composer for the active conversation
      MessageList.tsx           pagination, auto-scroll, day dividers
      MessageBubble.tsx         single message, sender vs receiver styling
      MessageInput.tsx          composer, blocks empty sends
      GroupInfoDialog.tsx       rename group, add/remove members, promote admins

  lib/
    types/index.ts          shared TypeScript types + small helpers
    redux/
      store.ts               store setup
      hooks.ts                typed useAppDispatch / useAppSelector
      useSessionRestore.ts    restores token/user from localStorage on load
      slices/
        authSlice.ts          token + current user, persisted to localStorage
        uiSlice.ts             active conversation id
        groupsSlice.ts         local cache of full group objects (see note below)
      api/
        baseApi.ts             RTK Query base, injects Authorization header
        authApi.ts              /auth/login, /auth/me
        usersApi.ts              /users/search
        conversationsApi.ts      /conversations*, message history pagination
        messagesApi.ts           /messages send, with optimistic UI
    socket/
      socketClient.ts          socket.io-client singleton
      useChatSocket.ts          wires message:new / conversation:updated into RTK Query cache
    utils/
      cn.ts, formatTime.ts
```

## Notes on assumptions made against the given Swagger spec

The spec documents requests but not response shapes, so a few things were inferred from the sample
responses given in the assignment brief and filled in where genuinely undocumented:

1. **No single-conversation GET endpoint.** Only `POST /conversations/group`, `POST/DELETE
   .../participants`, `POST .../admins`, and `PATCH /conversations/{id}` return the full group
   object (`participants`, `admins`, etc). `GET /conversations` only returns summary fields. Rather
   than guess a response shape for a route that doesn't exist, `groupsSlice.ts` captures the full
   group object from each of those five mutation responses and the UI prefers that cache over the
   summary list item. This is called out as a gap in the write-up.
2. **Message history ordering.** The spec doesn't say whether `GET /conversations/{id}/messages`
   returns newest-first or oldest-first. The frontend never assumes an order — it always sorts by
   `createdAt` client-side before rendering, so it's correct either way.
3. **`before` cursor value.** Assumed to be a message `_id` (the oldest currently-loaded message),
   which is the most common convention for this kind of pagination. If the live API expects an ISO
   timestamp instead, only the one call site in `MessageList.tsx` (`setBefore(oldest._id)`) needs to
   change.
4. **`POST /messages` returns `null`.** The UI never reads the mutation response. It adds an
   optimistic "sending" message immediately, then reconciles it against the real message that
   arrives over the `message:new` socket event (matched by sender + text, then replaced/deduped by
   real `_id`). This also covers the case where the socket delivers the message before the HTTP
   response resolves.
5. **Auto-scroll.** Scrolls to the newest message automatically only if the user was already near
   the bottom; otherwise a "New messages" pill appears instead of yanking their scroll position.
