"use client";

import React from "react";
import Link from "next/link";
import { ClipboardList, Bot, Target, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function QuickActions() {
  const actions = [
    {
      title: "Track Digital Habits",
      description: "Log your streaming, gaming, AI prompts, and devices for today.",
      href: "/track",
      icon: ClipboardList,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/25",
    },
    {
      title: "Consult AI Coach",
      description: "Get personalized, dynamic suggestions to lower your emissions.",
      href: "/coach",
      icon: Bot,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/25",
    },
    {
      title: "Daily Challenges",
      description: "Complete daily carbon-saving missions to level up your streak.",
      href: "/challenges",
      icon: Target,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/25",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <Link key={act.title} href={act.href} className="group block cursor-pointer">
            <Card className="glass h-full border-border/40 hover:border-emerald-500/40 transition-all duration-300">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="space-y-2">
                  <div className={`h-10 w-10 rounded-xl border flex items-center justify-center mb-4 ${act.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-bold text-foreground group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                    {act.title}
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{act.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
