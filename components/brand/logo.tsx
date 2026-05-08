import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "full" | "icon";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ variant = "full", className, size = "md" }: LogoProps) {
  const heights: Record<string, string> = {
    sm: "h-10",
    md: "h-14",
    lg: "h-20",
  };

  if (variant === "icon") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/logo.png"
        alt="Impact Market"
        className={cn("w-auto object-contain", heights[size], className)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="Impact Market — Inspire"
      className={cn("w-auto object-contain", heights[size], className)}
    />
  );
}
