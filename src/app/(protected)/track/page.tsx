"use client";

import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { HabitForm } from "@/components/forms/habit-form";
import { AnimatedCard } from "@/components/shared/animated-card";

export default function TrackPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Track Your Digital Habits"
        description="Input your daily digital activities to calculate your estimated digital carbon footprint."
      />

      <AnimatedCard>
        <div className="max-w-3xl mx-auto pb-12">
          <HabitForm />
        </div>
      </AnimatedCard>
    </div>
  );
}
