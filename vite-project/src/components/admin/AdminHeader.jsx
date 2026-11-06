import {
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineSun,
  HiOutlineMoon,
} from "react-icons/hi2";
import { useTheme } from "../../context/ThemeContext";
import { Link, useLocation } from "react-router-dom";

export default function AdminHeader({ menuOpen, onMenuToggle }) {
  const { darkMode, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const page = pathname.split("/")[2] || "Overview";

  const MenuIcon = menuOpen ? HiOutlineXMark : HiOutlineBars3;
  const ThemeIcon = darkMode ? HiOutlineSun : HiOutlineMoon;

  const buttonClass =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--panel-bg)]/60 text-[var(--text)] transition-colors hover:bg-[var(--panel-bg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";

  return (
    <header className="admin-topbar sticky top-0 z-50 flex h-16 items-center justify-between gap-4 border-b border-(--line) bg-(--page-bg)/75 px-4 backdrop-blur-xl sm:px-6 lg:ml-64 lg:px-10">
      <div className="flex min-w-0 items-center gap-3">
        <button
          id="admin-menu-toggle"
          type="button"
          onClick={onMenuToggle}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="admin-sidebar"
          className={`${buttonClass} lg:hidden`}
        >
          <MenuIcon size={23} aria-hidden="true" />
        </button>

        <span className="truncate text-sm font-semibold tracking-tight text-(--text)">
          <span className="admin-breadcrumb">
            Workspace <span>/</span>
          </span>{" "}
          <span className="capitalize">{page}</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/" className="admin-site-link">
          View website <span aria-hidden="true">↗</span>
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          className={buttonClass}
        >
          <ThemeIcon size={20} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
