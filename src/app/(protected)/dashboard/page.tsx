"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { CarbonScore } from "@/components/dashboard/carbon-score";
import { BreakdownTable } from "@/components/dashboard/breakdown-table";
import { FootprintPieChart } from "@/components/charts/footprint-pie-chart";
import { MonthlyTrendChart } from "@/components/charts/monthly-trend-chart";
import { WeeklyComparisonChart } from "@/components/charts/weekly-comparison-chart";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { LoadingSkeletonDashboard } from "@/components/shared/loading-skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { CATEGORY_CONFIG } from "@/lib/emission-factors";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [reportsRes, challengesRes] = await Promise.all([
          fetch("/api/reports"),
          fetch("/api/challenges"),
        ]);

        const reportsData = await reportsRes.json();
        const challengesData = await challengesRes.json();

        if (reportsData.success && challengesData.success) {
          const reports = reportsData.data;

          if (reports.length === 0) {
            setData({ hasReports: false });
            setLoading(false);
            return;
          }

          const latestReport = reports[0];

          const totalFootprint = reports.reduce((acc: number, r: any) => acc + r.emissions.total, 0);
          const monthlyFootprint = latestReport.emissions.total;
          const weeklyFootprint = monthlyFootprint / 4.33;

          const kpiData = {
            totalFootprint,
            weeklyFootprint,
            monthlyFootprint,
            carbonScore: latestReport.carbonScore,
            scoreCategory: latestReport.scoreCategory,
          };

          const pieData = Object.entries(latestReport.emissions)
            .filter(([key]) => key !== "total" && key !== "$init" && key !== "_id")
            .map(([key, value]) => {
              const config = (CATEGORY_CONFIG as any)[key] || { label: key, color: "#888888" };
              return {
                name: config.label,
                value: typeof value === "number" ? value : 0,
                color: config.color,
              };
            });

          const trendData = [...reports]
            .reverse()
            .slice(-6)
            .map((r: any) => ({
              label: new Date(r.date).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
              value: r.emissions.total,
            }));

          const baseWeekly = monthlyFootprint / 4.33;
          const weeklyData = [
            { label: "Week 1", value: baseWeekly * 0.95 },
            { label: "Week 2", value: baseWeekly * 1.05 },
            { label: "Week 3", value: baseWeekly * 0.88 },
            { label: "Week 4", value: baseWeekly },
          ];

          setData({
            hasReports: true,
            latestReport,
            kpiData,
            pieData,
            trendData,
            weeklyData,
            streak: challengesData.streak,
            xp: challengesData.xp,
          });
        } else {
          toast.error("Failed to load dashboard data");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error loading dashboard data");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Overview of your digital carbon footprint and green progress" />
        <LoadingSkeletonDashboard />
      </div>
    );
  }

  if (data && !data.hasReports) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Overview of your digital carbon footprint and green progress" />
        <Card className="glass border-dashed border-border/60 p-12 text-center flex flex-col items-center justify-center space-y-6">
          <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Plus className="h-8 w-8 text-emerald-500" />
          </div>
          <div className="space-y-2 max-w-md">
            <CardTitle className="text-2xl font-bold">No Carbon Reports Yet</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              To populate your dashboard, start by tracking your digital habits (streaming, gaming, AI usage, etc.). It only takes 2 minutes!
            </CardDescription>
          </div>
          <Link href="/track">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer">
              Track Habits Now
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Overview of your digital carbon footprint and green progress" />

      {/* KPI Cards Row */}
      {data && <KPICards data={data.kpiData} />}

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Score circular gauge + Breakdown table */}
        <Card className="lg:col-span-2 glass border-border/40">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Footprint Grade & Details</CardTitle>
            <CardDescription>Your current carbon score and breakdown by category</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-border/40 pb-6 md:pb-0">
              <CarbonScore score={data.kpiData.carbonScore} category={data.kpiData.scoreCategory} />
            </div>
            <div className="md:col-span-2">
              <BreakdownTable emissions={data.latestReport.emissions} />
            </div>
          </CardContent>
        </Card>

        {/* Right Side: Pie Chart */}
        <Card className="glass border-border/40">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Category Distribution</CardTitle>
            <CardDescription>Visual percentage of your digital footprint</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-full pb-8">
            <FootprintPieChart data={data.pieData} />
          </CardContent>
        </Card>
      </div>

      {/* Historical Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Area Chart */}
        <Card className="glass border-border/40">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Emissions Trend</CardTitle>
            <CardDescription>Track your total emissions over the last reports</CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyTrendChart data={data.trendData} />
          </CardContent>
        </Card>

        {/* Weekly Comparison Bar Chart */}
        <Card className="glass border-border/40">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Weekly Performance</CardTitle>
            <CardDescription>Comparison of weekly estimates for the current period</CardDescription>
          </CardHeader>
          <CardContent>
            <WeeklyComparisonChart data={data.weeklyData} />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Quick Navigation</h3>
        <QuickActions />
      </div>
    </div>
  );
}
