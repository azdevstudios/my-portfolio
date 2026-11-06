import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminHeader from "../components/admin/AdminHeader";
import AdminSidebar from "../components/admin/AdminSidebar";
import "../portfolio.css";
import "../admin.css";
import usePortfolio from "../hooks/usePortfolio";

export default function AdminLayout() {
  const { profile } = usePortfolio();
  const [menuOpen, setMenuOpen] = useState(false);
  const content = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const titles = {
      "/admin": "Overview",
      "/admin/projects": "Projects",
      "/admin/profile": "Profile",
      "/admin/settings": "Settings",
    };

    document.title = `${profile.name} | Admin — ${titles[pathname] || "Dashboard"}`;
  }, [pathname, profile.name]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const pageContent = content.current;
    const previousInert = pageContent?.inert;
    document.body.style.overflow = "hidden";
    if (pageContent) pageContent.inert = true;
    const sidebar = document.getElementById("admin-sidebar");
    const menuButton = document.getElementById("admin-menu-toggle");
    sidebar?.querySelector("a")?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") setMenuOpen(false);
      if (event.key === "Tab") {
        const elements = [
          menuButton,
          ...sidebar.querySelectorAll("a, button:not(:disabled)"),
        ].filter(Boolean);
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }

    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    function handleScreenChange(event) {
      if (event.matches) setMenuOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    desktopQuery.addEventListener("change", handleScreenChange);

    return () => {
      document.body.style.overflow = previousOverflow;
      if (pageContent) pageContent.inert = previousInert;
      previousFocus?.focus();
      window.removeEventListener("keydown", handleKeyDown);
      desktopQuery.removeEventListener("change", handleScreenChange);
    };
  }, [menuOpen]);

  return (
    <div className="portfolio-page admin-workspace min-h-screen">
      <AdminHeader
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((current) => !current)}
      />

      <AdminSidebar menuOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <div
        ref={content}
        className="admin-content min-w-0 p-4 sm:p-6 lg:ml-64 lg:p-10"
      >
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
