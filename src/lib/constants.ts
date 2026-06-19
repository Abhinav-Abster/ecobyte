// =============================================================================
// EcoByte - Application Constants
// =============================================================================

export const APP_NAME = "EcoByte";
export const APP_DESCRIPTION =
  "Track and reduce your digital carbon footprint with AI-powered insights";

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Track Habits", href: "/track", icon: "ClipboardList" },
  { label: "AI Coach", href: "/coach", icon: "Bot" },
  { label: "Simulate", href: "/simulate", icon: "TrendingDown" },
  { label: "Challenges", href: "/challenges", icon: "Target" },
  { label: "Achievements", href: "/achievements", icon: "Trophy" },
  { label: "Reports", href: "/reports", icon: "FileBarChart" },
] as const;

export const ADMIN_NAV_ITEMS = [
  { label: "Admin Panel", href: "/admin", icon: "Shield" },
] as const;

export const SCORE_BADGES = {
  "Eco Champion": { emoji: "🌿", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  "Green User": { emoji: "🌱", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  "Average User": { emoji: "🌍", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  "Heavy Digital Consumer": { emoji: "⚡", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  "Carbon Intensive User": { emoji: "🔥", color: "bg-red-500/20 text-red-400 border-red-500/30" },
} as const;
