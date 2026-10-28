import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Code2, Layers, Database, Pause, Play } from "lucide-react";
import ScrollReveal from "../components/ScrollReveal";

import {
  FaHtml5,
  FaCss3Alt,
  FaReact,
  FaNodeJs,
} from "react-icons/fa";

import {
  SiJavascript,
  SiNextdotjs,
  SiExpress,
  SiMongodb,
  SiTailwindcss,
} from "react-icons/si";

import "../portfolio.css";

const skills = [
  {
    name: "HTML",
    Icon: FaHtml5,
    color: "#e34f26",
    x: "19%",
    y: "28%",
  },
  {
    name: "CSS",
    Icon: FaCss3Alt,
    color: "#3899ed",
    x: "50%",
    y: "20%",
  },
  {
    name: "JavaScript",
    Icon: SiJavascript,
    color: "#d6b800",
    x: "80%",
    y: "28%",
  },
  {
    name: "React",
    Icon: FaReact,
    color: "#149eca",
    x: "23%",
    y: "50%",
  },
  {
    name: "Next.js",
    Icon: SiNextdotjs,
    x: "77%",
    y: "50%",
  },
  {
    name: "Node.js",
    Icon: FaNodeJs,
    color: "#68a063",
    x: "19%",
    y: "72%",
  },
  {
    name: "Express",
    Icon: SiExpress,
    x: "50%",
    y: "79%",
  },
  {
    name: "MongoDB",
    Icon: SiMongodb,
    color: "#47a248",
    x: "81%",
    y: "72%",
  },
  {
    name: "Tailwind CSS",
    Icon: SiTailwindcss,
    color: "#06b6d4",
    x: "50%",
    y: "6%",
  },
];

const skillNotes = {
  HTML: "Semantic structure and accessible page foundations.",
  CSS: "Responsive layouts, visual details and fluid interactions.",
  JavaScript: "Interactive experiences and application logic.",
  React: "Reusable components and state-driven interfaces.",
  "Next.js": "React applications with routing and rendering tools.",
  "Node.js": "Server-side JavaScript and application services.",
  Express: "API routes and backend request handling.",
  MongoDB: "Document-based data storage for web applications.",
  "Tailwind CSS": "Consistent interfaces with utility-first styling.",
};

export default function About() {
  const [selected, setSelected] = useState("React");
  const [paused, setPaused] = useState(false);
  return (
    <div className="portfolio-page">
      <div className="pf-container">
        <ScrollReveal><section className="pf-about-header">
          <p className="pf-eyebrow">About / Ali Zain</p>

          <h1 className="pf-heading pf-about-title">
            Curious by nature.
            <br />
            <span className="pf-accent">Developer by craft.</span>
          </h1>
        </section></ScrollReveal>

        <section
          className="pf-bio"
          aria-labelledby="biography-title"
        >
          <div>
            <p className="pf-eyebrow">Biography</p>

            <h2
              id="biography-title"
              className="pf-heading pf-bio-label mt-5"
            >
              The person behind
              <br />
              the projects.
            </h2>
          </div>

          <div className="pf-bio-copy">
            <p>
              I’m <strong>Ali Zain</strong>, a full-stack web developer
              based in Faisalabad, Pakistan. I build websites and web
              applications using React, Next.js, Node.js, Express and
              MongoDB.
            </p>

            <p>
              I enjoy working across the application—from shaping a
              responsive interface to connecting APIs and managing
              data. My work includes Blogify, a blogging platform for
              discovering stories and exploring ideas.
            </p>

            <p>
              I care about making interfaces easy to understand and
              useful across screen sizes. I bring that same attention
              to application structure, readable code and the small
              details that make an experience feel complete.
            </p>

            <Link
              to="/projects"
              className="pf-text-link"
              style={{ marginTop: 26 }}
            >
              Explore my projects
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section
          className="pf-skills-section"
          aria-labelledby="skills-title"
        >
          <p className="pf-eyebrow">My toolkit</p>

          <h2
            id="skills-title"
            className="pf-heading pf-section-title mt-5"
          >
            Technologies I work with.
          </h2>

          <p className="pf-skills-note">
            Tools I use across frontend interfaces, backend APIs
            and database functionality.
          </p>

          <div className={`pf-orbit ${paused ? "is-paused" : ""}`}>
            <div className="pf-ring pf-ring-1" aria-hidden="true" />
            <div className="pf-ring pf-ring-2" aria-hidden="true" />
            <div className="pf-ring pf-ring-3" aria-hidden="true" />

            <div className="pf-orbit-center" aria-hidden="true">
              AZ.
            </div>

            {skills.map(({ name, Icon, color, x, y }, index) => (
              <button
                type="button"
                onClick={() => setSelected(name)}
                aria-pressed={selected === name}
                key={name}
                className="pf-skill"
                style={{
                  "--x": x,
                  "--y": y,
                  "--delay": `${index * -0.7}s`,
                }}
              >
                <Icon
                  aria-hidden="true"
                  style={{ color: color || "currentColor" }}
                />
                <span>{name}</span>
              </button>
            ))}
          </div>
          <div className="skill-detail" aria-live="polite"><strong>{selected}</strong><p>{skillNotes[selected]}</p></div>
          <button type="button" className="motion-toggle" onClick={() => setPaused(!paused)} aria-pressed={paused}>
            {paused ? <Play size={14}/> : <Pause size={14}/>} {paused ? "Resume animation" : "Pause animation"}
          </button>
        </section>

        <ScrollReveal><section className="approach-grid" aria-label="My development approach">
          {[[Code2, "Interface", "Clear, responsive layouts with the details in the right places."], [Layers, "Application", "Reusable components and connected flows that work together."], [Database, "Foundation", "APIs and data structures that support the experience."]].map(([Icon, title, copy]) => (
            <article key={title}><Icon size={23} aria-hidden="true"/><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </section></ScrollReveal>

        <section className="pf-about-cta">
          <h2 className="pf-heading">
            Your idea could
            <br />
            be next.
          </h2>

          <Link to="/contact" className="pf-button">
            Let’s talk
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </div>
  );
}
