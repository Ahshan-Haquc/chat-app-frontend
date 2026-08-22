"use client";

import { useEffect, useState } from "react";
import { Search, UserRound } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { useLazySearchUsersQuery } from "@/redux/api/usersApi";
import { useStartDirectConversationMutation } from "@/redux/api/conversationsApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { activeConversationSet } from "@/redux/slice/uiSlice";

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewConversationDialog({ open, onOpenChange }: NewConversationDialogProps) {
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector((state) => state.auth.user?._id);
  const [query, setQuery] = useState("");
  const [triggerSearch, { data: results, isFetching }] = useLazySearchUsersQuery();
  const [startConversation, { isLoading: isStarting }] = useStartDirectConversationMutation();

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    const timeout = setTimeout(() => {
      if (query.trim().length > 0) {
        triggerSearch(query.trim());
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, open, triggerSearch]);

  async function handleSelectUser(userId: string) {
    const conversation = await startConversation({ userId }).unwrap();
    dispatch(activeConversationSet(conversation._id));
    onOpenChange(false);
  }

  const filteredResults = results?.filter((user) => user._id !== currentUserId) ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Start a conversation</DialogTitle>
          <DialogDescription>Search by name or phone number.</DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" size={16} />
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name or phone"
            className="pl-9"
          />
        </div>

        <div className="mt-4 max-h-72 overflow-y-auto">
          {isFetching ? <LoadingSpinner label="Searching" /> : null}

          {!isFetching && query.trim().length > 0 && filteredResults.length === 0 ? (
            <EmptyState icon={UserRound} title="No matches" description="Try a different name or phone number." />
          ) : null}

          {!isFetching &&
            filteredResults.map((user) => (
              <button
                key={user._id}
                disabled={isStarting}
                onClick={() => handleSelectUser(user._id)}
                className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-surface disabled:opacity-50"
              >
                <UserAvatar name={user.name} size="sm" />
                <div>
                  <p className="text-sm font-medium text-ink">{user.name}</p>
                  <p className="text-xs text-ink/50">{user.phone}</p>
                </div>
              </button>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
