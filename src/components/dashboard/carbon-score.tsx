"use client";

import React, { useEffect, useState } from "react";
import { ScoreCategory } from "@/types";
import { getScoreColor } from "@/lib/carbon-calculator";
import { SCORE_BADGES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

interface CarbonScoreProps {
  score: number;
  category: ScoreCategory;
}

export function CarbonScore({ score, category }: CarbonScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const color = getScoreColor(score);
  const badgeInfo = SCORE_BADGES[category] || { emoji: "🌍", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 150);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = 70;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center py-4 text-center space-y-4">
      <div className="relative flex items-center justify-center">
        <svg className="w-44 h-44 transform -rotate-90">
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke="var(--color-border)"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="opacity-30"
          />
          <motion.circle
            cx="88"
            cy="88"
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-4xl font-black tracking-tight text-foreground"
          >
            {score}
          </motion.span>
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground mt-0.5">
            Carbon Score
          </span>
        </div>
      </div>

      <div className="space-y-1 flex flex-col items-center">
        <div className="flex items-center gap-1.5 text-lg font-extrabold text-foreground">
          <span className="text-xl">{badgeInfo.emoji}</span>
          <span>{category}</span>
        </div>
        <Badge variant="outline" className={badgeInfo.color}>
          {score <= 20 ? "Highly Efficient" : score <= 40 ? "Eco-Mindful" : score <= 60 ? "Balanced Impact" : "Carbon Heavy"}
        </Badge>
      </div>
    </div>
  );
}
