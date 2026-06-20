"use client";

import React from "react";
import { Leaf, Calendar, Gauge, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import { KPIData } from "@/types";
import { getScoreColor } from "@/lib/carbon-calculator";

interface KPICardsProps {
  data: KPIData;
}

export function KPICards({ data }: KPICardsProps) {
  const scoreColor = getScoreColor(data.carbonScore);

  const kpis = [
    {
      title: "Monthly Total",
      value: `${data.monthlyFootprint.toFixed(1)} kg`,
      description: "Estimated monthly digital footprint",
      icon: Activity,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/25",
    },
    {
      title: "Weekly Footprint",
      value: `${data.weeklyFootprint.toFixed(1)} kg`,
      description: "Based on active hours",
      icon: Calendar,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/25",
    },
    {
      title: "Cumulative Footprint",
      value: `${data.totalFootprint.toFixed(1)} kg`,
      description: "Total emissions logged",
      icon: Leaf,
      color: "text-teal-500 bg-teal-500/10 border-teal-500/25",
    },
    {
      title: "Carbon Score",
      value: `${data.carbonScore}`,
      description: data.scoreCategory,
      icon: Gauge,
      color: `border-border`,
      valueColor: scoreColor,
    },
  ];

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
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <motion.div key={kpi.title} variants={item}>
            <Card className="glass overflow-hidden border-border/40 relative group hover:border-emerald-500/40 transition-colors duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {kpi.title}
                  </span>
                  <div className={`h-8 w-8 rounded-lg border flex items-center justify-center ${kpi.color}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                </div>
                <div className="mt-2">
                  <h3
                    className="text-2xl font-black tracking-tight"
                    style={kpi.valueColor ? { color: kpi.valueColor } : undefined}
                  >
                    {kpi.value}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{kpi.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
