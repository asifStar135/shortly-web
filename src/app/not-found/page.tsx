import Image from "next/image";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#fffaf0] text-zinc-950">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6">
        <header className="flex h-20 items-center">
          <a href="/home" className="text-lg font-semibold tracking-tight">
            <Image
              src="/images/brandicon.png"
              alt="Shortify-brand"
              height={100}
              width={250}
            />
          </a>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="mb-6 text-5xl">O(´•̥﹏•̥`)o</div>

          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">
            404
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Oops! That link is lost.
          </h1>

          <p className="mt-4 max-w-md text-sm leading-6 text-zinc-500">
            This short URL doesn&apos;t exist anymore, or it may have never
            existed in the first place.
          </p>

          <a
            href="/home"
            className="mt-8 text-sm font-medium underline underline-offset-8 transition-opacity hover:opacity-60"
          >
            Take me home →
          </a>
        </section>

        <footer className="flex h-20 items-center justify-center border-t border-zinc-200 text-xs text-zinc-400">
          © 2026 shortLy. Simple links, simply shared.
        </footer>
      </div>
    </main>
  );
}
