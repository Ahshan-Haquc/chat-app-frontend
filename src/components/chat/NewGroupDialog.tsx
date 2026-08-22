"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useLazySearchUsersQuery } from "@/redux/api/usersApi";
import { useCreateGroupMutation } from "@/redux/api/conversationsApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { activeConversationSet } from "@/redux/slice/uiSlice";
import type { User } from "@/types";

interface NewGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewGroupDialog({ open, onOpenChange }: NewGroupDialogProps) {
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector((state) => state.auth.user?._id);
  const [groupName, setGroupName] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<User[]>([]);
  const [triggerSearch, { data: results, isFetching }] = useLazySearchUsersQuery();
  const [createGroup, { isLoading, error }] = useCreateGroupMutation();

  useEffect(() => {
    if (!open) {
      setGroupName("");
      setQuery("");
      setSelected([]);
      return;
    }
    const timeout = setTimeout(() => {
      if (query.trim().length > 0) {
        triggerSearch(query.trim());
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, open, triggerSearch]);

  function toggleUser(user: User) {
    setSelected((prev) =>
      prev.some((u) => u._id === user._id) ? prev.filter((u) => u._id !== user._id) : [...prev, user]
    );
  }

  async function handleCreate() {
    if (!groupName.trim() || selected.length < 2) return;
    const group = await createGroup({
      name: groupName.trim(),
      participantIds: selected.map((u) => u._id)
    }).unwrap();
    dispatch(activeConversationSet(group._id));
    onOpenChange(false);
  }

  const filteredResults = results?.filter((user) => user._id !== currentUserId) ?? [];
  const canCreate = groupName.trim().length > 0 && selected.length >= 2 && !isLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a group</DialogTitle>
          <DialogDescription>Groups need at least three members including you.</DialogDescription>
        </DialogHeader>

        <Input
          autoFocus
          value={groupName}
          onChange={(event) => setGroupName(event.target.value)}
          placeholder="Group name"
        />

        {selected.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {selected.map((user) => (
              <span
                key={user._id}
                className="flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-xs font-medium text-ink"
              >
                {user.name}
                <button onClick={() => toggleUser(user)} aria-label={`Remove ${user.name}`}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        ) : null}

        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" size={16} />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Add participants by name or phone"
            className="pl-9"
          />
        </div>

        <div className="mt-2 max-h-56 overflow-y-auto">
          {isFetching ? <LoadingSpinner label="Searching" /> : null}
          {!isFetching &&
            filteredResults.map((user) => {
              const isSelected = selected.some((u) => u._id === user._id);
              return (
                <button
                  key={user._id}
                  onClick={() => toggleUser(user)}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-surface"
                >
                  <UserAvatar name={user.name} size="sm" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">{user.name}</p>
                    <p className="text-xs text-ink/50">{user.phone}</p>
                  </div>
                  <span
                    className={`h-4 w-4 rounded border ${isSelected ? "border-accent bg-accent" : "border-ink/20"}`}
                  />
                </button>
              );
            })}
        </div>

        {error ? <p className="mt-2 text-xs text-red-500">Couldn't create the group. Try again.</p> : null}

        <Button className="mt-4 w-full" disabled={!canCreate} onClick={handleCreate}>
          {isLoading ? "Creating..." : `Create group${selected.length ? ` (${selected.length + 1})` : ""}`}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
