"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, LayoutDashboard, ClipboardList, Bot, TrendingDown, Target, Trophy, FileBarChart, Shield } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS, ADMIN_NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<any>> = {
  LayoutDashboard,
  ClipboardList,
  Bot,
  TrendingDown,
  Target,
  Trophy,
  FileBarChart,
  Shield,
};

export function MobileNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  // Close sheet when user navigates
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const user = session?.user;
  const isAdmin = (user as any)?.role === "admin";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg lg:hidden cursor-pointer">
            <Menu className="h-5 w-5 text-foreground" />
            <span className="sr-only">Open Menu</span>
          </Button>
        }
      />
      <SheetContent side="left" className="w-72 bg-card border-r border-border p-0 flex flex-col justify-between">
        <div>
          <SheetHeader className="p-6 border-b border-border">
            <SheetTitle className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <span className="text-xl">🌿</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                EcoByte
              </span>
            </SheetTitle>
          </SheetHeader>
          <nav className="p-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = iconMap[item.icon] || LayoutDashboard;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {isAdmin && ADMIN_NAV_ITEMS.map((item) => {
              const Icon = iconMap[item.icon] || Shield;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer border border-dashed border-border mt-4",
                    isActive
                      ? "bg-violet-500/10 text-violet-400 border-violet-500/30"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-border">
          <p className="text-xs text-center text-muted-foreground">EcoByte v1.0.0</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
