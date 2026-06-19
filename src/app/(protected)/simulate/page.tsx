"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { SimulationChart } from "@/components/charts/simulation-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { AlertCircle, Calendar, LineChart, Leaf, TrendingDown, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function SimulatePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [simulation, setSimulation] = useState<any>(null);
  const [selectedMonths, setSelectedMonths] = useState<number | null>(null);

  const runSimulation = async (months: number) => {
    setLoading(true);
    setError(null);
    setSelectedMonths(months);
    try {
      const res = await fetch("/api/ai/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ months }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setSimulation(json.data);
        toast.success(`Simulation for ${months} months completed!`);
      } else {
        setError(json.error || "Failed to run simulation");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Future Impact Simulation"
        description="Visualize the long-term environmental difference you can make by adopting digital green habits."
      />

      {!simulation && !loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto pt-8 text-center space-y-6"
        >
          <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
            <LineChart className="h-8 w-8 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Predict Your Digital Savings</h2>
            <p className="text-sm text-muted-foreground">
              Compare your current trajectory against an improved, eco-friendly digital lifestyle. Choose a projection timeline below.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Button
              size="lg"
              onClick={() => runSimulation(6)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer rounded-2xl p-6 h-auto flex flex-col items-center gap-1 w-full sm:w-44"
            >
              <Calendar className="h-5 w-5" />
              <span>6 Months</span>
            </Button>
            <Button
              size="lg"
              onClick={() => runSimulation(12)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer rounded-2xl p-6 h-auto flex flex-col items-center gap-1 w-full sm:w-44"
            >
              <Calendar className="h-5 w-5" />
              <span>1 Year</span>
            </Button>
          </div>
        </motion.div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
          <p className="text-sm text-muted-foreground">Running AI projection model...</p>
        </div>
      )}

      {error && (
        <Card className="glass border-dashed border-border/60 p-12 text-center flex flex-col items-center justify-center space-y-6 max-w-xl mx-auto">
          <div className="h-16 w-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-amber-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Simulation Error</h3>
            <p className="text-sm text-muted-foreground">
              {error.includes("reports")
                ? "You need to log your habits before starting a projection simulation."
                : error}
            </p>
          </div>
          {error.includes("reports") ? (
            <Link href="/track">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer">
                Track Habits First
              </Button>
            </Link>
          ) : (
            <Button onClick={() => setError(null)} variant="outline" className="cursor-pointer">
              Try Again
            </Button>
          )}
        </Card>
      )}

      {simulation && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <Card className="glass border-border/40">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-bold">Emissions Trajectory Comparison</CardTitle>
                <CardDescription>
                  Cumulative monthly output over {selectedMonths} months (Current vs. Green habits)
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={selectedMonths === 6 ? "default" : "outline"}
                  onClick={() => runSimulation(6)}
                  className="cursor-pointer text-xs"
                >
                  6 Months
                </Button>
                <Button
                  size="sm"
                  variant={selectedMonths === 12 ? "default" : "outline"}
                  onClick={() => runSimulation(12)}
                  className="cursor-pointer text-xs"
                >
                  1 Year
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <SimulationChart data={simulation.timeline} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="glass border-border/40 p-6 flex flex-col justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current Projected
              </span>
              <div className="mt-4">
                <span className="text-2xl font-black text-orange-500">
                  {simulation.totalCurrentEmissions.toFixed(1)} kg
                </span>
                <span className="text-xs text-muted-foreground block mt-1">Total cumulative emissions</span>
              </div>
            </Card>

            <Card className="glass border-border/40 p-6 flex flex-col justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Improved Projected
              </span>
              <div className="mt-4">
                <span className="text-2xl font-black text-emerald-500">
                  {simulation.totalImprovedEmissions.toFixed(1)} kg
                </span>
                <span className="text-xs text-muted-foreground block mt-1">With recommended adjustments</span>
              </div>
            </Card>

            <Card className="glass border-border/40 p-6 flex flex-col justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-bold text-emerald-500">
                Projected Savings
              </span>
              <div className="mt-4">
                <span className="text-2xl font-black text-emerald-500 flex items-center gap-1.5">
                  <Leaf className="h-5 w-5 shrink-0" />
                  {simulation.totalSavings.toFixed(1)} kg
                </span>
                <span className="text-xs text-muted-foreground block mt-1">CO₂ prevented from entering grid</span>
              </div>
            </Card>

            <Card className="glass border-border/40 p-6 flex flex-col justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Reduction Percentage
              </span>
              <div className="mt-4">
                <span className="text-2xl font-black text-emerald-500 flex items-center gap-1.5">
                  <TrendingDown className="h-5 w-5 shrink-0" />
                  {simulation.percentageReduction.toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground block mt-1">Overall carbon efficiency gain</span>
              </div>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
}
