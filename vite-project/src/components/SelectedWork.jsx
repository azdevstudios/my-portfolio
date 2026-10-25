import { Link } from "react-router-dom";
import { ArrowUpRight, Layers3 } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { projects } from "../data/projects";
import "../portfolio.css";
export function ProjectGrid({ detailed = false }) {
  const newLocal = "mt-3 text-xs text-(--muted)";
  return (
    <div className="grid gap-7 md:grid-cols-2">
      {projects.map((project) => (
        <article
          key={project.id}
          className="group overflow-hidden rounded-2xl border border-(--line) bg-(--panel-bg)"
        >
          {/* Project preview */}
          <div className="relative aspect-16/10 overflow-hidden border-b border-(--line) bg-(--page-bg)">
            {project.image ? (
              <img
                src={project.image}
                alt={`${project.title} screenshot`}
                loading="lazy"
                width={1280}
                height={800}
                className="h-full w-full object-contain transition-transform duration-500 motion-safe:group-hover:scale-[1.025]"
              />
            ) : (
              <div className="flex h-full flex-col justify-between p-6 sm:p-8">
                <div className="flex items-center justify-between text-(--muted)">
                  <span className="text-xs tracking-[0.15em]">
                    {project.number} / PROJECT
                  </span>

                  <Layers3 size={22} aria-hidden="true" />
                </div>

                <div>
                  <p className="pf-heading text-3xl sm:text-4xl">
                    {project.title}
                  </p>

                  <p className={newLocal}>
                    Project overview · Screenshot not added
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Project details */}
          <div className="p-6 sm:p-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-(--accent)">
              {project.category}
            </p>

            <h3 className="pf-heading mt-4 text-3xl">
              {project.title}
            </h3>

            <p className="mt-4 text-sm leading-7 text-(--muted)">
              {project.description}
            </p>

            {detailed && project.features?.length > 0 && (
              <div className="mt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider">
                  Key features
                </h4>

                <ul className="mt-3 space-y-2">
                  {project.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-3 text-sm leading-6 text-(--muted)"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-(--accent)"
                      />

                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <ul
              aria-label="Technologies used"
              className="mt-6 flex flex-wrap gap-2"
            >
              {project.technologies.map((technology) => (
                <li
                  key={technology}
                  className="rounded-md border border-(--line) px-3 py-1.5 text-[11px] text-(--muted)"
                >
                  {technology}
                </li>
              ))}
            </ul>

            {(project.demo || project.source) && (
              <div className="mt-7 flex flex-wrap gap-5 border-t border-(--line) pt-5">
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${project.title} live demo`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-(--accent) hover:underline"
                  >
                    Live demo
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                )}

                {project.source && (
                  <a
                    href={project.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.title} source code`}
                    className="inline-flex items-center gap-2 text-sm font-medium hover:text-(--accent)"
                  >
                    <FaGithub size={16} aria-hidden="true" />
                    Source code
                  </a>
                )}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

export default function SelectedWork() {
  return (
    <section
      id="selected-work"
      className="portfolio-page border-y border-(--line) py-16 sm:py-20"
    >
      <div className="pf-container">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="pf-eyebrow">Selected projects</p>

            <h2 className="pf-heading mt-5 text-4xl sm:text-5xl">
              Ideas into applications<span className="pf-accent">.</span>
            </h2>
          </div>

          <Link to="/projects" className="pf-text-link">
            All projects
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>

        <ProjectGrid />
      </div>
    </section>
  );
}