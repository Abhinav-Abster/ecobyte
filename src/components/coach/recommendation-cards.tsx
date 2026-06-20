"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AIRecommendation } from "@/types";
import { Bot, Cloud, Gamepad2, Laptop, Leaf, LucideIcon, Mail, Monitor, Video } from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import React from "react";

interface RecommendationCardProps {
  rec: AIRecommendation;
  item: Variants;
}

const iconMap: Record<string, LucideIcon> = {
  streaming: Monitor,
  gaming: Gamepad2,
  ai: Bot,
  cloud: Cloud,
  video: Video,
  email: Mail,
  device: Laptop,
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-green-500/10 text-green-400 border-green-500/20";
    case "medium":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "hard":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  }
};

const RecommendationCard = React.memo(function RecommendationCard({
  rec,
  item,
}: RecommendationCardProps) {
  const Icon = iconMap[rec.category] || Leaf;
  return (
    <motion.div variants={item}>
      <Card className="glass h-full border-border/40 hover:border-emerald-500/40 transition-colors duration-300 flex flex-col justify-between">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold text-foreground leading-snug">
                {rec.title}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {rec.description}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs font-semibold">
              🌿 {rec.estimatedReduction}
            </Badge>
            <Badge variant="outline" className={cn(getDifficultyColor(rec.difficulty), "text-xs font-semibold")}>
              {rec.difficulty}
            </Badge>
            <Badge variant="outline" className="bg-zinc-800/10 text-zinc-400 border-zinc-700/20 text-xs font-semibold uppercase tracking-wide">
              {rec.category}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

interface RecommendationCardsProps {
  recommendations: AIRecommendation[];
}

export function RecommendationCards({ recommendations }: RecommendationCardsProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {recommendations.map((rec, index) => (
        <RecommendationCard key={index} rec={rec} item={item} />
      ))}
    </motion.div>
  );
}
