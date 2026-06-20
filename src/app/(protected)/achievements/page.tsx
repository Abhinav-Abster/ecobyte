"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { BadgeGrid } from "@/components/achievements/badge-grid";
import { LoadingSkeletonGrid } from "@/components/shared/loading-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { toast } from "sonner";
import { AnimatedCard } from "@/components/shared/animated-card";

interface Achievement {
  achievementId: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  progress: number;
  unlockedAt?: string | Date | null;
  isUnlocked: boolean;
}

export default function AchievementsPage() {
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    async function fetchAchievements() {
      try {
        const res = await fetch("/api/achievements");
        const json = await res.json();

        if (res.ok && json.success) {
          setAchievements(json.data);
        } else {
          toast.error("Failed to load achievements");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error loading achievements");
      } finally {
        setLoading(false);
      }
    }

    fetchAchievements();
  }, []);

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const totalCount = achievements.length;

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Achievements & Badges" description="Unlock green achievements by completing challenges and tracking habits." />
        <LoadingSkeletonGrid count={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Achievements & Badges"
        description="Unlock green achievements by completing challenges and tracking habits."
      />

      <AnimatedCard delay={0.05}>
        <Card className="glass border-border/40 overflow-hidden relative">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
              <Trophy className="h-6 w-6 fill-amber-500/25" />
            </div>
            <div>
              <span className="text-2xl font-black text-foreground">
                {unlockedCount} of {totalCount} Unlocked
              </span>
              <span className="text-xs text-muted-foreground block">
                Keep completing daily green challenges to unlock more badges!
              </span>
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>

      <div className="pt-4">
        <BadgeGrid achievements={achievements} />
      </div>
    </div>
  );
}
