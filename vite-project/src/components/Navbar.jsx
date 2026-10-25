import { useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

import { useTheme } from "../context/ThemeContext";
import { profile } from "../data/profile";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Projects", path: "/projects" },
  { name: "Contact", path: "/contact" },
];

function SocialLinks() {
  const socials = [
    {
      name: "GitHub",
      url: profile.github,
      icon: (
        <FaGithub
          size={20}
          className="text-[#181717] dark:text-[#f5f5f2]"
          aria-hidden="true"
        />
      ),
    },
    {
      name: "LinkedIn",
      url: profile.linkedin,
      icon: (
        <FaLinkedin
          size={20}
          color="#0A66C2"
          aria-hidden="true"
        />
      ),
    },
    {
      name: "Instagram",
      url: profile.instagram,
      icon: (
        <span className="flex h-5.25 w-5.25 items-center justify-center rounded-md bg-[radial-gradient(circle_at_30%_100%,#feda75_0%,#fa7e1e_30%,#d62976_55%,#962fbf_75%,#4f5bd5_100%)]">
          <FaInstagram
            size={16}
            color="white"
            aria-hidden="true"
          />
        </span>
      ),
    },
  ];

  return (
    <div className="flex items-center" aria-label="Social profiles">
      {socials.map(({ name, url, icon }) =>
        url ? (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} — opens in a new tab`}
            title={name}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:hover:bg-white/10"
          >
            {icon}
          </a>
        ) : (
          <span
            key={name}
            role="img"
            aria-label={`${name} profile link not added`}
            title={`${name} — profile link not added`}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center"
          >
            {icon}
          </span>
        )
      )}
    </div>
  );
}

export default function Navbar() {
  const { darkMode, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);

  const controlClass =
    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:text-neutral-300 dark:hover:bg-white/10";

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleEscape(event) {
    if (event.key === "Escape" && menuOpen) {
      closeMenu();
      menuButtonRef.current?.focus();
    }
  }

  return (
    <header
      onKeyDown={handleEscape}
      className="sticky top-0 z-50 border-b border-black/5 bg-[#f5f5f2]/65 shadow-[0_4px_24px_rgba(0,0,0,0.03)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-[#1b1b1b]/65 dark:shadow-[0_4px_24px_rgba(0,0,0,0.12)]"
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-20 max-w-307 items-center justify-between gap-2 px-5 sm:px-6"
      >
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          aria-label="Ali Zain — Home"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          className="shrink-0 rounded-lg text-[29px] font-semibold leading-none tracking-[-0.09em] text-[#18181b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 dark:text-[#f5f5f2]"
        >
          AZ
          <span className="text-blue-600 dark:text-[#75a7ff]">
            .
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-7 md:flex lg:gap-9">
          {navLinks.map(({ name, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={closeMenu}
              className={({ isActive }) =>
                `relative rounded py-2 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 ${
                  isActive
                    ? "text-[#18181b] after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-blue-600 dark:text-[#f5f5f2] dark:after:bg-[#75a7ff]"
                    : "text-neutral-600 hover:text-neutral-950 dark:text-[#aaaab2] dark:hover:text-white"
                }`
              }
            >
              {name}
            </NavLink>
          ))}
        </div>

        {/* Social icons and controls */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <SocialLinks />

          <span
            aria-hidden="true"
            className="mx-1 hidden h-5 w-px bg-black/10 sm:block dark:bg-white/15"
          />

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            title={darkMode ? "Light mode" : "Dark mode"}
            className={controlClass}
          >
            {darkMode ? (
              <Sun size={18} aria-hidden="true" />
            ) : (
              <Moon size={18} aria-hidden="true" />
            )}
          </button>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className={`${controlClass} md:hidden`}
          >
            {menuOpen ? (
              <X size={21} aria-hidden="true" />
            ) : (
              <Menu size={21} aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        hidden={!menuOpen}
        className="border-t border-black/5 bg-white/20 px-5 py-4 md:hidden dark:border-white/10 dark:bg-black/10"
      >
        <div className="flex flex-col gap-1">
          {navLinks.map(({ name, path }, index) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-blue-500 ${
                  isActive
                    ? "bg-blue-600/10 text-blue-700 dark:bg-[#75a7ff]/10 dark:text-[#75a7ff]"
                    : "text-neutral-700 hover:bg-black/5 dark:text-neutral-200 dark:hover:bg-white/5"
                }`
              }
            >
              {name}

              <span
                aria-hidden="true"
                className="text-[10px] opacity-50"
              >
                0{index + 1}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}