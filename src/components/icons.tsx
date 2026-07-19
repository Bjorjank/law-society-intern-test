import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...common} {...props}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...common} {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...common} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...common} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function ScaleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...common} {...props}>
      <path d="M24 8v30M15 40h18M12 14h24M16 14 8 28h16L16 14ZM32 14l-8 14h16L32 14Z" />
      <path d="M8 28c1.2 4 4 6 8 6s6.8-2 8-6M24 28c1.2 4 4 6 8 6s6.8-2 8-6" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...common} {...props}>
      <path d="M24 5 39 11v11c0 10-6.2 17-15 21-8.8-4-15-11-15-21V11l15-6Z" />
      <path d="m17 24 5 5 10-11" />
    </svg>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...common} {...props}>
      <path d="M7 9h12c4 0 7 3 7 7v25c0-4-3-7-7-7H7V9Z" />
      <path d="M41 9H29c-4 0-7 3-7 7v25c0-4 3-7 7-7h12V9Z" />
    </svg>
  );
}

export function PeopleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...common} {...props}>
      <circle cx="18" cy="17" r="6" />
      <circle cx="34" cy="19" r="5" />
      <path d="M6 39c1-8 5-12 12-12s11 4 12 12M28 30c2-3 4-5 8-5 5 0 8 4 8 11" />
    </svg>
  );
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...common} {...props}>
      <path d="M14 5h5v5M19 5l-9 9" />
      <path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
    </svg>
  );
}
