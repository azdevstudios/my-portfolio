import { Link, NavLink } from "react-router-dom";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { profile } from "../data/profile";
const socials = [{ name: "GitHub", href: profile.github, Icon: FaGithub },{ name: "LinkedIn", href: profile.linkedin, Icon: FaLinkedin },{ name: "Instagram", href: profile.instagram, Icon: FaInstagram }];
export default function Footer() {
  return <footer className="site-footer"><div className="footer-inner">
    <Link to="/" className="brand" aria-label="Ali Zain home">AZ<span>.</span></Link>
    <p className="footer-credit">© {new Date().getFullYear()} Ali Zain.<span> Crafted with care.</span></p>
    <nav className="footer-links" aria-label="Footer navigation"><NavLink to="/about">About</NavLink><NavLink to="/projects">Work</NavLink><NavLink to="/contact">Contact</NavLink></nav>
    <div className="footer-socials" aria-label="Social profiles">{socials.filter(({ href }) => href).map(({ name, href, Icon }) => <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="icon-button" aria-label={`${name} (opens in a new tab)`}><Icon size={16} aria-hidden="true" /></a>)}</div>
  </div></footer>;
}
