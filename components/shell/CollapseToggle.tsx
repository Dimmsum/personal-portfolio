"use client";

type Props = {
  side: "left" | "right";
  collapsed: boolean;
  onToggle: () => void;
};

export function CollapseToggle({ side, collapsed, onToggle }: Props) {
  const pointsLeft =
    (side === "left" && !collapsed) || (side === "right" && collapsed);

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={collapsed ? "Expand panel" : "Collapse panel"}
      aria-expanded={!collapsed}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--bg-highlight)] hover:text-[var(--text-primary)] transition-colors"
    >
      <svg
        viewBox="0 0 16 16"
        width="14"
        height="14"
        aria-hidden="true"
        className="fill-current"
      >
        {pointsLeft ? (
          <path d="M10.5 2.5 5 8l5.5 5.5 1-1L7 8l4.5-4.5z" />
        ) : (
          <path d="M5.5 2.5 11 8l-5.5 5.5-1-1L9 8 4.5 3.5z" />
        )}
      </svg>
    </button>
  );
}
