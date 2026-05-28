import { profile } from "@/lib/content/profile";

export default function AboutPage() {
  return (
    <div className="px-6 pt-6 pb-16 max-w-2xl">
      <div className="flex flex-col gap-10">
        <section className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            {profile.displayName ?? profile.name}
          </h1>
          <p className="text-sm text-[var(--text-muted)]">{profile.role}</p>
          <p className="text-base leading-7 text-[var(--text-muted)]">{profile.bio}</p>
        </section>

        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            Now
          </h2>
          <ul className="flex flex-col gap-2">
            {profile.now.map((n) => (
              <li key={n} className="flex gap-2 text-sm text-[var(--text-primary)]">
                <span className="text-[var(--accent)]">·</span>
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            Contact
          </h2>
          <ul className="flex flex-col gap-2">
            {profile.contact.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  className="text-sm text-[var(--text-primary)] transition-colors hover:text-[var(--accent)]"
                >
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
