"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { BreakdownTable } from "@/components/dashboard/breakdown-table";
import { LoadingSkeletonGrid } from "@/components/shared/loading-skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SCORE_BADGES } from "@/lib/constants";
import { AnimatedCard } from "@/components/shared/animated-card";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<any[]>([]);
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/reports");
      const json = await res.json();

      if (res.ok && json.success) {
        setReports(json.data);
        if (json.data.length > 0) {
          setExpandedReportId(json.data[0]._id); // Expand the latest report by default
        }
      } else {
        toast.error("Failed to load reports history");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedReportId((prev) => (prev === id ? null : id));
  };

  // PDF Export
  const handleExportPDF = () => {
    if (reports.length === 0) return;

    try {
      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.setTextColor(16, 185, 129);
      doc.text("EcoByte Digital Carbon Footprint Report", 14, 20);

      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 26);

      const headers = [[
        "Date",
        "Streaming (kg)",
        "Gaming (kg)",
        "AI (kg)",
        "Cloud (kg)",
        "Meetings (kg)",
        "Emails (kg)",
        "Devices (kg)",
        "Total (kg)",
        "Score",
        "Category",
      ]];

      const body = reports.map((r) => [
        new Date(r.date).toLocaleDateString(),
        r.emissions.streaming.toFixed(2),
        r.emissions.gaming.toFixed(2),
        r.emissions.aiUsage.toFixed(2),
        r.emissions.cloudStorage.toFixed(2),
        r.emissions.videoCalls.toFixed(2),
        r.emissions.emails.toFixed(2),
        r.emissions.devices.toFixed(2),
        r.emissions.total.toFixed(2),
        r.carbonScore,
        r.scoreCategory,
      ]);

      autoTable(doc, {
        startY: 32,
        head: headers,
        body: body,
        theme: "striped",
        headStyles: { fillColor: [16, 185, 129] },
        styles: { fontSize: 8 },
      });

      doc.save(`ecobyte-report-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("PDF exported successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Could not export PDF");
    }
  };

  // Calculate Month-over-Month change
  const getMomChange = () => {
    if (reports.length < 2) return null;
    const current = reports[0].emissions.total;
    const previous = reports[1].emissions.total;

    if (previous === 0) return null;

    const percentage = ((current - previous) / previous) * 100;
    return {
      percentage,
      isDecrease: percentage < 0,
    };
  };

  const momChange = getMomChange();

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Report History" description="View and manage your historical digital footprint logs." />
        <LoadingSkeletonGrid count={3} />
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Report History" description="View and manage your historical digital footprint logs." />
        <Card className="glass border-dashed border-border/60 p-12 text-center flex flex-col items-center justify-center space-y-6">
          <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <FileSpreadsheet className="h-8 w-8 text-emerald-500" />
          </div>
          <div className="space-y-2 max-w-md">
            <CardTitle className="text-2xl font-bold">No Reports Found</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              You haven't logged any digital habits yet. Generate your first carbon report to start building your history.
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/30 pb-4 mb-6">
        <PageHeader
          title="Report History"
          description="View and manage your historical digital footprint logs."
          className="border-b-0 pb-0 mb-0"
        />
        <Button
          onClick={handleExportPDF}
          variant="outline"
          className="border-border/60 bg-background/50 text-sm font-semibold cursor-pointer"
        >
          <Download className="mr-2 h-4 w-4" />
          Export All PDF
        </Button>
      </div>

      {/* Month over Month Overview */}
      {momChange && (
        <AnimatedCard delay={0.05}>
          <Card className="border border-border/40 bg-card/40">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                  Month-over-Month Comparison
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Comparing your latest report to the previous logging period
                </p>
              </div>
              <div className="flex items-center gap-2">
                {momChange.isDecrease ? (
                  <div className="flex items-center gap-1 text-emerald-500 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-base">
                    <ArrowDownRight className="h-5 w-5 stroke-[2.5px]" />
                    <span>{Math.abs(momChange.percentage).toFixed(1)}% reduction</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-rose-500 font-bold bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl text-base">
                    <ArrowUpRight className="h-5 w-5 stroke-[2.5px]" />
                    <span>+{Math.abs(momChange.percentage).toFixed(1)}% increase</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>
      )}

      {/* Reports List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Past Reports</h3>
        <div className="space-y-3">
          {reports.map((report, index) => {
            const isExpanded = expandedReportId === report._id;
            const badge = SCORE_BADGES[report.scoreCategory as keyof typeof SCORE_BADGES] || {
              emoji: "🌍",
              color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
            };

            return (
              <AnimatedCard key={report._id} delay={0.1 + index * 0.05}>
                <Card className={`glass border-border/40 overflow-hidden transition-all duration-300 ${isExpanded ? "border-emerald-500/20" : ""}`}>
                  <button
                    onClick={() => toggleExpand(report._id)}
                    className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 cursor-pointer hover:bg-muted/10 transition-colors text-left gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-foreground">
                          {new Date(report.date).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </h4>
                        <span className="text-xs text-muted-foreground block mt-0.5">
                          Total Emissions: <span className="font-semibold text-foreground">{report.emissions.total.toFixed(2)} kg CO₂</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-center">
                      <Badge variant="outline" className={badge.color}>
                        <span className="mr-1">{badge.emoji}</span>
                        {report.scoreCategory} ({report.carbonScore})
                      </Badge>
                      {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-6 border-t border-border/30 bg-muted/10 space-y-4">
                      <div className="flex justify-between items-center">
                        <h5 className="text-sm font-bold text-foreground">Detailed Breakdown</h5>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const singleDoc = new jsPDF();
                            singleDoc.setFontSize(18);
                            singleDoc.setTextColor(16, 185, 129);
                            singleDoc.text(`EcoByte Carbon Report - ${new Date(report.date).toLocaleDateString()}`, 14, 20);

                            const headers = [["Category", "CO2 Emissions (kg)"]];
                            const body = Object.entries(report.emissions)
                              .filter(([key]) => key !== "total" && key !== "$init" && key !== "_id")
                              .map(([k, v]) => [k, `${Number(v).toFixed(2)} kg`]);
                            body.push(["Total", `${report.emissions.total.toFixed(2)} kg`]);

                            autoTable(singleDoc, {
                              startY: 28,
                              head: headers,
                              body: body,
                              headStyles: { fillColor: [16, 185, 129] },
                            });
                            singleDoc.save(`ecobyte-report-${report._id.slice(-6)}.pdf`);
                            toast.success("Single report PDF exported!");
                          }}
                          className="text-xs cursor-pointer text-muted-foreground hover:text-emerald-500"
                        >
                          <Download className="h-3.5 w-3.5 mr-1" /> Export Card
                        </Button>
                      </div>
                      <BreakdownTable emissions={report.emissions} />
                    </div>
                  )}
                </Card>
              </AnimatedCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
