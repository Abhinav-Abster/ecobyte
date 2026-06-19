"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Star } from "lucide-react";
import { motion } from "motion/react";

interface StreakDisplayProps {
  streak: number;
  xp: number;
}

export function StreakDisplay({ streak, xp }: StreakDisplayProps) {
  const currentLevel = Math.floor(xp / 100) + 1;
  const levelProgress = xp % 100;

  return (
    <Card className="glass border-border/40 overflow-hidden relative">
      <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Streak */}
        <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-border/40 pb-4 md:pb-0">
          <div className="h-12 w-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
            <Flame className="h-6 w-6 fill-orange-500 animate-pulse" />
          </div>
          <div>
            <span className="text-2xl font-black text-foreground">{streak} Days</span>
            <span className="text-xs text-muted-foreground block">Active Green Streak</span>
          </div>
        </div>

        {/* Level */}
        <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-border/40 pb-4 md:pb-0">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Star className="h-6 w-6 fill-emerald-400" />
          </div>
          <div>
            <span className="text-2xl font-black text-foreground">Level {currentLevel}</span>
            <span className="text-xs text-muted-foreground block">{xp} Total XP</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-muted-foreground">Next Level Progress</span>
            <span className="text-emerald-500 font-bold">{levelProgress}/100 XP</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
