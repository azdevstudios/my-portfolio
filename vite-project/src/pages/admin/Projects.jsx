import ProjectImage from "../../components/ProjectImage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineFolder,
  HiOutlineArrowUpRight,
  HiOutlineArrowPath,
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
} from "react-icons/hi2";
import usePortfolioProjects from "../../hooks/usePortfolioProjects";
import { apiRequest } from "../../lib/api";
import ProjectForm from "../../components/admin/ProjectForm";
import AdminDialog from "../../components/admin/AdminDialog";

export default function AdminProjects() {
  const { projects, loading, error, reload } = usePortfolioProjects();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [editor, setEditor] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [undo, setUndo] = useState(null);
  const query = search.trim().toLowerCase();
  const filteredProjects = projects.filter((project) =>
    [project.title, project.category, ...(project.technologies || [])].some(
      (value) =>
        String(value || "")
          .toLowerCase()
          .includes(query),
    ),
  );

  function checkSession(error) {
    if (error.status === 401) navigate("/admin/login", { replace: true });
  }
  async function saveProject(values) {
    try {
      const editing = editor.project;
      await apiRequest(
        editing
          ? `/api/projects?id=${encodeURIComponent(editing.id)}`
          : "/api/projects",
        { method: editing ? "PUT" : "POST", body: values },
      );
      setEditor(null);
      setSearch("");
      setMessage(
        editing
          ? "Project updated. Your changes are saved."
          : "Project added to your portfolio.",
      );
      setActionError("");
      setUndo(null);
      reload();
    } catch (error) {
      checkSession(error);
      throw error;
    }
  }
  async function removeProject() {
    if (busy) return;
    setBusy(true);
    setActionError("");
    try {
      await apiRequest(`/api/projects?id=${encodeURIComponent(removing.id)}`, {
        method: "DELETE",
        body: {},
      });
      setUndo(removing);
      setMessage(`“${removing.title}” removed from your portfolio.`);
      setRemoving(null);
      reload();
    } catch (error) {
      checkSession(error);
      setActionError(error.message);
    } finally {
      setBusy(false);
    }
  }
  async function restoreProject() {
    setBusy(true);
    setActionError("");
    try {
      await apiRequest(`/api/projects?id=${encodeURIComponent(undo.id)}`, {
        method: "PATCH",
        body: {},
      });
      setUndo(null);
      setMessage("Project restored.");
      reload();
    } catch (error) {
      checkSession(error);
      setActionError(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="pf-eyebrow">Portfolio / Projects</p>
          <h1 className="pf-heading">Your work, in one place.</h1>
          <p>A curated collection of the things you build.</p>
        </div>
        <div className="admin-heading-actions">
          <button
            type="button"
            onClick={reload}
            disabled={loading}
            className="admin-button"
            aria-label="Refresh projects"
          >
            <HiOutlineArrowPath size={17} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => {
              setEditor({ project: null });
              setActionError("");
            }}
            className="admin-button admin-button-primary"
          >
            <HiOutlinePlus size={17} aria-hidden="true" />
            Add project
          </button>
        </div>
      </header>
      {message && (
        <div role="status" className="admin-notice">
          <span>{message}</span>
          {undo && (
            <button disabled={busy} onClick={restoreProject}>
              Undo
            </button>
          )}
          <button
            aria-label="Dismiss notification"
            onClick={() => {
              setMessage("");
              setUndo(null);
            }}
          >
            ×
          </button>
        </div>
      )}
      {actionError && !removing && (
        <p role="alert" className="admin-form-error">
          {actionError}
        </p>
      )}
      <div className="admin-panel admin-toolbar">
        <label className="admin-search">
          <HiOutlineMagnifyingGlass size={19} aria-hidden="true" />
          <span className="sr-only">Search projects</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects, categories or tools…"
          />
        </label>
        <span className="admin-count" aria-live="polite">
          {loading
            ? "Loading…"
            : `${filteredProjects.length} ${filteredProjects.length === 1 ? "project" : "projects"}`}
        </span>
      </div>
      {loading ? (
        <p role="status" className="admin-loading">
          Loading your collection…
        </p>
      ) : error ? (
        <div role="alert" className="admin-error">
          <p>{error}</p>
          <button type="button" onClick={reload} className="admin-button">
            Try again
          </button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <section className="admin-panel admin-empty">
          <HiOutlineFolder size={28} aria-hidden="true" />
          <h2>
            {query ? "No matching projects" : "Your collection starts here"}
          </h2>
          <p>
            {query
              ? "Try a different title, category or tool."
              : "Add a project to showcase your work."}
          </p>
          <button
            type="button"
            onClick={() =>
              query ? setSearch("") : setEditor({ project: null })
            }
            className="admin-button mt-4"
          >
            {query ? "Clear search" : "Add your first project"}
          </button>
        </section>
      ) : (
        <div className="admin-project-grid">
          {filteredProjects.map((project) => (
            <article
              className="admin-panel admin-project-card"
              key={project.id}
            >
              <div className="admin-project-cover">
                {project.image ? (
                  <ProjectImage
                    src={project.image}
                    alt={`${project.title} preview`}
                    loading="lazy"
                  />
                ) : (
                  <div className="admin-empty">
                    <HiOutlineFolder size={32} aria-hidden="true" />
                  </div>
                )}
              </div>
              <div className="admin-project-details">
                <p className="admin-project-category">{project.category}</p>
                <h2>{project.title}</h2>
                <p className="admin-project-description">
                  {project.description}
                </p>
                {project.technologies?.length > 0 && (
                  <div className="admin-tags" aria-label="Technologies">
                    {project.technologies.map((technology) => (
                      <span key={technology}>{technology}</span>
                    ))}
                  </div>
                )}
                <div className="admin-project-actions">
                  <div className="admin-heading-actions">
                    <button
                      className="admin-button"
                      onClick={() => setEditor({ project })}
                    >
                      <HiOutlinePencilSquare size={16} aria-hidden="true" />
                      Edit
                    </button>
                    <button
                      className="admin-icon-button admin-danger"
                      onClick={() => {
                        setRemoving(project);
                        setActionError("");
                      }}
                      aria-label={`Remove ${project.title}`}
                    >
                      <HiOutlineTrash size={17} aria-hidden="true" />
                    </button>
                  </div>
                  {/^https?:\/\//i.test(project.demo || "") && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${project.title} website`}
                    >
                      Preview{" "}
                      <HiOutlineArrowUpRight size={16} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      {editor && (
        <AdminDialog
          title={editor.project ? "Edit project" : "New project"}
          wide
          busy={busy}
          onClose={() => setEditor(null)}
        >
          <ProjectForm
            project={editor.project}
            onSubmit={saveProject}
            onCancel={() => setEditor(null)}
            onBusyChange={setBusy}
          />
        </AdminDialog>
      )}
      {removing && (
        <AdminDialog
          title="Remove project?"
          busy={busy}
          onClose={() => setRemoving(null)}
        >
          <div className="admin-confirm">
            <p>
              “{removing.title}” will be removed from your portfolio. You can
              undo this immediately after removing it.
            </p>
            {actionError && (
              <p role="alert" className="admin-form-error">
                {actionError}
              </p>
            )}
            <div className="admin-heading-actions">
              <button
                className="admin-button"
                disabled={busy}
                onClick={() => setRemoving(null)}
              >
                Keep project
              </button>
              <button
                className="admin-button admin-button-danger"
                disabled={busy}
                onClick={removeProject}
              >
                {busy ? "Removing…" : "Remove project"}
              </button>
            </div>
          </div>
        </AdminDialog>
      )}
    </>
  );
}
