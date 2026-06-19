"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, FileText, Settings2, ShieldCheck, Activity } from "lucide-react";
import { toast } from "sonner";
import { LoadingSkeletonDashboard } from "@/components/shared/loading-skeleton";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [usersData, setUsersData] = useState<any>(null);
  const [factors, setFactors] = useState<any>(null);
  const [page, setPage] = useState(1);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, factorsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch(`/api/admin/users?page=${page}&limit=10`),
        fetch("/api/admin/emission-factors"),
      ]);

      const statsJson = await statsRes.json();
      const usersJson = await usersRes.json();
      const factorsJson = await factorsRes.json();

      if (statsJson.success && usersJson.success && factorsJson.success) {
        setStats(statsJson.data);
        setUsersData(usersJson.data);
        setFactors(factorsJson.data);
      } else {
        toast.error("Failed to load admin data");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching admin statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [page]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Admin Panel" description="Platform statistics, user records, and emission factors configuration." gradient={false} />
        <LoadingSkeletonDashboard />
      </div>
    );
  }

  const factorRows: any[] = [];
  if (factors) {
    Object.entries(factors).forEach(([category, value]: [string, any]) => {
      if (typeof value === "object") {
        Object.entries(value).forEach(([subKey, subVal]) => {
          factorRows.push({
            category,
            detail: subKey,
            factor: `${subVal} g CO₂/hr`,
          });
        });
      } else {
        let unit = "g CO₂";
        if (category === "cloudStorage") unit = "g CO₂/GB/month";
        if (category === "emails") unit = "g CO₂/email";
        if (category === "videoMeetings") unit = "g CO₂/hr";
        factorRows.push({
          category,
          detail: "standard",
          factor: `${value} ${unit}`,
        });
      }
    });
  }

  return (
    <div className="space-y-6 text-foreground">
      <PageHeader
        title="Admin Panel"
        description="Platform statistics, user records, and emission factors configuration."
        gradient={false}
        className="border-b-0 pb-0"
      />

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border bg-card shadow-sm hover:border-violet-500/30 transition-colors">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Users</span>
                <h3 className="text-2xl font-black mt-2 text-violet-500">{stats.totalUsers}</h3>
              </div>
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Users className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-sm hover:border-violet-500/30 transition-colors">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avg Monthly Footprint</span>
                <h3 className="text-2xl font-black mt-2 text-violet-500">{stats.averageFootprint.toFixed(1)} kg</h3>
              </div>
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Activity className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-sm hover:border-violet-500/30 transition-colors">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Reports Logged</span>
                <h3 className="text-2xl font-black mt-2 text-violet-500">{stats.totalReports}</h3>
              </div>
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <FileText className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-sm hover:border-violet-500/30 transition-colors">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Weekly Active</span>
                <h3 className="text-2xl font-black mt-2 text-violet-500">{stats.activeUsersThisWeek}</h3>
              </div>
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border bg-card/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Registered Users</CardTitle>
            <CardDescription>Managed list of digital citizens on the platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow className="border-border">
                    <TableHead className="font-bold text-xs uppercase">User</TableHead>
                    <TableHead className="font-bold text-xs uppercase">Latest Score</TableHead>
                    <TableHead className="font-bold text-xs uppercase text-right">XP</TableHead>
                    <TableHead className="font-bold text-xs uppercase text-right">Streak</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersData?.users.map((u: any) => (
                    <TableRow key={u.id} className="border-border hover:bg-muted/10">
                      <TableCell>
                        <div>
                          <p className="font-semibold text-sm">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {u.carbonScore !== null ? (
                          <Badge variant="outline" className="bg-violet-500/10 text-violet-400 border-violet-500/20">
                            {u.carbonScore} - {u.scoreCategory}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">No reports</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold font-mono text-sm">{u.xp}</TableCell>
                      <TableCell className="text-right font-semibold font-mono text-sm">{u.streak}d</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {usersData && usersData.pagination.totalPages > 1 && (
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="cursor-pointer"
                >
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground px-2">
                  Page {page} of {usersData.pagination.totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(usersData.pagination.totalPages, p + 1))}
                  disabled={page === usersData.pagination.totalPages}
                  className="cursor-pointer"
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card/60 backdrop-blur-md">
          <CardHeader>
            <div className="flex items-center gap-2 text-violet-400">
              <Settings2 className="h-5 w-5" />
              <CardTitle className="text-lg font-bold">Carbon Factors</CardTitle>
            </div>
            <CardDescription>Read-only configurations from database seeds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-border overflow-hidden h-[360px] overflow-y-auto">
              <Table>
                <TableHeader className="bg-muted/40 sticky top-0">
                  <TableRow className="border-border">
                    <TableHead className="font-bold text-xs uppercase">Category</TableHead>
                    <TableHead className="font-bold text-xs uppercase">Factor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {factorRows.map((row, idx) => (
                    <TableRow key={idx} className="border-border hover:bg-muted/10">
                      <TableCell>
                        <p className="font-semibold text-xs md:text-sm capitalize">{row.category}</p>
                        <p className="text-[10px] text-muted-foreground capitalize">{row.detail}</p>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-violet-400 font-semibold">{row.factor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
