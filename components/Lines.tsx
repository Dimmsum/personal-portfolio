/* Fine line pattern drawn behind covers that don't have an image yet. */
export function hash(s: string) {
  return [...s].reduce((a, c) => a + c.charCodeAt(0), 7);
}

export function Lines({ seed }: { seed: number }) {
  let s = seed * 9301 + 49297;
  const lines = [];
  for (let i = 0; i < 14; i++) {
    s = (s * 16807) % 2147483647;
    const y = (s % 1000) / 10;
    lines.push(<line key={i} x1="0" y1={y} x2="100" y2={(y + 30) % 100} stroke="#fff" strokeWidth=".25" />);
  }
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {lines}
    </svg>
  );
}

export function GenCover({ label, seed }: { label: string; seed: number }) {
  return (
    <div className="gen">
      <Lines seed={seed} />
      <b>{label}</b>
    </div>
  );
}
