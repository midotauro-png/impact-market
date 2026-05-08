import DashboardShell from "@/components/ui/dashboard-shell";
import { LayoutDashboard, Package, ShoppingBag, DollarSign, Star, CreditCard } from "lucide-react";

const NAV = [
  { href: "/vendor",              label: "Overview",     icon: <LayoutDashboard size={16} /> },
  { href: "/vendor/products",     label: "Products",     icon: <Package size={16} /> },
  { href: "/vendor/orders",       label: "Orders",       icon: <ShoppingBag size={16} /> },
  { href: "/vendor/earnings",     label: "Earnings",     icon: <DollarSign size={16} /> },
  { href: "/vendor/reviews",      label: "Reviews",      icon: <Star size={16} /> },
  { href: "/vendor/subscription", label: "Subscription", icon: <CreditCard size={16} /> },
];

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell nav={NAV} title="Vendor Dashboard" role="vendor">
      {children}
    </DashboardShell>
  );
}
