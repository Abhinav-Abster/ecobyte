"use client";

import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface SimulationChartProps {
  data: { month: string; current: number; improved: number }[];
}

export function SimulationChart({ data }: SimulationChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground text-sm">
        No simulation data available.
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
          <XAxis
            dataKey="month"
            stroke="#888888"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}kg`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const currentVal = payload[0].value as number;
                const improvedVal = payload[1].value as number;
                const savings = Math.max(0, currentVal - improvedVal).toFixed(1);

                return (
                  <div className="rounded-xl border border-border bg-popover/90 p-3 shadow-md backdrop-blur-sm text-xs space-y-1">
                    <p className="font-bold text-foreground">{payload[0].payload.month}</p>
                    <p className="text-muted-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-orange-500" />
                      Current: <span className="font-semibold text-foreground">{currentVal.toFixed(2)} kg</span>
                    </p>
                    <p className="text-muted-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Improved: <span className="font-semibold text-foreground">{improvedVal.toFixed(2)} kg</span>
                    </p>
                    <div className="border-t border-border pt-1 mt-1 text-emerald-400 font-semibold">
                      Savings: {savings} kg CO₂
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="plainline"
            iconSize={16}
            wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
          />
          <Line
            type="monotone"
            dataKey="current"
            name="Current Trajectory"
            stroke="#f97316"
            strokeWidth={2.5}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="improved"
            name="Improved Trajectory"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
