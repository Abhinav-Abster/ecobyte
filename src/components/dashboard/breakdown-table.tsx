"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmissionsBreakdown } from "@/types";
import { CATEGORY_CONFIG } from "@/lib/emission-factors";

interface BreakdownTableProps {
  emissions: EmissionsBreakdown;
}

export function BreakdownTable({ emissions }: BreakdownTableProps) {
  const total = emissions.total || 1;

  const rows = Object.entries(emissions)
    .filter(([key]) => key !== "total" && key !== "$init")
    .map(([key, value]) => {
      const config = (CATEGORY_CONFIG as any)[key] || { label: key, color: "#888888" };
      const percentage = total > 0 ? (value / total) * 100 : 0;
      return {
        key,
        label: config.label,
        value: typeof value === "number" ? value : 0,
        percentage,
        color: config.color,
      };
    })
    .sort((a, b) => b.value - a.value);

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="border-border">
            <TableHead className="font-bold text-xs uppercase text-muted-foreground">Category</TableHead>
            <TableHead className="text-right font-bold text-xs uppercase text-muted-foreground">CO₂ (kg)</TableHead>
            <TableHead className="text-right font-bold text-xs uppercase text-muted-foreground">Share</TableHead>
            <TableHead className="w-[120px] md:w-[150px] font-bold text-xs uppercase text-muted-foreground">Visual</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.key} className="border-border hover:bg-muted/20">
              <TableCell className="font-semibold flex items-center gap-2 text-xs md:text-sm">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
                {row.label}
              </TableCell>
              <TableCell className="text-right font-mono font-medium text-xs md:text-sm">
                {row.value.toFixed(2)}
              </TableCell>
              <TableCell className="text-right font-semibold text-xs md:text-sm text-muted-foreground">
                {row.percentage.toFixed(1)}%
              </TableCell>
              <TableCell className="align-middle">
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${row.percentage}%`,
                      backgroundColor: row.color,
                    }}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
