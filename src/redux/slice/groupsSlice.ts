import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { conversationsApi } from "@/redux/api/conversationsApi";
import type { GroupConversation } from "@/types";

interface GroupsState {
  byId: Record<string, GroupConversation>;
}

const initialState: GroupsState = {
  byId: {}
};

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        conversationsApi.endpoints.createGroup.matchFulfilled,
        conversationsApi.endpoints.addGroupMembers.matchFulfilled,
        conversationsApi.endpoints.removeGroupMember.matchFulfilled,
        conversationsApi.endpoints.promoteGroupAdmin.matchFulfilled,
        conversationsApi.endpoints.renameGroup.matchFulfilled
      ),
      (state, action) => {
        state.byId[action.payload._id] = action.payload;
      }
    );
  }
});

export default groupsSlice.reducer;
