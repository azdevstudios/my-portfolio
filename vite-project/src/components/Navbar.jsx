import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Sun, Moon, Menu, X, ArrowUpRight } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { FaGithub as Github, FaLinkedin as Linkedin, FaInstagram as Instagram } from "react-icons/fa";
import { profile } from "../data/profile";

const links = [{name:"Home",path:"/"},{name:"About",path:"/about"},{name:"Projects",path:"/projects"},{name:"Contact",path:"/contact"}];
export default function Navbar() {
  const { darkMode, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const trigger = useRef(null);
  const drawer = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    const background = [...document.querySelectorAll("main, .glass-header, footer, .whatsapp-widget")];
    const inertState = background.map(element => element.inert);
    background.forEach(element => { element.inert = true; });
    document.body.style.overflow = "hidden";
    drawer.current?.querySelector("button")?.focus();
    function keyboard(event) {
      if (event.key === "Escape") {
        setOpen(false);
        requestAnimationFrame(() => trigger.current?.focus());
      }
      if (event.key === "Tab") {
        const elements = drawer.current?.querySelectorAll("a, button");
        const first = elements?.[0], last = elements?.[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }
    function resize() { if (window.innerWidth >= 768) setOpen(false); }
    document.addEventListener("keydown", keyboard);
    window.addEventListener("resize", resize);
    return () => {
      document.body.style.overflow = previous;
      background.forEach((element, index) => { element.inert = inertState[index]; });
      document.removeEventListener("keydown", keyboard);
      window.removeEventListener("resize", resize);
    };
  }, [open]);
  function close() {
    setOpen(false);
    requestAnimationFrame(() => trigger.current?.focus());
  }
  return <>
    <header className="glass-header">
      <nav className="glass-nav" aria-label="Main navigation">
        <Link to="/" className="brand" aria-label="Ali Zain home">az<span>.</span></Link>
        <div className="desktop-links">{links.map(link => <NavLink key={link.path} to={link.path} end={link.path === "/"}>{link.name}</NavLink>)}</div>
        <div className="nav-controls">
          <button className="icon-button" onClick={toggleTheme} aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}>{darkMode ? <Sun size={18}/> : <Moon size={18}/>}</button>
          <Link to="/contact" className="nav-contact">Let’s talk <ArrowUpRight size={14}/></Link>
          <button ref={trigger} className="icon-button mobile-toggle" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-navigation" aria-label="Open navigation"><Menu size={22}/></button>
        </div>
      </nav>
    </header>
    {open && <div className="drawer-layer">
      <div className="drawer-backdrop" onClick={close} aria-hidden="true"/>
      <aside ref={drawer} id="mobile-navigation" className="glass-drawer" role="dialog" aria-modal="true" aria-label="Navigation">
        <div className="drawer-top"><span className="brand">az<span>.</span></span><button className="icon-button" onClick={close} aria-label="Close navigation"><X size={23}/></button></div>
        <p className="drawer-caption">A little about me. A look at my work.</p>
        <nav aria-label="Mobile navigation">{links.map((link,index) => <Link onClick={close} key={link.path} to={link.path} aria-current={pathname === link.path ? "page" : undefined}><span><small>0{index + 1}</small>{link.name}</span><ArrowUpRight size={22}/></Link>)}</nav>
        <div className="drawer-bottom"><p>Built with care.<br/>Based in Faisalabad, Pakistan.</p><div className="drawer-socials">{[["GitHub",profile.github,Github],["LinkedIn",profile.linkedin,Linkedin],["Instagram",profile.instagram,Instagram]].filter(([,url])=>url).map(([name,url,Icon])=><a key={name} href={url} target="_blank" rel="noreferrer" className="icon-button" aria-label={name}><Icon size={19}/></a>)}</div></div>
      </aside>
    </div>}
  </>;
}
