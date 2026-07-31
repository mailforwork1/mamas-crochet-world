type IconProps = { className?: string; size?: number };

export const HeartIcon = ({ className = "", size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const BagIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M5 8h14l-1.2 11a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8z" stroke="currentColor" strokeWidth="1.4" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const SearchIcon = ({ className = "", size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
    <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const StarIcon = ({ className = "", size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M12 2.5l2.9 6.2 6.6.6-5 4.6 1.5 6.6L12 17l-5.9 3.5 1.5-6.6-5-4.6 6.6-.6L12 2.5z" />
  </svg>
);

export const SparkleIcon = ({ className = "", size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M12 2l1.7 5.5L19 9l-5.3 1.5L12 16l-1.7-5.5L5 9l5.3-1.5L12 2z" />
    <path d="M19 14l.7 2.1L22 17l-2.3.9L19 20l-.7-2.1L16 17l2.3-.9L19 14z" opacity="0.6" />
  </svg>
);

export const InstagramIcon = ({ className = "", size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);

export const FacebookIcon = ({ className = "", size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M14 22V13h3l.5-3.5H14V7.2c0-1 .3-1.7 1.8-1.7H18V2.2C17.6 2.1 16.4 2 15 2c-3 0-5 1.8-5 5v2.5H7V13h3v9h4z" fill="currentColor" />
  </svg>
);

export const PinterestIcon = ({ className = "", size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.4" />
    <path d="M11 7c-2 0-4 1.4-4 4 0 1.5.8 2.4 1.6 2.4.3 0 .5-.3.6-.7.1-.3 0-.7-.1-1-.3-.9-.4-2.1.5-2.9.9-.9 2.5-1 3.4 0 1 1 .8 3-.1 4-.6.6-1.5.4-1.7-.4-.4-1.2.5-2.5-.4-2.7-1-.2-1.4 1.4-1.2 2.3.1.5.4 1 .4 1.4 0 .8-1 4.5-1.2 5.6-.2.7 0 1.6.1 1.8.1.1.2.2.3.1.2-.2 1.5-1.7 1.9-3.3.1-.3.6-2.2.6-2.2.3.6 1.2 1.1 2.2 1.1 2.9 0 4.9-2.6 4.9-5.6 0-2.5-2.1-5-5.7-5z" fill="currentColor" />
  </svg>
);

export const HookIcon = ({ className = "", size = 22 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M12 22V8 M12 8c0-3 2-5 5-5s4 2 4 4-1 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="12" cy="22" r="0.5" fill="currentColor" />
  </svg>
);

export const LeafIcon = ({ className = "", size = 22 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M5 19c0-8 6-14 16-14 0 10-6 16-14 16-1 0-2-1-2-2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M5 19c4-4 8-7 14-12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
