"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StreakDisplay } from "@/components/challenges/streak-display";
import { ChallengeCard } from "@/components/challenges/challenge-card";
import { LoadingSkeletonGrid } from "@/components/shared/loading-skeleton";
import { toast } from "sonner";
import { AnimatedCard } from "@/components/shared/animated-card";
import type { ChallengeData } from "@/types";

export default function ChallengesPage() {
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);

  const fetchChallenges = async () => {
    try {
      const res = await fetch("/api/challenges");
      const json = await res.json();

      if (res.ok && json.success) {
        setChallenges(json.data);
        setStreak(json.streak);
        setXp(json.xp);
      } else {
        toast.error("Failed to load challenges");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading challenges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleCompleteChallenge = async (id: string) => {
    try {
      const res = await fetch(`/api/challenges/${id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const json = await res.json();

      if (res.ok && json.success) {
        toast.success(`Challenge completed! +${json.data.challenge.xpReward} XP`);

        setChallenges((prev) =>
          prev.map((c) => (c._id === id ? { ...c, isCompleted: true, completedAt: new Date() } : c))
        );
        setXp(json.data.user.xp);
        setStreak(json.data.user.streak);
      } else {
        toast.error(json.error || "Failed to complete challenge");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error completing challenge");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Daily Green Challenges" description="Complete digital actions to build healthy habits and earn points." />
        <LoadingSkeletonGrid count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Green Challenges"
        description="Complete digital actions to build healthy habits and earn points."
      />

      <AnimatedCard delay={0.05}>
        <StreakDisplay streak={streak} xp={xp} />
      </AnimatedCard>

      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-foreground">Today's Missions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {challenges.map((challenge, index) => (
            <AnimatedCard key={challenge._id} delay={0.1 + index * 0.08}>
              <ChallengeCard challenge={challenge} onComplete={handleCompleteChallenge} />
            </AnimatedCard>
          ))}
        </div>
      </div>
    </div>
  );
}
