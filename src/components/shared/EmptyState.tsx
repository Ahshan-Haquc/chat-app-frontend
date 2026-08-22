import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-1 flex-col items-center justify-center gap-3 px-6 py-12 text-center", className)}>
      {Icon ? (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface text-brand">
          <Icon size={22} />
        </div>
      ) : null}
      <div className="space-y-1">
        <p className="text-sm font-medium text-ink">{title}</p>
        {description ? <p className="max-w-xs text-sm text-ink/50">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
