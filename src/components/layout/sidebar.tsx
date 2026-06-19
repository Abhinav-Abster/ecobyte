"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, ADMIN_NAV_ITEMS } from "@/lib/constants";
import {
  LayoutDashboard,
  ClipboardList,
  Bot,
  TrendingDown,
  Target,
  Trophy,
  FileBarChart,
  Shield,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const user = session?.user;
  const isAdmin = (user as any)?.role === "admin";

  const getInitials = (name?: string | null) => {
    if (!name) return "EB";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const navLinks = [...NAV_ITEMS];
  const adminLinks = isAdmin ? [...ADMIN_NAV_ITEMS] : [];

  return (
    <aside
      className={cn(
        "h-screen border-r border-border bg-card text-card-foreground flex flex-col justify-between relative transition-all duration-300 z-20 shadow-lg",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Toggle button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-4 -right-3 h-6 w-6 rounded-full bg-primary text-primary-foreground border border-border flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <div>
        {/* Logo Section */}
        <div className={cn("p-6 flex items-center gap-3", isCollapsed ? "justify-center px-2" : "")}>
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-xl">🌿</span>
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg font-bold bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text text-transparent"
            >
              EcoByte
            </motion.span>
          )}
        </div>

        {/* Navigation links */}
        <nav className="px-3 space-y-1.5 mt-2">
          {navLinks.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative cursor-pointer",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary animate-pulse" : "text-muted-foreground group-hover:text-foreground")} />
                {!isCollapsed && <span>{item.label}</span>}
                {isCollapsed && (
                  <div className="absolute left-16 bg-popover text-popover-foreground text-xs rounded-md px-2 py-1 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity border border-border whitespace-nowrap shadow-md z-30">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}

          {/* Admin Panel Link */}
          {isAdmin && adminLinks.map((item) => {
            const Icon = iconMap[item.icon] || Shield;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative cursor-pointer mt-4 border border-dashed",
                  isActive
                    ? "bg-violet-500/10 text-violet-400 border-violet-500/30"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground border-border"
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-violet-400" : "text-muted-foreground group-hover:text-foreground")} />
                {!isCollapsed && <span>{item.label}</span>}
                {isCollapsed && (
                  <div className="absolute left-16 bg-popover text-popover-foreground text-xs rounded-md px-2 py-1 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity border border-border whitespace-nowrap shadow-md z-30">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile & Settings/Logout */}
      <div className="p-3 border-t border-border space-y-2">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative cursor-pointer",
            pathname === "/settings"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Settings</span>}
          {isCollapsed && (
            <div className="absolute left-16 bg-popover text-popover-foreground text-xs rounded-md px-2 py-1 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity border border-border whitespace-nowrap shadow-md z-30">
              Settings
            </div>
          )}
        </Link>

        {/* User Card */}
        <div className={cn("flex items-center gap-3 p-2 rounded-xl bg-accent/40 border border-border/50", isCollapsed ? "justify-center px-1" : "")}>
          <Avatar className="h-9 w-9 shrink-0">
            {user?.image ? (
              <AvatarImage src={user.image} alt={user.name || "User"} />
            ) : (
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                {getInitials(user?.name)}
              </AvatarFallback>
            )}
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-semibold truncate leading-tight text-foreground">{user?.name || "Eco Citizen"}</span>
              <span className="text-xs text-muted-foreground truncate leading-none mt-0.5">{user?.email || ""}</span>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={cn(
            "w-full flex items-center justify-start gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors",
            isCollapsed ? "justify-center" : ""
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
}
