import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineSun,
  HiOutlineMoon,
} from "react-icons/hi2";
import { useTheme } from "../../context/ThemeContext";
import "../../portfolio.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ThemeIcon = darkMode ? HiOutlineSun : HiOutlineMoon;
  const PasswordIcon = showPassword ? HiOutlineEyeSlash : HiOutlineEye;

  const inputClass =
    "h-12 w-full rounded-xl border border-(--line) bg-(--page-bg)/60 pl-11 pr-4 text-sm text-(--text) transition-colors placeholder:text-(--muted)/70 focus:border-(--accent) focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) disabled:opacity-60";

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.message || "Unable to sign in. Please try again.");
        return;
      }

      if (!data) {
        setError("Login service is unavailable. Please try again.");
        return;
      }

      setPassword("");
      navigate("/admin", { replace: true });
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="portfolio-page relative isolate flex min-h-dvh flex-col overflow-hidden">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-(--accent)/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-40 -z-10 h-96 w-96 rounded-full bg-(--accent)/5 blur-3xl"
      />

      <header className="flex items-center justify-between gap-4 px-5 py-5 sm:px-10">
        <Link
          to="/"
          aria-label="Ali Zain portfolio home"
          className="text-2xl font-semibold tracking-tighter text-(--text)"
        >
          AZ<span className="text-(--accent)">.</span>
        </Link>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-(--line) bg-(--panel-bg)/60 text-(--muted) backdrop-blur-xl transition-colors hover:text-(--accent)"
        >
          <ThemeIcon size={19} aria-hidden="true" />
        </button>
      </header>

      <div className="flex flex-1 items-center justify-center px-5 py-8 sm:py-12">
        <div className="grid w-full max-w-5xl items-center gap-16 lg:grid-cols-2">
          {/* Desktop introduction */}
          <div className="hidden lg:block">
            <p className="pf-eyebrow">Your portfolio workspace</p>

            <h1 className="pf-heading mt-7 text-6xl leading-[1.08] text-(--text)">
              Good work.
              <br />
              <span className="text-(--accent)">Well managed.</span>
            </h1>

            <p className="mt-6 max-w-sm text-base leading-8 text-(--muted)">
              A dedicated space to keep your projects, profile and portfolio up
              to date.
            </p>

            <div className="mt-10 flex items-center gap-4">
              <span className="h-px w-10 bg-(--accent)" />
              <span className="text-xs tracking-wide text-(--muted)">
                Ali Zain · Full-stack developer
              </span>
            </div>
          </div>

          {/* Login card */}
          <section
            aria-labelledby="login-title"
            className="mx-auto w-full max-w-md rounded-3xl border border-(--line) bg-(--panel-bg)/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-2xl sm:p-9"
          >
            <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl border border-(--accent)/15 bg-(--accent)/10 text-(--accent)">
              <HiOutlineLockClosed size={23} aria-hidden="true" />
            </div>

            <p className="pf-eyebrow">Admin access</p>

            <h2
              id="login-title"
              className="pf-heading mt-3 text-3xl text-(--text) sm:text-4xl"
            >
              Welcome back.
            </h2>

            <p className="mt-3 text-sm leading-6 text-(--muted)">
              Enter your details to access your dashboard.
            </p>

            <form
              onSubmit={handleSubmit}
              aria-busy={loading}
              className="mt-8 space-y-5"
            >
              <div>
                <label
                  htmlFor="admin-email"
                  className="text-sm font-medium text-(--text)"
                >
                  Email address
                </label>

                <div className="relative mt-2">
                  <HiOutlineEnvelope
                    size={19}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-(--muted)"
                  />

                  <input
                    id="admin-email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    placeholder="you@example.com"
                    required
                    maxLength={254}
                    disabled={loading}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="text-sm font-medium text-(--text)"
                >
                  Password
                </label>

                <div className="relative mt-2">
                  <HiOutlineLockClosed
                    size={19}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-(--muted)"
                  />

                  <input
                    id="admin-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                    maxLength={1024}
                    disabled={loading}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-controls="admin-password"
                    className="absolute right-0 top-0 flex h-12 w-11 items-center justify-center rounded-xl text-(--muted) transition-colors hover:text-(--accent)"
                  >
                    <PasswordIcon size={19} aria-hidden="true" />
                  </button>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-700 dark:text-red-300"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="pf-button w-full disabled:cursor-wait disabled:opacity-60"
              >
                {loading ? "Signing in…" : "Sign in"}
                {!loading && (
                  <HiOutlineArrowRight size={18} aria-hidden="true" />
                )}
              </button>
            </form>

            <div className="mt-7 border-t border-(--line) pt-5">
              <Link
                to="/"
                className="inline-flex min-h-10 items-center gap-2 text-sm text-(--muted) transition-colors hover:text-(--accent)"
              >
                <HiOutlineArrowLeft size={17} aria-hidden="true" />
                Back to portfolio
              </Link>
            </div>
          </section>
        </div>
      </div>

      <footer className="px-5 py-6 text-center text-xs text-(--muted)">
        © {new Date().getFullYear()} Ali Zain
      </footer>
    </div>
  );
}
