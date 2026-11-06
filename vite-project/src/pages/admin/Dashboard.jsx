import ProjectImage from "../../components/ProjectImage";
import { Link } from "react-router-dom";
import {
  HiOutlineFolder,
  HiOutlineArrowUpRight,
  HiOutlinePhoto,
  HiOutlineLink,
} from "react-icons/hi2";
import usePortfolioProjects from "../../hooks/usePortfolioProjects";
import usePortfolio from "../../hooks/usePortfolio";

export default function Dashboard() {
  const { profile } = usePortfolio();
  const { projects, loading, error, reload } = usePortfolioProjects();
  const stats = [
    {
      label: "Portfolio projects",
      value: projects.length,
      note: "Saved in your collection",
      icon: HiOutlineFolder,
    },
    {
      label: "Live previews",
      value: projects.filter((project) =>
        /^https?:\/\//i.test(project.demo || ""),
      ).length,
      note: "Projects with a website link",
      icon: HiOutlineLink,
    },
    {
      label: "Project images",
      value: projects.filter((project) => project.image).length,
      note: "Projects with a cover image",
      icon: HiOutlinePhoto,
    },
  ];

  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="pf-eyebrow">Your workspace</p>
          <h1 className="pf-heading">
            Welcome back, {profile.name.split(" ")[0]}.
          </h1>
          <p>A little upkeep. A portfolio that stays current.</p>
        </div>
        <Link
          to="/admin/projects"
          className="admin-button admin-button-primary"
        >
          Manage projects <HiOutlineArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </header>

      {error ? (
        <div role="alert" className="admin-error">
          <p>{error}</p>
          <button onClick={reload} className="admin-button">
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="admin-stats" aria-label="Portfolio summary">
            {stats.map(({ label, value, note, icon: Icon }) => (
              <section key={label} className="admin-panel admin-stat">
                <div>
                  <span>{label}</span>
                  <Icon size={19} aria-hidden="true" />
                </div>
                <strong>{loading ? "—" : value}</strong>
                <p>{note}</p>
              </section>
            ))}
          </div>
          <section className="admin-panel" aria-labelledby="collection-title">
            <div className="admin-panel-heading">
              <h2 id="collection-title">Your collection</h2>
              <Link to="/admin/projects">View all projects →</Link>
            </div>
            {loading ? (
              <p role="status" className="admin-loading">
                Loading your collection…
              </p>
            ) : projects.length === 0 ? (
              <p className="admin-empty">
                Your saved projects will appear here.
              </p>
            ) : (
              projects.slice(0, 4).map((project) => (
                <div className="admin-project-row" key={project.id}>
                  {project.image && (
                    <ProjectImage src={project.image} alt="" loading="lazy" />
                  )}
                  <div>
                    <strong>{project.title}</strong>
                    <p>{project.category}</p>
                  </div>
                  <Link
                    to="/admin/projects"
                    aria-label={`Manage ${project.title}`}
                  >
                    <HiOutlineArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                </div>
              ))
            )}
          </section>
        </>
      )}
    </>
  );
}
