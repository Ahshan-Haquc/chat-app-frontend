# 1. Login / Register User


#### End-point is:

`/auth/login`

#### Method is:

POST

#### Auth required :

No

#### Path Parameters :

None

#### Query Parameters :

None

#### Request Body

```json
{
  "phone": "+15551234367",
  "name": "Ahsan"
}
```

#### Success Response - 200 OK

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "6a8829aae5d6aac97521e638",
    "name": "Ahsan",
    "phone": "+15551234367",
    "createdAt": "2026-08-21T10:34:18.090Z"
  }
}
```
#### Error Responses

If there are missing/invalid request body then it will show 400 status code with something like this response:

```json
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "path": "phone",
        "message": "Required"
      }
    ]
  }
}
```
and If there are any server issue then it will show 500 status code with something a response body:

#### Notes
* I have to store the returned token (like in memory or an httpOnly-friendly approach)
and send it as Authorization: Bearer <token> on subsequent requests.

---


# 2. Get Current User

This endpoint returns the currently authenticated user associated with the provided bearer token. It can be used to restore the user's session after refreshing the page or reopening the application.

#### End-point is:

`/auth/me`

#### Method is:

GET

#### Auth required

Yes

#### Path Parameters

None

#### Query Parameters

None

#### Request Body

None

#### Success Response - 200 OK

```json
{
  "_id": "6a8829aae5d6aac97521e638",
  "name": "Ah",
  "phone": "+15551234367",
  "createdAt": "2026-08-21T10:34:18.090Z"
}
```

#### Error Responses

If the bearer token is missing, invalid, or expired, it will show an authentication error.

#### Notes

* The `Authorization` header must be sent with the request in the following format:
  `Authorization: Bearer <token>`
* This endpoint can be used to restore the logged-in user's session and fetching current user data.

---

# 3. Search Users

This endpoint is used to search for users by their name or phone number. It can be used before starting a new conversation.

#### End-point is:

`/users/search`

#### Method is:

GET

#### Auth required

Yes

#### Path Parameters

None

#### Query Parameters

`q`

#### Request Body

None

#### Success Response - 200 OK

```json
[
  {
    "_id": "6a883437e5d6aac97521f126",
    "name": "Ahsan",
    "phone": "01568222565"
  }
]
```

#### Error Responses

If the search query is missing or invalid, it will show a 400 status code with an appropriate error response.

If there is an authentication issue, it will show an authentication error.

#### Notes

* The `q` query parameter is required.
* The search can be performed using either a user's name or phone number.
* The returned user's `_id` can be used to start a direct conversation.

---

# 4. Start a Direct Conversation

This endpoint is used to start or open a one-to-one conversation with another user.

#### End-point is:

`/conversations`

#### Method is:

POST

#### Auth required

Yes

#### Path Parameters

None

#### Query Parameters

None

#### Request Body

```json
{
  "userId": "6a883437e5d6aac97521f126"
}
```

#### Success Response - 200 OK

```json
{
  "_id": "6a883569e5d6aac97521f43d",
  "participants": [
    "6a8829aae5d6aac97521e638",
    "6a883437e5d6aac97521f126"
  ],
  "createdAt": "2026-08-21T11:24:25.525Z"
}
```

#### Error Responses

If the `userId` is missing or invalid, it will show a 400 status code with an appropriate error response.

If the authenticated user does not have permission to start the conversation, it will show an authentication/authorization error.

#### Notes

* The current user's ID does not need to be sent in the request body.
* The API identifies the current user from the bearer token.
* This endpoint starts or opens a direct one-to-one conversation with the specified user.

---

# 5. Send a Message

This endpoint is used to send a new message to a direct or group conversation.

#### End-point is:

`/messages`

#### Method is:

POST

#### Auth required

Yes

#### Path Parameters

None

#### Query Parameters

None

#### Request Body

```json
{
  "conversationId": "6a883569e5d6aac97521f43d",
  "text": "How are you Ahsan?"
}
```

#### Success Response - 200 OK

```json
null
```

#### Error Responses

If the `conversationId` or `text` is missing/invalid, it will show a 400 status code with an appropriate error response.

If the authenticated user does not have access to the conversation, it will show an authentication/authorization error.

#### Notes

* Empty messages should not be sent from the frontend.
* The message can be sent to both direct and group conversations.
* After sending a message, the API also delivers the message through the WebSocket `message:new` event.
* The REST API currently returns `null` as the successful response body, so the frontend should not depend on this response to obtain the newly created message.
* The WebSocket `message:new` event should be used to receive the new message in real time.

---

# 6. List My Conversations

This endpoint returns all conversations in which the current user is a participant. It includes both direct and group conversations.

#### End-point is:

`/conversations`

#### Method is:

GET

#### Auth required

Yes

#### Path Parameters

None

#### Query Parameters

None

#### Request Body

None

#### Success Response - 200 OK

```json
{
  "data": [
    {
      "_id": "6a883569e5d6aac97521f43d",
      "type": "direct",
      "lastMessage": {},
      "updatedAt": "2026-08-21T11:24:25.525Z",
      "participant": {
        "_id": "6a883437e5d6aac97521f126",
        "name": "Ahsan",
        "phone": "01568222565"
      }
    }
  ]
}
```

#### Error Responses

If the authentication token is missing, invalid, or expired, it will show an authentication error.

#### Notes

* The response contains both direct and group conversations.
* For direct conversations, the `participant` field contains information about the other participant.
* The `_id` of a conversation can be used to retrieve its message history and send messages.

---

# 7. Get Message History

This endpoint is used to get the message history of a specific conversation. It supports pagination so that older messages can be loaded when needed.

#### End-point is:

`/conversations/{id}/messages`

#### Method is:

GET

#### Auth required

Yes

#### Path Parameters

`id` - **string (required)**: it will be the conversation ID that we will get from the list of conversations or from starting a new conversation.

#### Query Parameters

`limit` - **integer (optional)**: Maximum number of messages to return per request.
`before` - **string (optional)**: Cursor used to fetch messages before a specific message.


#### Request Body

None

#### Success Response - 200 OK

```json
{
  "messages": [],
  "hasMore": false
}
```

#### Error Responses

If the conversation ID is invalid or the authenticated user does not have access to the conversation, it will show an appropriate error response.

#### Notes

* `limit` controls how many messages are returned in one request.
* `before` is used to fetch older messages.
* If `hasMore` is `true`, there are more older messages available.
* This pagination can be used to implement loading older messages when the user scrolls to the top of the conversation.
* Authentication is required.

---

# 8. Create a Group Conversation

This endpoint is used to create a new group conversation with multiple participants. The user who creates the group automatically becomes the group creator and an admin.

#### End-point is:

`/conversations/group`

#### Method is:

POST

#### Auth required

Yes

#### Path Parameters

None

#### Query Parameters

None

#### Request Body

```json
{
  "name": "Ahsan Communication Grp",
  "participantIds": [
    "6a883437e5d6aac97521f126",
    "6a8837ffe5d6aac97521faed",
    "6a8837e9e5d6aac97521fab1"
  ]
}
```

#### Success Response - 201 Created

```json
{
  "_id": "6a883883e5d6aac97521fcfb",
  "type": "group",
  "name": "Ahsan Communication Grp",
  "createdBy": "6a8829aae5d6aac97521e638",
  "admins": [
    "6a8829aae5d6aac97521e638"
  ],
  "participants": [
    {
      "_id": "6a8829aae5d6aac97521e638",
      "name": "Ah",
      "phone": "+15551234367"
    },
    {
      "_id": "6a883437e5d6aac97521f126",
      "name": "Ahsan",
      "phone": "01568222565"
    },
    {
      "_id": "6a8837ffe5d6aac97521faed",
      "name": "Bbb",
      "phone": "01563223565"
    },
    {
      "_id": "6a8837e9e5d6aac97521fab1",
      "name": "B",
      "phone": "01568223565"
    }
  ],
  "createdAt": "2026-08-21T11:37:39.153Z",
  "updatedAt": "2026-08-21T11:37:39.153Z"
}
```

#### Error Responses

If the group name or participant IDs are missing/invalid, it will show a 400 status code with an appropriate error response.

#### Notes

* The user creating the group automatically becomes an admin.
* Multiple participants can be added while creating the group.
* Group messages can be sent using the `/messages` endpoint.

---

# 9. Add Members to a Group

This endpoint is used to add one or more members to an existing group conversation.

Only group admins can add new members.

#### End-point is:

`/conversations/{id}/participants`

#### Method is:

POST

#### Auth required

Yes

#### Path Parameters

`id` - **string (required)**: it will be the group conversation ID.

#### Query Parameters

None

#### Request Body

```json
{
  "userIds": [
    "6a8838f0e5d6aac97521fe00"
  ]
}
```

#### Success Response - 200 OK

```json
{
  "_id": "6a883883e5d6aac97521fcfb",
  "type": "group",
  "name": "Ahsan Communication Grp",
  "createdBy": "6a8829aae5d6aac97521e638",
  "admins": [
    "6a8829aae5d6aac97521e638"
  ],
  "participants": [
    {
      "_id": "6a8829aae5d6aac97521e638",
      "name": "Ah",
      "phone": "+15551234367"
    },
    {
      "_id": "6a883437e5d6aac97521f126",
      "name": "Ahsan",
      "phone": "01568222565"
    },
    {
      "_id": "6a8837ffe5d6aac97521faed",
      "name": "Bbb",
      "phone": "01563223565"
    },
    {
      "_id": "6a8837e9e5d6aac97521fab1",
      "name": "B",
      "phone": "01568223565"
    },
    {
      "_id": "6a8838f0e5d6aac97521fe00",
      "name": "ccc",
      "phone": "01569223565"
    }
  ],
  "createdAt": "2026-08-21T11:37:39.153Z",
  "updatedAt": "2026-08-21T11:40:26.634Z"
}
```

#### Error Responses

If the authenticated user is not a group admin, it will show an authorization error.

If the group ID or user IDs are missing/invalid, it will show an appropriate client error.

#### Notes

* Only group admins can add members.
* Multiple users can be added in a single request.
* The users being added should be valid users.

---

# 10. Remove a Member / Leave a Group

This endpoint is used to remove a member from a group. If the current user's own ID is provided, the current user will leave the group.

#### End-point is:

`/conversations/{id}/participants/{userId}`

#### Method is:

DELETE

#### Auth required

Yes

#### Path Parameters

`id` - **string (required)**: it will be the group conversation ID.
`userId` - **string (required)**: it will be the ID of the member to remove. The current user's own ID can be used to leave the group.

#### Query Parameters

None

#### Request Body

None

#### Success Response - 200 OK

```json
{
  "_id": "6a883883e5d6aac97521fcfb",
  "type": "group",
  "name": "Ahsan Communication Grp",
  "createdBy": "6a8829aae5d6aac97521e638",
  "admins": [
    "6a8829aae5d6aac97521e638"
  ],
  "participants": [
    {
      "_id": "6a8829aae5d6aac97521e638",
      "name": "Ah",
      "phone": "+15551234367"
    },
    {
      "_id": "6a883437e5d6aac97521f126",
      "name": "Ahsan",
      "phone": "01568222565"
    },
    {
      "_id": "6a8837e9e5d6aac97521fab1",
      "name": "B",
      "phone": "01568223565"
    },
    {
      "_id": "6a8838f0e5d6aac97521fe00",
      "name": "ccc",
      "phone": "01569223565"
    }
  ],
  "createdAt": "2026-08-21T11:37:39.153Z",
  "updatedAt": "2026-08-21T11:42:30.216Z"
}
```

#### Error Responses

If the authenticated user tries to remove another member without being an admin, it will show an authorization error.

If the group ID or user ID is invalid, it will show an appropriate client error.

#### Notes

* Only group admins can remove other members.
* A user can leave the group by passing their own user ID.
* Authentication is required.

---

# 11. Promote a Member to Admin

This endpoint is used to promote an existing group member to an admin.

Only existing group admins can perform this action.

#### End-point is:

`/conversations/{id}/admins`

#### Method is:

POST

#### Auth required

Yes

#### Path Parameters

`id` - **string (required)**: it will be the group conversation ID.

#### Query Parameters

None

#### Request Body

```json
{
  "userId": "6a883437e5d6aac97521f126"
}
```

#### Success Response - 200 OK

```json
{
  "_id": "6a883883e5d6aac97521fcfb",
  "type": "group",
  "name": "Ahsan Communication Grp",
  "createdBy": "6a8829aae5d6aac97521e638",
  "admins": [
    "6a8829aae5d6aac97521e638",
    "6a883437e5d6aac97521f126"
  ],
  "participants": [
    {
      "_id": "6a8829aae5d6aac97521e638",
      "name": "Ah",
      "phone": "+15551234367"
    },
    {
      "_id": "6a883437e5d6aac97521f126",
      "name": "Ahsan",
      "phone": "01568222565"
    },
    {
      "_id": "6a8837e9e5d6aac97521fab1",
      "name": "B",
      "phone": "01568223565"
    },
    {
      "_id": "6a8838f0e5d6aac97521fab1",
      "name": "ccc",
      "phone": "01569223565"
    }
  ],
  "createdAt": "2026-08-21T11:37:39.153Z",
  "updatedAt": "2026-08-21T11:44:39.804Z"
}
```

#### Error Responses

If the authenticated user is not a group admin, it will show an authorization error.

If the `userId` is missing, invalid, or the user is not a member of the group, it will show an appropriate client error.

#### Notes

* Only group admins can promote members.
* The user being promoted must already be a member of the group.
* After promotion, the user's ID is added to the `admins` array.

---

# 12. Rename a Group

This endpoint is used to change the name of an existing group.

Only group admins can rename the group.

#### End-point is:

`/conversations/{id}`

#### Method is:

PATCH

#### Auth required

Yes

#### Path Parameters

`id` - **string (required)**: it will be the group conversation ID.

#### Query Parameters

None

#### Request Body

```json
{
  "name": "Hello Bangladesh"
}
```

#### Success Response - 200 OK

```json
{
  "_id": "6a883883e5d6aac97521fcfb",
  "type": "group",
  "name": "Hello Bangladesh",
  "createdBy": "6a8829aae5d6aac97521e638",
  "admins": [
    "6a8829aae5d6aac97521e638",
    "6a883437e5d6aac97521f126"
  ],
  "participants": [
    {
      "_id": "6a8829aae5d6aac97521e638",
      "name": "Ah",
      "phone": "+15551234367"
    },
    {
      "_id": "6a883437e5d6aac97521f126",
      "name": "Ahsan",
      "phone": "01568222565"
    },
    {
      "_id": "6a8837e9e5d6aac97521fab1",
      "name": "B",
      "phone": "01568223565"
    },
    {
      "_id": "6a8838f0e5d6aac97521fe00",
      "name": "ccc",
      "phone": "01568223565"
    }
  ],
  "createdAt": "2026-08-21T11:37:39.153Z",
  "updatedAt": "2026-08-21T11:46:48.925Z"
}
```

#### Error Responses

If the `name` is missing/invalid, it will show a 400 status code with an appropriate error response.

If the authenticated user is not a group admin, it will show an authorization error.

#### Notes

* Only group admins can rename a group.
* The `id` in the URL must be the group ID.
* Authentication is required.
