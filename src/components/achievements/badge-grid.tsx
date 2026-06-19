"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface BadgeGridProps {
  achievements: {
    achievementId: string;
    title: string;
    description: string;
    icon: string;
    target: number;
    progress: number;
    unlockedAt?: string | Date | null;
    isUnlocked: boolean;
  }[];
}

export function BadgeGrid({ achievements }: BadgeGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {achievements.map((ach) => {
        const percent = Math.min(100, Math.round((ach.progress / ach.target) * 100));

        return (
          <motion.div key={ach.achievementId} variants={item}>
            <Card
              className={cn(
                "glass relative overflow-hidden transition-all duration-300 border-border/40 flex flex-col justify-between h-full",
                ach.isUnlocked
                  ? "border-emerald-500/25 bg-emerald-500/5 hover:border-emerald-500/40 shadow-emerald-950/10 shadow-lg"
                  : "opacity-75 hover:border-border/60"
              )}
            >
              {!ach.isUnlocked && (
                <div className="absolute top-4 right-4 text-muted-foreground bg-muted/30 border border-border/30 h-7 w-7 rounded-full flex items-center justify-center">
                  <Lock className="h-3.5 w-3.5" />
                </div>
              )}

              <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "h-14 w-14 rounded-2xl border flex items-center justify-center text-3xl shrink-0 transition-transform duration-300",
                      ach.isUnlocked
                        ? "bg-emerald-500/10 border-emerald-500/20 scale-100 shadow-inner shadow-emerald-500/10"
                        : "bg-muted border-border/50 grayscale opacity-60"
                    )}
                  >
                    {ach.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className={cn("text-base font-bold leading-none", ach.isUnlocked ? "text-foreground" : "text-muted-foreground")}>
                      {ach.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed pt-1">{ach.description}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-muted-foreground">Progress</span>
                    <span className={ach.isUnlocked ? "text-emerald-500" : "text-muted-foreground"}>
                      {ach.progress}/{ach.target}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", ach.isUnlocked ? "bg-emerald-500" : "bg-muted-foreground/45")}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  {ach.isUnlocked && ach.unlockedAt && (
                    <div className="text-[9px] text-emerald-500/80 font-bold uppercase tracking-wider pt-1">
                      Unlocked on {new Date(ach.unlockedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
