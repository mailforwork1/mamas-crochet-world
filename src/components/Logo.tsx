type LogoProps = {
  size?: number;
  showText?: boolean;
  variant?: "header" | "footer";
};

const LOGO_URL = "https://i.postimg.cc/DZKBkzvB/Mama-s-Crochet-World-Logo.png";

export default function Logo({ size = 48, showText = false, variant = "header" }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-[#f3d9d4]"
        style={{ height: size, width: size }}
      >
        <img
          src={LOGO_URL}
          alt="Mama's Crochet World"
          width={size}
          height={size}
          className="h-full w-full rounded-full object-cover"
        />
      </span>
      {showText && (
        <div className="leading-tight">
          <div
            className="font-script text-2xl"
            style={{ color: variant === "footer" ? "#b87168" : "#b87168" }}
          >
            Mama's Crochet World
          </div>
          <div className="text-[0.62rem] tracking-[0.32em] uppercase" style={{ color: "#4a3f3a" }}>
            Handmade with love
          </div>
        </div>
      )}
    </div>
  );
}
