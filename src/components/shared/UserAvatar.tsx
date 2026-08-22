import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/utils/cn";

interface UserAvatarProps {
  name: string;
  isGroup?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg"
};

export function UserAvatar({ name, isGroup, size = "md", className="text-white" }: UserAvatarProps) {
  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarFallback className={cn(isGroup ? "bg-accent" : "bg-brand")}>
        {isGroup ? "GRP" : getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
