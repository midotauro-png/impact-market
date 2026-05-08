import DashboardShell from "@/components/ui/dashboard-shell";
import { LayoutDashboard, Navigation, DollarSign, Clock } from "lucide-react";

const NAV = [
  { href: "/driver",          label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { href: "/driver/delivery", label: "Active Delivery", icon: <Navigation size={16} /> },
  { href: "/driver/earnings", label: "Earnings", icon: <DollarSign size={16} /> },
  { href: "/driver/history",  label: "History", icon: <Clock size={16} /> },
];

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell nav={NAV} title="Driver App" role="driver">
      {children}
    </DashboardShell>
  );
}
