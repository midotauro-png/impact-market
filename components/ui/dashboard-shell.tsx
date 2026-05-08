"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "@/components/brand/logo";
import { LogOut } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface DashboardShellProps {
  nav: NavItem[];
  title: string;
  children: React.ReactNode;
  role?: "admin" | "vendor" | "driver";
}

export default function DashboardShell({ nav, title, children, role = "admin" }: DashboardShellProps) {
  const pathname = usePathname();

  const roleColor = {
    admin: "bg-navy-600",
    vendor: "bg-emerald-600",
    driver: "bg-purple-600",
  }[role];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className={cn("w-64 hidden lg:flex flex-col shadow-card", roleColor)}>
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-center bg-white/10 rounded-b-none">
          <Logo size="lg" className="brightness-0 invert" />
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition",
                  active
                    ? "bg-white/20 text-white"
                    : "text-white/65 hover:text-white hover:bg-white/10"
                )}
              >
                <span className="shrink-0">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/65 hover:text-white hover:bg-white/10 transition">
            <LogOut size={16} />
            Exit Dashboard
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-soft px-6 h-14 flex items-center justify-between">
          <h1 className="text-base font-bold text-ink">{title}</h1>
          <div className="flex items-center gap-3">
            <span className={cn("badge text-white text-[10px] uppercase tracking-wider", roleColor)}>{role}</span>
          </div>
        </header>
        <main className="flex-1 p-6 space-y-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
