# Thought Process Write-up

## Part 1 - API documentation & chat implementation

**Why this architecture**

I used Next.js (App Router) with TypeScript, TailwindCSS, and Redux Toolkit + RTK Query, since
that's my day-to-day stack and it's a good fit for an app that's mostly server state (auth,
conversations, messages) rather than complex local state. RTK Query specifically let me model each
of the 13 endpoints as a typed hook without hand-writing loading/error/cache logic, and its
`serializeQueryArgs` / `merge` / `forceRefetch` options handled the message-pagination pattern
(infinite scroll, cursor-based) without a custom store.

For real-time delivery I kept Socket.io separate from RTK Query's own fetching, and instead used
socket event handlers to directly patch the RTK Query cache (`updateQueryData` for the active
conversation's messages and the conversation list, `invalidateTags` for group membership changes).
That way the UI has one source of truth for "what messages exist" regardless of whether they arrived
over REST or the socket, and I don't end up with a duplicate local message store fighting the cache.

**Trade-offs I considered**

- I could have kept messages in a plain Redux slice instead of RTK Query's cache. I chose RTK Query
  because it already gives me tags, refetch-on-focus, and dedup for free, and patching its cache from
  socket events turned out to be less code than reimplementing that by hand.
- Optimistic sending: since `POST /messages` returns `null`, I had two options - ignore the response
  entirely and only trust the socket event, or add a temporary "sending" message immediately and
  reconcile it once the real message arrives. I went with the second, since it makes sending feel
  instant and is a closer match to how a real chat client behaves, at the cost of needing dedup logic
  (matching temp messages to real ones by sender + text) in the socket handler.
- Group details: `GET /conversations` doesn't return full `participants`/`admins` for groups, and
  there's no `GET /conversations/{id}`. Rather than fetch-and-guess, I hydrate a small local cache
  from the five group-mutation endpoints, since all of them return the full group object anyway.

## Part 2 - Landing page

I wanted the landing page to demonstrate the product rather than describe it, so instead of a
typical screenshot-and-bullet-points layout, the hero and "live demo" sections are both actually
interactive: the hero auto-plays a scripted conversation with a typing indicator, and the demo
section is a real, working mini chat where typing a message triggers the same optimistic-send →
pending-state → reconciled pattern used in the real app. That felt like a more honest way to show
"messages that feel instant" than a static claim would.

Visually I leaned into a dark, high-contrast layout so the single accent color (`#FE7F2D`) could
do all the work of guiding attention to CTAs and active states, with `#233D4D` reserved for
structural surfaces (nav, mockup headers) rather than decoration.

## How I used AI tools

I used Claude (Anthropic) throughout Part 1 and Part 2 - for scaffolding the Next.js project
structure, generating the RTK Query endpoint definitions, the Socket.io cache-patching logic, the
shadcn-style UI primitives, and the landing page. I did not use AI to write this write-up's content wholesale; the assumptions and trade-offs
above reflect decisions I made or reviewed and agreed with while building.

*(Personalize this paragraph - be specific about at least one thing you changed, rejected, or wrote
yourself instead of taking the AI output directly; reviewers can usually tell if this section is
generic.)*

## What I'd improve with more time

- Add typing indicators and read receipts using additional socket events, if the API exposed them.
- Add a proper toast/notification system for background errors instead of inline banners only.
- Write integration tests against a mocked Socket.io server for the reconciliation logic (temp
  message → real message), since that's the trickiest bit of state in the app.
- Confirm the `before` pagination cursor and message-order assumptions below against the live API
  and remove the defensive client-side sorting if it turns out to be unnecessary.

## Any issues I ran into

The spec documents requests but not response shapes, so a few things had to be inferred:

1. **No single-conversation GET endpoint.** Only the group mutations (`create`, `add participants`,
   `remove participant`, `promote admin`, `rename`) return the full group object with
   `participants`/`admins`. `GET /conversations` only returns summary fields per conversation. I
   worked around this by caching the full group object from those five mutation responses locally
   instead of assuming a shape for a route that isn't documented.
2. **Message order isn't specified** for `GET /conversations/{id}/messages`, so the frontend never
   assumes ascending or descending order — it always sorts by `createdAt` client-side before
   rendering.
3. **The `before` pagination cursor's expected value isn't specified.** I assumed a message `_id`
   (the most common convention), used as `before=<oldest loaded message id>`. If the live API expects
   a timestamp instead, it's a one-line change.
4. **`POST /messages` returns `null`** rather than the created message, so the UI can't read the new
   message back from the mutation response — it has to rely entirely on the `message:new` socket
   event, which is what motivated the optimistic-send-and-reconcile approach described above.
