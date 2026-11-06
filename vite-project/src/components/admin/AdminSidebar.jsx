import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import usePortfolio from "../../hooks/usePortfolio";
import {
  HiOutlineSquares2X2,
  HiOutlineFolder,
  HiOutlineUserCircle,
  HiOutlineCog6Tooth,
  HiOutlineArrowUpRight,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";

const navigation = [
  { label: "Overview", path: "/admin", icon: HiOutlineSquares2X2 },
  { label: "Projects", path: "/admin/projects", icon: HiOutlineFolder },
  { label: "Profile", path: "/admin/profile", icon: HiOutlineUserCircle },
  { label: "Settings", path: "/admin/settings", icon: HiOutlineCog6Tooth },
];

export default function AdminSidebar({ menuOpen, onClose }) {
  const { profile } = usePortfolio();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setError("");

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      onClose();
      navigate("/admin/login", { replace: true });
    } catch {
      setError("Unable to sign out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        tabIndex={-1}
        aria-hidden="true"
        className={`fixed inset-x-0 bottom-0 top-16 z-30 bg-black/20 backdrop-blur-sm transition-[opacity,visibility] duration-300 motion-reduce:transition-none lg:hidden ${
          menuOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="admin-sidebar"
        aria-label="Admin sidebar"
        className={`admin-sidebar fixed left-3 top-20 z-40 flex max-h-[calc(100dvh-6rem)] w-56 max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-2xl border border-(--line) bg-(--panel-bg)/65 text-(--text) shadow-xl shadow-black/10 backdrop-blur-2xl transition-[transform,opacity,visibility] duration-300 ease-in-out motion-reduce:transition-none lg:visible lg:bottom-0 lg:left-0 lg:top-0 lg:max-h-none lg:w-64 lg:translate-x-0 lg:rounded-none lg:border-0 lg:border-r lg:opacity-100 ${
          menuOpen
            ? "visible translate-x-0 opacity-100"
            : "invisible -translate-x-[calc(100%+1rem)] opacity-0"
        }`}
      >
        <Link
          to="/admin"
          onClick={onClose}
          aria-label="Admin overview"
          className="flex h-16 shrink-0 items-center gap-3 border-b border-(--line) px-5"
        >
          <span className="text-2xl font-semibold tracking-tighter">
            AZ<span className="text-(--accent)">.</span>
          </span>

          <span className="text-xs text-(--muted)">Admin panel</span>
        </Link>

        <nav
          aria-label="Admin navigation"
          className="min-h-0 space-y-1 overflow-y-auto p-3 lg:flex-1"
        >
          <p className="pf-eyebrow mx-3 mb-4 mt-2">Workspace</p>

          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/admin"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "border-(--line) bg-(--accent)/10 text-(--accent)"
                    : "border-transparent text-(--muted) hover:bg-(--page-bg)/70 hover:text-(--text)"
                }`
              }
            >
              <Icon size={20} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="shrink-0 space-y-1 border-t border-(--line) p-3">
          <div className="admin-account">
            <span>AZ</span>
            <div>
              <strong>{profile.name}</strong>
              <small>Portfolio administrator</small>
            </div>
          </div>
          <Link
            to="/"
            onClick={onClose}
            className="flex min-h-11 items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-(--muted) transition-colors hover:bg-(--page-bg)/70 hover:text-(--accent)"
          >
            View portfolio
            <HiOutlineArrowUpRight size={18} aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex min-h-11 w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-(--muted) transition-colors hover:bg-red-500/10 hover:text-red-600 disabled:cursor-wait disabled:opacity-60 dark:hover:text-red-400"
          >
            <HiOutlineArrowRightOnRectangle size={20} aria-hidden="true" />
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>

          {error && (
            <p
              role="alert"
              className="px-3 pt-2 text-xs leading-5 text-red-600 dark:text-red-400"
            >
              {error}
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
