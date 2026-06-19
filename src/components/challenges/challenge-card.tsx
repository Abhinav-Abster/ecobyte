"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { ChallengeData } from "@/types";

interface ChallengeCardProps {
  challenge: ChallengeData;
  onComplete: (id: string) => void;
}

export function ChallengeCard({ challenge, onComplete }: ChallengeCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCompleteClick = () => {
    setIsAnimating(true);
    onComplete(challenge._id);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "streaming":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "gaming":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "ai":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "cloud":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "video":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "email":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "device":
        return "bg-pink-500/10 text-pink-400 border-pink-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  return (
    <motion.div
      whileHover={{ y: challenge.isCompleted ? 0 : -3 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`glass border-border/40 flex flex-col justify-between h-full transition-all duration-300 ${challenge.isCompleted ? "opacity-60 border-emerald-500/25 bg-emerald-500/5" : "hover:border-emerald-500/30"}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-4">
            <Badge variant="outline" className={`${getCategoryColor(challenge.category)} text-xs font-semibold uppercase tracking-wide`}>
              {challenge.category}
            </Badge>
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold">
              +{challenge.xpReward} XP
            </Badge>
          </div>
          <CardTitle className={`text-base font-bold mt-3 leading-snug ${challenge.isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
            {challenge.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {challenge.description}
          </p>
        </CardContent>
        <CardFooter className="pt-0 pb-6">
          <Button
            onClick={handleCompleteClick}
            disabled={challenge.isCompleted || isAnimating}
            className={`w-full font-bold cursor-pointer transition-all ${
              challenge.isCompleted
                ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/25 hover:bg-emerald-500/15"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
            }`}
          >
            {challenge.isCompleted ? (
              <span className="flex items-center gap-1 justify-center w-full">
                <Check className="h-4 w-4 stroke-[3px]" /> Completed
              </span>
            ) : isAnimating ? (
              "Completing..."
            ) : (
              "Mark Complete"
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
