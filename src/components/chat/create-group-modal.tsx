"use client";

import { User } from "@/lib/types";
import { useState } from "react";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onCreateGroup: (groupName: string, selectedUserIds: string[]) => void;
}

export function CreateGroupModal({ isOpen, onClose, users, onCreateGroup }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleUser = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedIds.length === 0) return;
    onCreateGroup(groupName, selectedIds);
    setGroupName("");
    setSelectedIds([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-brand-navy bg-brand-black p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-brand-gray mb-4">Create Group Conversation</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-brand-gray/70 mb-1">Group Name</label>
            <input
              type="text"
              placeholder="e.g. Frontend Team"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full rounded-xl border border-brand-navy bg-brand-navy/30 px-4 py-2.5 text-sm text-brand-gray focus:border-brand-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-gray/70 mb-2">Select Members</label>
            <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => toggleUser(user.id)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
                    selectedIds.includes(user.id)
                      ? "border-brand-orange bg-brand-orange/10"
                      : "border-brand-navy/50 bg-brand-navy/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium text-brand-gray">{user.name}</p>
                      <p className="text-xs text-brand-gray/50">{user.phone}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(user.id)}
                    onChange={() => {}}
                    className="accent-brand-orange"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm text-brand-gray/70 hover:text-brand-gray"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!groupName.trim() || selectedIds.length === 0}
              className="rounded-xl bg-brand-orange px-5 py-2 text-sm font-medium text-brand-black disabled:opacity-50"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}