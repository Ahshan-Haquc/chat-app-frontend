import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

interface LoadingSpinnerProps {
  label?: string;
  className?: string;
  size?: number;
}

export function LoadingSpinner({ label, className, size = 20 }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 py-8 text-ink/50", className)}>
      <Loader2 className="animate-spin" size={size} />
      {label ? <p className="text-sm">{label}</p> : null}
    </div>
  );
}
