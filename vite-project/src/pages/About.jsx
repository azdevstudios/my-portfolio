import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

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

export default function About() {
  return (
    <div className="portfolio-page">
      <div className="pf-container">
        <section className="pf-about-header">
          <p className="pf-eyebrow">About / Ali Zain</p>

          <h1 className="pf-heading pf-about-title">
            Curious by nature.
            <br />
            <span className="pf-accent">Developer by craft.</span>
          </h1>
        </section>

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
              data. My projects include student record management and
              blog management applications.
            </p>

            <p>
              I care about making interfaces easy to understand and
              useful across screen sizes. I’m continuing to improve
              how I approach design, application structure and the
              details that make a website easier to use.
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

          <div className="pf-orbit">
            <div className="pf-ring pf-ring-1" aria-hidden="true" />
            <div className="pf-ring pf-ring-2" aria-hidden="true" />
            <div className="pf-ring pf-ring-3" aria-hidden="true" />

            <div className="pf-orbit-center" aria-hidden="true">
              AZ.
            </div>

            {skills.map(({ name, Icon, color, x, y }) => (
              <div
                key={name}
                className="pf-skill"
                style={{
                  "--x": x,
                  "--y": y,
                }}
              >
                <Icon
                  aria-hidden="true"
                  style={{ color: color || "currentColor" }}
                />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </section>

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