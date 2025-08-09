import { useEffect, useState } from "react";

export default function ThattukadaLoader({
  visible,
  onFinish,
  autoHideDelay = 3000,
}) {
  const [isVisible, setIsVisible] = useState(
    typeof visible === "boolean" ? visible : true
  );

  useEffect(() => {
    if (typeof visible === "boolean") {
      setIsVisible(visible);
      if (!visible && typeof onFinish === "function") onFinish();
      return;
    }

    const handleLoad = () => {
      setTimeout(() => {
        setIsVisible(false);
        if (typeof onFinish === "function") onFinish();
      }, autoHideDelay);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, [visible, onFinish, autoHideDelay]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-amber-900 via-amber-800 to-amber-700 text-white"
      aria-hidden
    >
      <style>{`
        @keyframes canopy-sway { 0% { transform: translateY(0) rotate(-1deg);} 50% { transform: translateY(2px) rotate(1deg);} 100% { transform: translateY(0) rotate(-1deg);} }
        @keyframes steam-rise { 0% { transform: translateY(6px) scaleY(0.9); opacity: 0;} 40% { opacity: .8; } 100% { transform: translateY(-30px) scaleY(1.2); opacity: 0;} }
        @keyframes lamp-swing { 0% { transform: rotate(-6deg);} 50% { transform: rotate(6deg);} 100% { transform: rotate(-6deg);} }
        @keyframes pulse { 0% { transform: scale(0.96);} 50% { transform: scale(1);} 100% { transform: scale(0.96);} }
        .ttk-card { width: min(880px, 90%); max-width:1100px; padding: 2.4rem; border-radius: 1rem; box-shadow: 0 20px 50px rgba(0,0,0,0.45); backdrop-filter: blur(4px); }
        .canopy { transform-origin: center top; animation: canopy-sway 3s ease-in-out infinite; }
        .lamp { transform-origin: top center; animation: lamp-swing 2.8s ease-in-out infinite; }
        .steam { animation: steam-rise 2.2s ease-in-out infinite; }
        .brand { animation: pulse 1.6s ease-in-out infinite; }
        @media (max-width:640px) {
          .ttk-card { padding: 1.2rem; }
        }
      `}</style>

      <div className="ttk-card flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-yellow-50/10 to-transparent border border-yellow-200/10">
        <div className="w-full flex items-center justify-center">
          <svg
            className="canopy w-4/5 max-w-3xl"
            viewBox="0 0 1200 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0" stopColor="#FFB74D" />
                <stop offset="1" stopColor="#FF8A65" />
              </linearGradient>
            </defs>
            <path
              d="M0 120 C150 20, 350 20, 500 120 C650 220, 850 220,1200 120 L1200 220 L0 220 Z"
              fill="url(#g1)"
              opacity="0.98"
            />
            <g transform="translate(30,116)">
              {Array.from({ length: 18 }).map((_, i) => {
                const x = i * 66;
                return (
                  <path
                    key={i}
                    d={`M${x} 0 Q${x + 24} 18 ${x + 48} 0 L${x + 48} 26 L${x} 26 Z`}
                    fill={i % 2 ? "#6D4C41" : "#3E2723"}
                    opacity="0.85"
                  />
                );
              })}
            </g>
          </svg>
        </div>

        <div className="flex items-center gap-6 md:gap-10">
          <div className="relative w-36 h-24 md:w-52 md:h-36 flex items-end justify-center">
            <svg viewBox="0 0 200 120" className="w-full h-full">
              <ellipse
                cx="100"
                cy="72"
                rx="82"
                ry="28"
                fill="#2E2E2E"
                opacity="0.95"
              />
              <ellipse cx="100" cy="62" rx="56" ry="18" fill="#3B3B3B" />
              <rect
                x="32"
                y="66"
                width="136"
                height="18"
                rx="9"
                fill="#1F1F1F"
              />
              <rect
                x="6"
                y="72"
                width="28"
                height="10"
                rx="6"
                fill="#4A2E0E"
                transform="rotate(-12 6 72)"
              />
            </svg>
            <div
              style={{
                position: "absolute",
                top: -18,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 10,
              }}
            >
              {[0, 1, 2].map((n) => (
                <svg
                  key={n}
                  className="steam"
                  style={{
                    width: 28 + n * 6,
                    height: 40 + n * 6,
                    animationDelay: `${n * 0.25}s`,
                  }}
                  viewBox="0 0 24 40"
                  fill="none"
                >
                  <path
                    d="M4 30 C6 20, 12 12, 12 6 C12 2, 16 2, 16 6 C16 10, 12 14, 12 18"
                    stroke="rgba(255,255,255,0.85)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start gap-1">
            <div
              className="brand text-3xl md:text-5xl font-extrabold tracking-tight leading-none"
              style={{ color: "#FFF7ED" }}
            >
              തട്ടുകട
            </div>
          </div>
        </div>

        <div className="absolute right-8 top-12 hidden sm:block">
          <svg className="lamp w-20 h-20" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="18" r="10" fill="#FFECB3" opacity="0.95" />
            <rect x="38" y="28" width="4" height="22" rx="2" fill="#6D4C41" />
            <ellipse cx="40" cy="56" rx="18" ry="6" fill="#3E2723" />
            <g opacity="0.12">
              <ellipse cx="40" cy="54" rx="12" ry="3" fill="#000" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
