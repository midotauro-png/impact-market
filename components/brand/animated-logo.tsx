"use client";

const ANIM_STYLES = `
  .im-anim-logo-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .im-anim-logo {
    object-fit: contain;
    animation:
      logoEntrance 1.3s cubic-bezier(0.34, 1.56, 0.64, 1) both,
      logoFloat    4s   2s ease-in-out infinite,
      logoGlow     3s   1.5s ease-in-out infinite;
    will-change: transform, filter;
  }

  @keyframes logoEntrance {
    0%   {
      opacity: 0;
      transform: scale(0.85) translateY(22px);
      filter: drop-shadow(0 0 0px rgba(244,120,32,0));
    }
    55%  {
      opacity: 1;
      transform: scale(1.06) translateY(-5px);
      filter: drop-shadow(0 0 40px rgba(244,120,32,0.65));
    }
    75%  {
      transform: scale(0.97) translateY(2px);
      filter: drop-shadow(0 0 22px rgba(244,120,32,0.45));
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
      filter: drop-shadow(0 0 24px rgba(244,120,32,0.38));
    }
  }

  @keyframes logoFloat {
    0%,  100% { transform: translateY(0px); }
    50%        { transform: translateY(-9px); }
  }

  @keyframes logoGlow {
    0%,  100% { filter: drop-shadow(0 0 20px rgba(244,120,32,0.32)) drop-shadow(0 4px 18px rgba(212,168,67,0.18)); }
    50%        { filter: drop-shadow(0 0 38px rgba(244,120,32,0.56)) drop-shadow(0 4px 28px rgba(212,168,67,0.30)); }
  }
`;

interface AnimatedLogoProps {
  width?: number | string;
  className?: string;
}

export default function AnimatedLogo({ width = 340, className = "" }: AnimatedLogoProps) {
  return (
    <div className={`im-anim-logo-wrap ${className}`}>
      <style>{ANIM_STYLES}</style>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="Impact Market — Inspire"
        className="im-anim-logo"
        style={{ width, maxWidth: "100%" }}
        draggable={false}
      />
    </div>
  );
}
