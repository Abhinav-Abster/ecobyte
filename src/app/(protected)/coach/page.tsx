"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { RecommendationCards } from "@/components/coach/recommendation-cards";
import { LoadingSkeletonGrid } from "@/components/shared/loading-skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { AICoachResponse } from "@/types";

export default function CoachPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AICoachResponse | null>(null);

  const fetchRecommendations = async (showToast = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setData(json.data);
        if (showToast) toast.success("Coach tips updated!");
      } else {
        setError(json.error || "Failed to load recommendations");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <PageHeader title="AI Sustainability Coach" description="Personalized recommendations to reduce your digital carbon footprint." />
        <LoadingSkeletonGrid count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="AI Sustainability Coach" description="Personalized recommendations to reduce your digital carbon footprint." />
        <Card className="glass border-dashed border-border/60 p-12 text-center flex flex-col items-center justify-center space-y-6">
          <div className="h-16 w-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-amber-500" />
          </div>
          <div className="space-y-2 max-w-md">
            <CardTitle className="text-2xl font-bold">No Data Found</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {error.includes("reports")
                ? "You need to log your habits before the AI Coach can generate recommendations."
                : error}
            </CardDescription>
          </div>
          {error.includes("reports") && (
            <Link href="/track">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer">
                Track Habits First
              </Button>
            </Link>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/30 pb-4 mb-6">
        <PageHeader
          title="AI Sustainability Coach"
          description="Personalized recommendations to reduce your digital carbon footprint."
          className="border-b-0 pb-0 mb-0"
        />
        <Button
          onClick={() => fetchRecommendations(true)}
          disabled={loading}
          variant="outline"
          className="border-border/60 bg-background/50 text-sm font-semibold cursor-pointer"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Tips
        </Button>
      </div>

      {data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 glass border-border/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="h-24 w-24 text-emerald-500" />
              </div>
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-emerald-500">
                  <Sparkles className="h-5 w-5 animate-pulse" /> Coach Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-foreground leading-relaxed font-semibold">
                  {data.summary}
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-border/40 flex flex-col justify-between">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Biggest Carbon Source
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-black text-rose-500 capitalize">
                  {data.biggestSource}
                </div>
                <p className="text-xs text-muted-foreground">
                  Focusing on this category will yield the largest potential carbon reductions.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Actionable Tips</h3>
            <RecommendationCards recommendations={data.recommendations} />
          </div>

          <Card className="border border-emerald-500/20 bg-emerald-500/5">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-bold text-emerald-500 flex items-center gap-2">
                  🌿 Potential Monthly Savings
                </h4>
                <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                  By implementing all the recommended actions above, you can reduce your digital footprint significantly this month.
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-emerald-500 block sm:inline">
                  {data.estimatedTotalReduction}
                </span>
                <span className="text-xs text-muted-foreground block mt-1">CO₂ reduced per month</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
