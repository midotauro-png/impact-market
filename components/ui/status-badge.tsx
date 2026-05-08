import { cn } from "@/lib/utils";
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR, APPROVAL_COLOR } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  type?: "order" | "approval";
  className?: string;
}

export default function StatusBadge({ status, type = "order", className }: StatusBadgeProps) {
  const colorMap = type === "order" ? ORDER_STATUS_COLOR : APPROVAL_COLOR;
  const labelMap = type === "order" ? ORDER_STATUS_LABEL : {
    pending: "Pending", approved: "Approved", rejected: "Rejected", suspended: "Suspended",
  };
  return (
    <span className={cn("badge", colorMap[status] ?? "badge-gray", className)}>
      {labelMap[status] ?? status}
    </span>
  );
}
