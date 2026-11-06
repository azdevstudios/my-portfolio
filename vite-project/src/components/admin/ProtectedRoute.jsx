import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import "../../portfolio.css";

export default function ProtectedRoute() {
  const { pathname } = useLocation();
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function checkSession() {
      setStatus("loading");

      try {
        const response = await fetch("/api/auth/session", {
          credentials: "same-origin",
          cache: "no-store",
          signal: controller.signal,
        });

        if (!active) return;

        if (response.status === 401) {
          setStatus("unauthenticated");
          return;
        }

        if (!response.ok) {
          throw new Error("Session check failed.");
        }

        const data = await response.json();

        if (active) {
          setStatus(data.authenticated ? "authenticated" : "unauthenticated");
        }
      } catch (error) {
        if (active && error.name !== "AbortError") {
          setStatus("error");
        }
      }
    }

    checkSession();

    return () => {
      active = false;
      controller.abort();
    };
  }, [pathname, attempt]);

  if (status === "loading") {
    return (
      <div
        role="status"
        className="portfolio-page flex min-h-dvh items-center justify-center px-4"
      >
        <p className="text-sm text-(--muted)">Checking your session…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="portfolio-page flex min-h-dvh items-center justify-center px-4">
        <div className="text-center">
          <p role="alert" className="text-sm text-(--muted)">
            Unable to verify your session.
          </p>

          <button
            type="button"
            onClick={() => setAttempt((current) => current + 1)}
            className="pf-button mt-5"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
