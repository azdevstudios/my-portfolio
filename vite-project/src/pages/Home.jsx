import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { FaReact, FaNodeJs } from "react-icons/fa";
import { SiNextdotjs, SiMongodb } from "react-icons/si";

import SelectedWork from "../components/SelectedWork";
import ContactCta from "../components/ContactCta";

import "../portfolio.css";

const toolkit = [
  { name: "React", Icon: FaReact, color: "#149ECA" },
  { name: "Next.js", Icon: SiNextdotjs },
  { name: "Node.js", Icon: FaNodeJs, color: "#68A063" },
  { name: "MongoDB", Icon: SiMongodb, color: "#47A248" },
];

function DeveloperPanel() {
  return (
    <aside
      className="dev-workspace"
      aria-label="Ali Zain — developer profile and toolkit"
    >
      {/* Window header */}
      <div className="dev-workspace-bar">
        <div className="dev-window-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <span>developer.js</span>

        <span className="dev-file-type" aria-hidden="true">
          JS
        </span>
      </div>

      {/* Code-style introduction */}
      <div className="dev-code" aria-hidden="true">
        <div>
          <span className="dev-keyword">const</span>
          {" developer = {"}
        </div>

        <div className="dev-code-indent">
          name: <span className="dev-string">"Ali Zain"</span>,
        </div>

        <div className="dev-code-indent">
          role:{" "}
          <span className="dev-string">"Full-Stack Developer"</span>,
        </div>

        <div className="dev-code-indent">
          focus:{" "}
          <span className="dev-string">"Ideas into applications"</span>
        </div>

        <div>{"};"}</div>
      </div>

      <p className="sr-only">
        Ali Zain, Full-Stack Developer. Building ideas into applications.
      </p>

      {/* Technology icons */}
      <div className="dev-toolkit">
        <p className="dev-toolkit-label">MY TOOLKIT</p>

        <ul className="dev-tech-grid" aria-label="Core technologies">
          {toolkit.map(({ name, Icon, color }) => (
            <li
              key={name}
              className="flex min-h-21.25 flex-col items-center justify-center gap-2.5 rounded-[10px] border border-(--line) bg-(--page-bg)"
            >
              <Icon
                size={25}
                style={{ color: color || "currentColor" }}
                aria-hidden="true"
              />

              <span className="text-[10px] text-(--muted)">
                {name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="dev-workspace-bottom">
        <span>FRONTEND + BACKEND</span>
        <span aria-hidden="true">{"</>"}</span>
      </div>
    </aside>
  );
}

export default function Home() {
  return (
    <div className="portfolio-page">
      {/* Hero */}
      <section
        className="pf-container pf-hero"
        aria-labelledby="home-heading"
      >
        <div className="min-w-0">
          <p className="pf-eyebrow">
            Ali Zain / Full-Stack Developer
          </p>

          <h1 id="home-heading" className="pf-heading pf-hero-title">
            Thoughtful design.
            <br />
            <span className="pf-accent">Functional code.</span>
          </h1>

          <p className="pf-description">
            I build responsive websites and full-stack applications
            with React, Next.js, Node.js and MongoDB. From the
            interface to the API, I focus on making each part
            work together.
          </p>

          <div className="pf-actions">
            <Link to="/projects" className="pf-button">
              View my work
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>

            <Link to="/contact" className="pf-text-link">
              Let’s talk
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>

          <p className="pf-location">
            Based in Faisalabad, Pakistan
          </p>
        </div>

        <DeveloperPanel />
      </section>

     
        </div>
    

  

     
      
  
  );
}