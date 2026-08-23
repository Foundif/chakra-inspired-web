import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useSettings } from "@/hooks/useSettings";
import logo from "@/assets/chakra-logo.png";

const pad = (n: number) => String(n).padStart(2, "0");

const LaunchingSoon = ({ title, message, launchAt }: { title: string; message: string; launchAt: string | null }) => {
  const s = useSettings();
  const [now, setNow] = useState(Date.now());
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const target = launchAt ? new Date(launchAt).getTime() : null;
  const diff = target ? Math.max(0, target - now) : null;

  useEffect(() => {
    if (diff === null || launched) return;
    if (diff === 0 && target && now >= target) {
      setLaunched(true);
      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({ origin: { y: 0.6 }, particleCount: Math.floor(220 * particleRatio), ...opts });
      };
      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
      const burst = setInterval(() => {
        confetti({ particleCount: 80, spread: 90, origin: { x: Math.random(), y: Math.random() * 0.4 } });
      }, 700);
      setTimeout(() => { clearInterval(burst); window.location.reload(); }, 6000);
    }
  }, [diff, target, now, launched]);

  const d = diff ?? 0;
  const days = Math.floor(d / 86400000);
  const hours = Math.floor((d % 86400000) / 3600000);
  const mins = Math.floor((d % 3600000) / 60000);
  const secs = Math.floor((d % 60000) / 1000);

  return (
    <div className="min-h-screen bg-gradient-to-br from-foreground via-foreground to-black text-white flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-[40rem] h-[40rem] rounded-full bg-orange/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-[40rem] h-[40rem] rounded-full bg-orange/10 blur-3xl" />
      <div className="relative max-w-3xl w-full text-center">
        <img src={logo} alt={s.company_name} className="h-20 w-auto mx-auto bg-white rounded-2xl p-2 mb-10" />
        {launched ? (
          <>
            <h1 className="font-display text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-orange via-amber-300 to-orange bg-clip-text text-transparent">We're Live! 🎉</h1>
            <p className="text-lg text-white/70">Redirecting you to the website…</p>
          </>
        ) : (
          <>
            <p className="uppercase tracking-[0.3em] text-orange text-xs md:text-sm font-bold mb-4">Coming Soon</p>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-5 leading-tight">{title}</h1>
            <p className="text-base md:text-lg text-white/70 max-w-xl mx-auto mb-10">{message}</p>
            {target && (
              <div className="grid grid-cols-4 gap-3 md:gap-5 max-w-lg mx-auto mb-10">
                {[
                  { v: days, l: "Days" },
                  { v: hours, l: "Hours" },
                  { v: mins, l: "Minutes" },
                  { v: secs, l: "Seconds" },
                ].map((u) => (
                  <div key={u.l} className="bg-white/5 border border-white/10 rounded-2xl p-3 md:p-5 backdrop-blur">
                    <div className="font-display text-3xl md:text-5xl font-extrabold text-orange tabular-nums">{pad(u.v)}</div>
                    <div className="text-[10px] md:text-xs uppercase tracking-widest text-white/60 mt-1">{u.l}</div>
                  </div>
                ))}
              </div>
            )}
            <p className="text-sm text-white/50">{s.company_name} · {s.city}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default LaunchingSoon;
