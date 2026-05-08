import DashboardShell from "@/components/ui/dashboard-shell";
import {
  LayoutDashboard, MapPin, ShoppingBag, Users, Truck,
  BadgeDollarSign, BarChart3, Settings, Tag, Navigation, Wallet,
} from "lucide-react";

const NAV = [
  { href: "/admin",             label: "Overview",      icon: <LayoutDashboard size={16} /> },
  { href: "/admin/zones",       label: "Zones",         icon: <MapPin size={16} /> },
  { href: "/admin/orders",      label: "Orders",        icon: <ShoppingBag size={16} /> },
  { href: "/admin/vendors",     label: "Vendors",       icon: <Users size={16} /> },
  { href: "/admin/drivers",     label: "Drivers",       icon: <Truck size={16} /> },
  { href: "/admin/delivery",    label: "Live Delivery", icon: <Navigation size={16} /> },
  { href: "/admin/payouts",     label: "Payouts",       icon: <Wallet size={16} /> },
  { href: "/admin/commissions", label: "Commissions",   icon: <BadgeDollarSign size={16} /> },
  { href: "/admin/reports",     label: "Reports",       icon: <BarChart3 size={16} /> },
  { href: "/admin/categories",  label: "Categories",    icon: <Tag size={16} /> },
  { href: "/admin/settings",    label: "Settings",      icon: <Settings size={16} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell nav={NAV} title="Admin Dashboard" role="admin">
      {children}
    </DashboardShell>
  );
}
