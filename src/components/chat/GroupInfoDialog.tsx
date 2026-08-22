"use client";

import { useState } from "react";
import { Crown, Search, UserMinus, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  useAddGroupMembersMutation,
  useRemoveGroupMemberMutation,
  usePromoteGroupAdminMutation,
  useRenameGroupMutation
} from "@/redux/api/conversationsApi";
import { useLazySearchUsersQuery } from "@/redux/api/usersApi";
import { useAppSelector } from "@/redux/hooks";
import type { ConversationListItem } from "@/types";

interface GroupInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversation: ConversationListItem;
}

export function GroupInfoDialog({ open, onOpenChange, conversation }: GroupInfoDialogProps) {
  const currentUserId = useAppSelector((state) => state.auth.user?._id);
  const isAdmin = Boolean(currentUserId && conversation.admins?.includes(currentUserId));

  const [name, setName] = useState(conversation.name ?? "");
  const [query, setQuery] = useState("");
  const [triggerSearch, { data: results, isFetching }] = useLazySearchUsersQuery();

  const [renameGroup, { isLoading: isRenaming }] = useRenameGroupMutation();
  const [addMembers, { isLoading: isAdding }] = useAddGroupMembersMutation();
  const [removeMember] = useRemoveGroupMemberMutation();
  const [promoteAdmin] = usePromoteGroupAdminMutation();

  const existingIds = new Set((conversation.participants ?? []).map((p) => p._id));
  const searchResults = (results ?? []).filter((u) => !existingIds.has(u._id));

  function handleSearch(value: string) {
    setQuery(value);
    if (value.trim().length > 0) {
      triggerSearch(value.trim());
    }
  }

  async function handleRename() {
    if (!name.trim() || name.trim() === conversation.name) return;
    await renameGroup({ conversationId: conversation._id, name: name.trim() });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle>Group details</DialogTitle>
          <DialogDescription>{conversation.participants?.length ?? 0} members</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <Input value={name} onChange={(event) => setName(event.target.value)} disabled={!isAdmin} />
          {isAdmin ? (
            <Button size="sm" onClick={handleRename} disabled={isRenaming} className={`bg-accent text-white rounded-lg py-1 hover:bg-black`}>
              Save
            </Button>
          ) : null}
        </div>

        <div className="mt-4 max-h-48 space-y-1 overflow-y-auto">
          {conversation.participants?.map((participant) => {
            const participantIsAdmin = conversation.admins?.includes(participant._id);
            const isSelf = participant._id === currentUserId;
            return (
              <div key={participant._id} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-surface">
                <UserAvatar name={participant.name} size="sm" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">
                    {participant.name} {isSelf ? <span className="text-ink/40">(you)</span> : null}
                  </p>
                  {participantIsAdmin ? (
                    <p className="flex items-center gap-1 text-xs text-accent">
                      <Crown size={11} /> Admin
                    </p>
                  ) : null}
                </div>
                {isAdmin && !participantIsAdmin && !isSelf ? (
                  <button
                    title="Make admin"
                    onClick={() => promoteAdmin({ conversationId: conversation._id, userId: participant._id })}
                    className="rounded-lg p-1.5 text-ink/40 hover:bg-white hover:text-accent"
                  >
                    <Crown size={14} />
                  </button>
                ) : null}
                {isAdmin || isSelf ? (
                  <button
                    title={isSelf ? "Leave group" : "Remove member"}
                    onClick={() => removeMember({ conversationId: conversation._id, userId: participant._id })}
                    className="rounded-lg p-1.5 text-ink/40 hover:bg-white hover:text-red-500"
                  >
                    <UserMinus size={14} />
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>

        {isAdmin ? (
          <div className="mt-4 border-t border-ink/10 pt-4">
            <p className="mb-2 flex items-center gap-1 text-xs font-medium text-ink/50">
              <UserPlus size={12} /> Add members
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" size={16} />
              <Input
                value={query}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder="Search name or phone"
                className="pl-9"
              />
            </div>
            <div className="mt-2 max-h-40 overflow-y-auto">
              {isFetching ? <LoadingSpinner label="Searching" /> : null}
              {!isFetching &&
                searchResults.map((user) => (
                  <button
                    key={user._id}
                    disabled={isAdding}
                    onClick={() => addMembers({ conversationId: conversation._id, userIds: [user._id] })}
                    className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-surface disabled:opacity-50"
                  >
                    <UserAvatar name={user.name} size="sm" />
                    <span className="text-sm text-ink">{user.name}</span>
                  </button>
                ))}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
