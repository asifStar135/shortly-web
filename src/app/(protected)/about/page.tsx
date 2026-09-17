import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  LockKeyhole,
  QrCode,
  Server,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Github from "@/components/ui/icons/Github";
import Linkedin from "@/components/ui/icons/Linkedin";

const projects = [
  {
    name: "Quick drive - car rental platform",
    description:
      "Premium car rental service with a wide selection of luxury and everyday vehicles for all your driving needs.",
    technologies: ["React.js", "Typescript", "Node.js", "MongoDB"],
    url: "https://car-rental-mdasif.vercel.app/",
  },
  {
    name: "Flav-Ur a recipe companion",
    description:
      "A recipe discovery and cookbook web-app for search, save, and manage recipes while adding custom notes for a personalized cooking experience.",
    technologies: ["Next.js", "Clerk-auth", "MongoDB", "TailwindCSS"],
    url: "https://flav-ur-asif.vercel.app",
  },
  {
    name: "Sign languagge detector",
    description:
      "Real-time hand gesture recognition system designed for the hearing-impaired and non-verbal individuals and help them communicate.",
    technologies: ["React.js", "YOLOv5", "Tensorflow.js"],
    url: "https://sign-language-detector-ae17.onrender.com/",
  },
];

const implementedStack = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "shadcn/ui",
  "Java",
  "Spring Boot",
  "REST APIs",
  "PostgreSQL",
  "JWT Authentication",
];

const futureStack = [
  "Redis",
  "Docker",
  "AWS",
  "Caching",
  "Async Processing",
  "Performance Optimization",
];

