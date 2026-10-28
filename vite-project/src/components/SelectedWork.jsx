import { Link } from "react-router-dom";
import { ArrowUpRight, Layers3, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { projects } from "../data/projects";
import ScrollReveal from "./ScrollReveal";
import "../portfolio.css";

export function ProjectGrid({ detailed = false }) {
  return <div className={`project-grid ${projects.length === 1 ? "project-grid-single" : ""}`}>
    {projects.map((project, index) => <ScrollReveal key={project.id} delay={index * 0.08}>
      <article className="project-card">
        <div className="project-visual">
          <div className="project-window-bar" aria-hidden="true"><span/><span/><span/><p>{project.title.toLowerCase()} · web experience</p><ExternalLink size={13}/></div>
          {project.image ? <img src={project.image} alt={`${project.title} — blogging platform interface`} loading="lazy" width={1280} height={800}/> : <div className="project-placeholder"><Layers3 size={40}/><span>{project.title}</span></div>}
          <span className="project-index">PROJECT {project.number}</span>
        </div>
        <div className="project-content">
          <p className="pf-eyebrow">{project.category}</p><h2 className="pf-heading">{project.title}</h2>
          <p className="project-description">{project.description}</p>
          {detailed && project.features?.length > 0 && <div className="project-features"><h3>Inside the experience</h3><ul>{project.features.map(feature => <li key={feature}>{feature}</li>)}</ul></div>}
          {project.technologies.length > 0 && <ul className="project-tags" aria-label="Technologies">{project.technologies.map(tech => <li key={tech}>{tech}</li>)}</ul>}
          <div className="project-actions">
            {project.demo && <a className="pf-button" href={project.demo} target="_blank" rel="noopener noreferrer" aria-label={`Explore ${project.title} (opens in a new tab)`}>Explore live site <ArrowUpRight size={17}/></a>}
            {project.source && <a className="pf-text-link" href={project.source} target="_blank" rel="noopener noreferrer"><FaGithub size={17}/> Source code</a>}
          </div>
        </div>
      </article>
    </ScrollReveal>)}
  </div>;
}
export default function SelectedWork() {
  return <section className="portfolio-page"><div className="pf-container"><h2 className="pf-heading pf-section-title">Selected work.</h2><ProjectGrid/><Link to="/projects" className="pf-text-link">All projects <ArrowUpRight size={17}/></Link></div></section>;
}
