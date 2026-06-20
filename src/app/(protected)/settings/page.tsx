"use client";

import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Mail, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { AnimatedCard } from "@/components/shared/animated-card";

export default function SettingsPage() {
  const { data: session } = useSession();

  const user = session?.user;

  const getInitials = (name?: string | null) => {
    if (!name) return "EB";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleDeleteAccount = () => {
    toast.info("Account deletion is simulated. In a production app, this would delete your data.", {
      duration: 5000,
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader title="Settings" description="Manage your EcoByte profile and application preferences." />

      <AnimatedCard delay={0.05}>
        <Card className="glass border-border/40">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Profile Info</CardTitle>
            <CardDescription>Your personal account details</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-20 w-20">
              {user?.image ? (
                <AvatarImage src={user.image} alt={user.name || "User"} />
              ) : (
                <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
                  {getInitials(user?.name)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="space-y-3 flex-1 w-full text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-xl font-bold text-foreground">{user?.name || "Eco Citizen"}</span>
                <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 self-center sm:self-auto">
                  {user?.role || "User"}
                </span>
              </div>
              <div className="space-y-1.5 text-sm text-muted-foreground">
                <p className="flex items-center gap-2 justify-center sm:justify-start">
                  <Mail className="h-4 w-4 shrink-0 text-emerald-500" />
                  {user?.email || ""}
                </p>
                <p className="flex items-center gap-2 justify-center sm:justify-start">
                  <Calendar className="h-4 w-4 shrink-0 text-emerald-500" />
                  Account Active since 2026
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>

      <AnimatedCard delay={0.1}>
        <Card className="glass border-border/40">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Preferences</CardTitle>
            <CardDescription>Customize your application look and feel</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-foreground">Theme Mode</span>
              <p className="text-xs text-muted-foreground">Switch between light mode and dark mode preferences</p>
            </div>
            <div className="border border-border/60 p-1.5 rounded-xl bg-background/50">
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>

      <AnimatedCard delay={0.15}>
        <Card className="border border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-destructive flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" /> Danger Zone
            </CardTitle>
            <CardDescription>Irreversible account actions</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-foreground">Delete Account</span>
              <p className="text-xs text-muted-foreground">Permanently delete your profile and all carbon footprint logs.</p>
            </div>
            <Button
              onClick={handleDeleteAccount}
              variant="destructive"
              className="bg-destructive hover:bg-destructive/90 text-white font-bold cursor-pointer shrink-0 rounded-xl"
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </AnimatedCard>
    </div>
  );
}
