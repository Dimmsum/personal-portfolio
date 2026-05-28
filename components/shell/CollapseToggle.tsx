"use client";

type Props = {
  side: "left" | "right";
  collapsed: boolean;
  onToggle: () => void;
};

export function CollapseToggle({ collapsed, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      aria-expanded={!collapsed}
      className="group relative inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-highlight)] hover:text-[var(--text-primary)] transition-colors"
    >
      {collapsed ? (
        <>
          {/* DL initials — shown by default, fades out on hover */}
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold tracking-tight text-[var(--accent)] transition-opacity duration-150 group-hover:opacity-0">
            DL
          </span>
          {/* Sidebar icon — hidden by default, fades in on hover */}
          <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            <SidebarIcon />
          </span>
        </>
      ) : (
        <SidebarIcon />
      )}
    </button>
  );
}

function SidebarIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="18"
      height="18"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="16" height="16" rx="2.5" />
      <line x1="7" y1="2" x2="7" y2="18" />
    </svg>
  );
}
