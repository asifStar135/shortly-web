import LoginForm from "@/components/Forms/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f8f0e0] text-zinc-950">
      <div className="mx-auto pt-10 flex min-h-screen max-w-6xl flex-col px-6">
        {/* Header */}
        <header className="flex h-20 items-center justify-between">
          <a href="/home" className="text-2xl font-semibold tracking-tight">
            <Image
              src="/images/brandicon.png"
              alt="Shortify-brand"
              height={100}
              width={250}
            />
          </a>

          <a
            href="/register"
            className="text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            Create account
          </a>
        </header>

        {/* Login */}
        <section className="flex flex-1 items-center justify-center py-12 ">
          <div className="w-full max-w-md">
            <div className="mb-10 text-center">
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
                Welcome back
              </p>

              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Short links,
                <br />
                made simple.
              </h1>

              <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-zinc-500">
                Login to create fast and secure short URLs in under a minute.
                Just enter your details and you're ready to share.
              </p>
            </div>

            <LoginForm />
          </div>
        </section>

        {/* Footer */}
        <footer className="flex h-20 items-center justify-center border-t border-zinc-200 text-xs text-zinc-400">
          © 2026 shortLy. Simple links, simply shared.
        </footer>
      </div>
    </main>
  );
}
