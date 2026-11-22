"use client";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";

type Stat = { icon: string; value: string; label: string };

function CountUp({ value }: { value: string }) {
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const m = value.match(/^([\d.]+)(.*)$/);
    if (!m || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const end = parseFloat(m[1]);
    const dec = (m[1].split(".")[1] || "").length;
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 1100);
      setShown((end * (1 - (1 - p) ** 3)).toFixed(dec) + m[2]);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <div className="n">{shown}</div>;
}

export function Stats({ stats, note }: { stats: Stat[]; note?: string }) {
  return (
    <>
      <div className="stats">
        {stats.map((s, i) => (
          <div className="stat rise" style={{ "--d": `${0.25 + i * 0.06}s` } as React.CSSProperties} key={s.label}>
            <CountUp value={s.value} />
            <div className="l">
              <Icon name={s.icon} />
              {s.label}
            </div>
          </div>
        ))}
      </div>
      {note && <p className="note">{note}</p>}
    </>
  );
}
