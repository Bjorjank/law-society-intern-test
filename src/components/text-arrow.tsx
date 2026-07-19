import type { ReactNode } from "react";

export function TextArrow({ children, className = "", href }: { children: ReactNode; className?: string; href: string }) {
  return (
    <a className={`text-arrow ${className}`} href={href}>
      <span>{children}</span>
      <svg viewBox="0 0 45 18" aria-hidden="true">
        <path d="M1 9h39M33 2l7 7-7 7" />
      </svg>
    </a>
  );
}
