import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  gradient?: boolean;
  className?: string;
}

export function PageHeader({
  title,
  description,
  gradient = true,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-1 pb-4 mb-6 border-b border-border/30", className)}>
      <h1
        className={cn(
          "text-3xl font-extrabold tracking-tight",
          gradient
            ? "bg-gradient-to-r from-foreground via-emerald-600 to-emerald-500 bg-clip-text text-transparent dark:from-foreground dark:via-emerald-400 dark:to-emerald-300"
            : "text-foreground"
        )}
      >
        {title}
      </h1>
      {description && <p className="text-muted-foreground text-sm max-w-2xl mt-1">{description}</p>}
    </div>
  );
}
