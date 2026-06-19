"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Shield } from "lucide-react";
import Link from "next/link";

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const getPageTitle = (path: string) => {
    if (path.startsWith("/dashboard")) return "Dashboard";
    if (path.startsWith("/track")) return "Track Digital Habits";
    if (path.startsWith("/coach")) return "AI Sustainability Coach";
    if (path.startsWith("/simulate")) return "Future Impact Simulation";
    if (path.startsWith("/challenges")) return "Daily Challenges";
    if (path.startsWith("/achievements")) return "Achievements & Badges";
    if (path.startsWith("/reports")) return "Emission Reports";
    if (path.startsWith("/settings")) return "Account Settings";
    if (path.startsWith("/admin")) return "Admin Panel";
    return "EcoByte";
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "EB";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const user = session?.user;
  const isAdmin = (user as any)?.role === "admin";

  return (
    <header className="sticky top-0 z-10 w-full h-16 border-b border-border bg-card/65 backdrop-blur-md flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <div className="lg:hidden">
          <MobileNav />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          {getPageTitle(pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="relative h-9 w-9 rounded-full cursor-pointer focus-visible:ring-emerald-500">
                <Avatar className="h-9 w-9">
                  {user?.image ? (
                    <AvatarImage src={user.image} alt={user.name || "User"} />
                  ) : (
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent className="w-56 border-border bg-popover text-popover-foreground shadow-lg" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-foreground">{user?.name || "Eco Citizen"}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email || ""}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              className="cursor-pointer focus:bg-accent focus:text-foreground"
              render={
                <Link href="/settings" className="flex w-full items-center">
                  <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Settings</span>
                </Link>
              }
            />
            {isAdmin && (
              <DropdownMenuItem
                className="cursor-pointer focus:bg-accent focus:text-foreground text-violet-400"
                render={
                  <Link href="/admin" className="flex w-full items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                }
              />
            )}
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
