import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ProjectGrid } from "../components/SelectedWork";
import "../portfolio.css";

export default function Projects() {
  return (
    <div className="portfolio-page min-h-screen">
      <div className="pf-container">
        <section className="pf-about-header">
          <p className="pf-eyebrow">Portfolio / Projects</p>

          <h1 className="pf-heading pf-about-title">
            Built with purpose.
            <br />
            <span className="pf-accent">Made to work.</span>
          </h1>

          <p className="pf-description">
            A selection of my web applications, with the features
            they support and the technologies behind them.
          </p>
        </section>

        <section
          aria-labelledby="projects-heading"
          className="border-t border-(--line) pb-20 pt-10"
        >
          <h2 id="projects-heading" className="sr-only">
            Project collection
          </h2>

          <ProjectGrid detailed />
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