const roadmap = [
  {
    title: "URL shortening",
    description: "Create fast and reliable short links.",
    completed: true,
  },
  {
    title: "Authentication",
    description: "Secure user accounts with JWT authentication.",
    completed: true,
  },
  {
    title: "URL management",
    description: "Create, edit, enable, disable and delete links.",
    completed: true,
  },
  {
    title: "URL expiration",
    description: "Automatically expire links after a defined period.",
    completed: true,
  },
  {
    title: "Analytics",
    description: "Analyze your visitors region and device types.",
    completed: true,
  },
  {
    title: "QR codes",
    description: "Generate shareable QR codes for short links.",
    completed: false,
  },
  {
    title: "Password protected URLs",
    description: "Restrict access to sensitive short links.",
    completed: false,
  },
  {
    title: "Scalability & optimization",
    description:
      "Introduce caching, Redis, Docker and AWS as the system grows.",
    completed: false,
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f8f0df] text-[#111111]">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        {/* Hero */}
        <section className="relative flex min-h-[75vh] flex-col justify-center py-24">
          <p className="mb-6 text-sm font-medium uppercase tracking-[0.3em] text-gray-500">
            About shortLy
          </p>

          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-7xl">
            A URL shortener built to understand what happens behind the
            <span className="text-[#735b25]"> shorten button.</span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-500">
            shortLy is a production-oriented URL shortener built as a practical
            engineering project — focusing on clean architecture, security, low
            latency and the challenges of scaling a seemingly simple system.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/shorten"
              className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-transparent hover:text-[#111111] hover:ring-1 hover:ring-[#111111]"
            >
              Try shortLy
              <ArrowRight size={16} />
            </Link>

            <a
              href="#engineering"
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm font-medium transition-all hover:bg-white/40"
            >
              Explore the engineering
            </a>
          </div>

          <div className="absolute bottom-10 left-0 hidden text-xs uppercase tracking-[0.2em] text-gray-400 md:block">
            Built with curiosity · Designed for scale
          </div>
        </section>

        {/* Why */}
        <section className="border-y border-gray-300/70 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-gray-500">
                Why shortLy?
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Simple product. Interesting engineering.
              </h2>

              <p className="mt-6 text-base leading-8 text-gray-500">
                A URL shortener looks simple from the outside. Behind it are
                interesting problems around unique ID generation, database
                design, authentication, redirects, caching, traffic distribution
                and system scalability.
              </p>

              <p className="mt-5 text-base leading-8 text-gray-500">
                shortLy is being built incrementally, starting with a clean
                functional foundation and evolving towards a system that can
                handle real-world scale.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 md:py-28">
          <SectionHeading
            eyebrow="What it does"
            title="Everything you need to manage your links."
          />

          <div className="mt-12 grid gap-px border border-gray-300/70 bg-gray-300/70 md:grid-cols-2">
            <Feature
              icon={<Zap size={22} />}
              title="Fast URL shortening"
              description="Generate compact short links and redirect users to their destination with minimal overhead."
            />

            <Feature
              icon={<Server size={22} />}
              title="URL management"
              description="Create, update, enable, disable and delete your short links from one place."
            />

            <Feature
              icon={<ShieldCheck size={22} />}
              title="Secure authentication"
              description="User accounts and protected API access are handled using JWT-based authentication."
            />

            <Feature
              icon={<LockKeyhole size={22} />}
              title="Expiration control"
              description="Support links that automatically become unavailable after their configured expiration time."
            />

            <Feature
              icon={<QrCode size={22} />}
              title="QR codes"
              description="Generate QR codes for your short links when the feature is introduced."
              comingSoon
            />

            <Feature
              icon={<Zap size={22} />}
              title="Detailed analytics"
              description="Track visits and understand how your links are being used."
              comingSoon
            />
          </div>
        </section>

        {/* Engineering */}
        <section
          id="engineering"
          className="border-y border-gray-300/70 py-20 md:py-28"
        >
          <SectionHeading
            eyebrow="Engineering"
            title="Built with today's stack. Designed for tomorrow's scale."
          />

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {/* Current */}
            <div className="border border-gray-300/70 p-7 md:p-8">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-400">
                Currently built with
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {implementedStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-gray-300 bg-white/20 px-4 py-2 text-sm text-gray-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Future */}
            <div className="border border-gray-300/70 p-7 md:p-8">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-400">
                Scaling next
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {futureStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-dashed border-[#bcae91] px-4 py-2 text-sm text-gray-500"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <p className="mt-7 text-sm leading-6 text-gray-500">
                These technologies will be introduced as the application evolves
                and real scalability requirements emerge.
              </p>
            </div>
          </div>

          {/* Architecture */}
          <div className="mt-10 border border-gray-300/70 p-7 md:p-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-400">
                  Architecture
                </p>

                <h3 className="mt-3 text-2xl font-semibold">
                  Modular by design.
                </h3>

                <p className="mt-3 max-w-lg text-sm leading-6 text-gray-500">
                  The system is structured so individual responsibilities can
                  evolve independently without turning the application into a
                  tightly coupled codebase.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                <ArchitectureBox text="Next.js" />
                <ArrowRight size={16} className="text-gray-400" />
                <ArchitectureBox text="Spring Boot" />
                <ArrowRight size={16} className="text-gray-400" />
                <ArchitectureBox text="PostgreSQL" />
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="py-20 md:py-28">
          <SectionHeading
            eyebrow="Roadmap"
            title="Built incrementally, with more to come."
          />

          <div className="mt-12 divide-y divide-gray-300/70 border-y border-gray-300/70">
            {roadmap.map((item, index) => (
              <div key={item.title} className="flex items-start gap-5 py-6">
                <div
                  className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                    item.completed
                      ? "border-[#3c2d11] bg-[#3c2d11] text-[#f8f0df]"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {item.completed ? (
                    <Check size={14} />
                  ) : (
                    <span className="text-xs">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-medium">{item.title}</h3>

                    {!item.completed && (
                      <span className="rounded-full border border-gray-300 px-2.5 py-1 text-[10px] uppercase tracking-wider text-gray-400">
                        Coming soon
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Developer */}
        <section className="border-t border-gray-300/70 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-[1fr_1.5fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-gray-500">
                The developer
              </p>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3c2d11] text-lg font-semibold text-[#f8f0df]">
                  AM
                </div>

                <div>
                  <h2 className="text-xl font-semibold">Md Asif Mondal</h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Software Engineer
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <SocialLink
                  href="https://github.com/asifstar135"
                  icon={<Github />}
                  label="GitHub"
                />

                <SocialLink
                  href="https://linkedin.com/mdasif135"
                  icon={<Linkedin />}
                  label="LinkedIn"
                />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Built as a project, approached like a product.
              </h2>

              <p className="mt-6 text-base leading-8 text-gray-500">
                shortLy is a hands-on exploration of building a complete
                application from the ground up — from the UI and APIs to
                authentication, database design and eventually cloud
                infrastructure.
              </p>

              <p className="mt-5 text-base leading-8 text-gray-500">
                The goal isn't just to make a URL shortener work. It's to
                understand the engineering decisions that make a system
                maintainable, secure, performant and ready to scale.
              </p>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section className="border-t border-gray-300/70 py-20 md:py-28">
          <SectionHeading
            eyebrow="More from the developer"
            title="Other things I've built."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-y border-gray-300/70 py-20 text-center md:py-28">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-gray-500">
            Ready when you are
          </p>

          <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
            Turn a long link into something worth sharing.
          </h2>

          <Link
            href="/shorten"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#111111] px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-transparent hover:text-[#111111] hover:ring-1 hover:ring-[#111111]"
          >
            Create your first URL
            <ArrowUpRight size={17} />
          </Link>
        </section>

        {/* Footer */}
        <footer className="flex flex-col items-center justify-between gap-4 py-8 text-sm text-gray-400 sm:flex-row">
          <span>© 2026 shortLy</span>

          <span>Built with curiosity and a lot of engineering.</span>
        </footer>
      </div>
    </main>
  );
}

/* -------------------------------- Components ------------------------------- */

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-medium uppercase tracking-[0.25em] text-gray-500">
        {eyebrow}
      </p>

      <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
  comingSoon = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  comingSoon?: boolean;
}) {
  return (
    <div className="relative bg-[#f8f0df] p-7 md:p-8">
      {comingSoon && (
        <span className="absolute right-6 top-6 rounded-full border border-gray-300 px-3 py-1 text-[10px] uppercase tracking-wider text-gray-400">
          Coming soon
        </span>
      )}

      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-[#735b25]">
        {icon}
      </div>

      <h3 className="mt-7 text-xl font-medium">{title}</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
        {description}
      </p>
    </div>
  );
}

function ArchitectureBox({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-gray-300 bg-white/20 px-4 py-3 font-medium">
      {text}
    </div>
  );
}

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm transition-all hover:bg-white/50"
    >
      {icon}
      {label}
      <ArrowUpRight size={13} />
    </a>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <article className="group flex min-h-[290px] flex-col justify-between border border-gray-300/70 p-6 transition-all hover:-translate-y-1 hover:bg-white/20">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold">{project.name}</h3>

          <ArrowUpRight
            size={18}
            className="text-gray-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>

        <p className="my-4 text-sm leading-6 text-gray-500">
          {project.description}
        </p>
      </div>

      <div>
        <div className="mb-5 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-[#eee4cf] px-3 py-1.5 text-xs text-[#5c4b2b]"
            >
              {tech}
            </span>
          ))}
        </div>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#735b25] underline decoration-[#cdbb8f] underline-offset-4 transition-colors hover:text-[#3c2d11]"
        >
          Visit project
          <ArrowRight size={14} />
        </a>
      </div>
    </article>
  );
}
