"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface FootprintPieChartProps {
  data: { name: string; value: number; color: string }[];
}

export function FootprintPieChart({ data }: FootprintPieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground text-sm">
        No data available
      </div>
    );
  }

  const filteredData = data.filter((item) => item.value > 0);

  if (filteredData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground text-sm">
        No emissions logged yet. Try tracking some habits!
      </div>
    );
  }

  const total = filteredData.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
          >
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const dataItem = payload[0].payload;
                const percentage = ((dataItem.value / total) * 100).toFixed(1);
                return (
                  <div className="rounded-xl border border-border bg-popover/90 p-3 shadow-md backdrop-blur-sm text-xs space-y-1">
                    <p className="font-bold text-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: dataItem.color }} />
                      {dataItem.name}
                    </p>
                    <p className="text-muted-foreground">
                      Emissions: <span className="font-semibold text-foreground">{dataItem.value.toFixed(2)} kg CO₂</span>
                    </p>
                    <p className="text-muted-foreground">
                      Share: <span className="font-semibold text-emerald-500">{percentage}%</span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
