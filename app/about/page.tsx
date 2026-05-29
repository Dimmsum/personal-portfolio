import Image from "next/image";
import { HobbyCarousel } from "@/components/about/HobbyCarousel";

// ─── Timeline data ─────────────────────────────────────────────────────────────
// Replace entries with your real history.

type TimelineEntry = {
  date: string;
  title: string;
  subtitle?: string;
  description: string;
};

const timeline: TimelineEntry[] = [
  {
    date: "2024 — Present",
    title: "API Team Lead @ Sagicor Innovation Lab",
    subtitle: "Kingston, Jamaica",
    description:
      "Leading the API team, designing and building internal APIs that power core banking and customer-facing products. Driving best practices, code reviews, and cross-team integration.",
  },
  {
    date: "2024 — Present",
    title: "Software Engineering Intern @ Intellibus",
    subtitle: "Remote",
    description:
      "Working on full-stack features and tooling. Collaborating with a distributed team to ship product improvements and internal developer tooling.",
  },
  {
    date: "2022 — Present",
    title: "University of Technology, Jamaica",
    subtitle: "BSc. Computing",
    description:
      "Pursuing a degree in Computing with a focus on software engineering. Building side projects and contributing to student tech communities alongside coursework.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="px-6 pt-6 pb-16">
      <div className="flex flex-col gap-16">
        <IntroSection />
        <TimelineSection />
        <HobbiesSection />
      </div>
    </div>
  );
}

// ─── Intro ────────────────────────────────────────────────────────────────────

function IntroSection() {
  return (
    <section className="grid grid-cols-1 items-start gap-10 sm:grid-cols-[2fr_3fr]">
      {/* Photo */}
      <div className="relative w-full overflow-hidden rounded-2xl sm:sticky sm:top-6" style={{ aspectRatio: "3/4" }}>
        <Image
          src="/picture-1.png"
          alt="Dimetri Lee"
          fill
          className="object-cover object-top"
        />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            About me
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Hey, I&apos;m Dimetri.
          </h1>
        </div>

        <div className="flex flex-col gap-4 text-base leading-7 text-[var(--text-muted)]">
          <p>
            I&apos;m a software engineer based in Jamaica, currently working as
            an API Team Lead at the Sagicor Innovation Lab and as a software
            engineering intern at Intellibus. I&apos;m also pursuing my BSc in
            Computing at the University of Technology, Jamaica.
          </p>
          <p>
            I care about building things that are useful and well-crafted —
            whether that&apos;s a clean API, a thoughtful user interface, or a
            tool that makes someone&apos;s day a little more efficient. I
            believe in understanding fundamentals deeply before leaning on
            abstractions, and I&apos;m always looking for the clearest, most
            maintainable way to solve a problem.
          </p>
          <p>
            Outside of work I&apos;m usually reading, working on side projects,
            or exploring ideas that sit at the intersection of technology and
            everyday life. I&apos;m currently building a university-student
            exclusive platform to buy, sell, and earn money through tasks.
          </p>
          <p className="text-[var(--text-dim)] text-sm italic">
            — Replace this text with your own words whenever you&apos;re ready.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

function TimelineSection() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
          My Journey
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Timeline
        </h2>
      </div>

      {/* Entries */}
      <div className="relative flex flex-col gap-0 pl-6">
        {/* Vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--border-subtle)]" />

        {timeline.map((entry, i) => (
          <div key={i} className="relative flex flex-col gap-1 pb-10 last:pb-0">
            {/* Dot */}
            <div className="absolute -left-[1px] top-[6px] h-3 w-3 rounded-full border-2 border-[var(--accent)] bg-[var(--bg-base)]" />

            <div className="flex flex-col gap-0.5 pl-5">
              <span className="text-xs font-mono text-[var(--accent)]">{entry.date}</span>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">{entry.title}</h3>
              {entry.subtitle && (
                <span className="text-xs text-[var(--text-dim)]">{entry.subtitle}</span>
              )}
              <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{entry.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Hobbies ──────────────────────────────────────────────────────────────────

function HobbiesSection() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
          Outside of work
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Hobbies
        </h2>
      </div>

      <HobbyCarousel />
    </section>
  );
}
