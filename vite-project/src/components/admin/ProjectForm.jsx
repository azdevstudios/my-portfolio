import ProjectImage from "../ProjectImage";
import { useState } from "react";
import { HiOutlineArrowUpTray, HiOutlinePhoto } from "react-icons/hi2";
import { useBeforeUnload } from "react-router-dom";
import { apiRequest } from "../../lib/api";
import { prepareProjectImage } from "../../lib/images";

const empty = {
  title: "",
  category: "",
  description: "",
  image: "",
  demo: "",
  source: "",
  number: "",
  technologies: [],
  features: [],
};
const fields = [
  {
    name: "title",
    label: "Project title",
    required: true,
    max: 120,
    placeholder: "A name for your project",
  },
  {
    name: "category",
    label: "Category",
    required: true,
    max: 120,
    placeholder: "e.g. Web application",
  },
  {
    name: "demo",
    label: "Live website",
    type: "url",
    max: 2000,
    placeholder: "https://…",
  },
  {
    name: "source",
    label: "Source code",
    type: "url",
    max: 2000,
    placeholder: "https://github.com/…",
  },
];

export default function ProjectForm({
  project,
  onSubmit,
  onCancel,
  onBusyChange,
}) {
  const initial = { ...empty, ...project };
  const [form, setForm] = useState(initial);
  const [technologies, setTechnologies] = useState(
    initial.technologies.join(", "),
  );
  const [features, setFeatures] = useState(initial.features.join("\n"));
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const dirty =
    JSON.stringify(form) !== JSON.stringify(initial) ||
    technologies !== initial.technologies.join(", ") ||
    features !== initial.features.join("\n");
  useBeforeUnload((event) => {
    if (dirty) {
      event.preventDefault();
      event.returnValue = "";
    }
  });

  function change(event) {
    setError("");
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }
  function setWorking(value) {
    onBusyChange?.(value);
  }

  async function upload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true);
    setWorking(true);
    setError("");
    try {
      const image = await prepareProjectImage(file);
      const data = await apiRequest("/api/media", {
        method: "POST",
        body: image,
      });
      setForm((current) => ({ ...current, image: data.url }));
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
      setWorking(false);
    }
  }

  async function submit(event) {
    event.preventDefault();
    if (busy || uploading) return;
    setBusy(true);
    setWorking(true);
    setError("");
    try {
      await onSubmit({
        ...form,
        technologies: technologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        features: features
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
      setWorking(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="admin-editor"
      aria-busy={busy || uploading}
    >
      <fieldset disabled={busy || uploading}>
        <div className="admin-cover-editor">
          <div className="admin-cover-preview">
            {form.image ? (
              <ProjectImage src={form.image} alt="Project cover preview" />
            ) : (
              <HiOutlinePhoto size={30} aria-hidden="true" />
            )}
          </div>
          <div>
            <label className="admin-field-label" htmlFor="project-upload">
              Project cover
            </label>
            <p className="admin-help">
              PNG, JPG or WebP · up to 10 MB · automatically compressed
            </p>
            <label
              className="admin-button admin-upload"
              htmlFor="project-upload"
            >
              <HiOutlineArrowUpTray size={16} aria-hidden="true" />
              {uploading ? "Uploading…" : "Upload image"}
            </label>
            <input
              id="project-upload"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={upload}
              className="admin-file-input"
            />
          </div>
        </div>
        <div className="admin-form-grid">
          <label className="admin-field admin-full">
            <span>Image URL or local path</span>
            <input
              name="image"
              value={form.image}
              onChange={change}
              maxLength={2000}
              placeholder="/portfolio.png or https://…"
            />
            <small>
              Upload a cover above, or use an existing image address.
            </small>
          </label>
          {fields.map((field) => (
            <label className="admin-field" key={field.name}>
              <span>
                {field.label}
                {field.required && " *"}
              </span>
              <input
                name={field.name}
                type={field.type || "text"}
                required={field.required}
                maxLength={field.max}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={change}
              />
            </label>
          ))}
          <label className="admin-field admin-full">
            <span>Description *</span>
            <textarea
              name="description"
              value={form.description}
              onChange={change}
              required
              rows={4}
              maxLength={2000}
              placeholder="What did you build, and what makes it useful?"
            />
            <small>{form.description.length}/2000 characters</small>
          </label>
          <label className="admin-field admin-full">
            <span>Technologies</span>
            <input
              value={technologies}
              onChange={(event) => setTechnologies(event.target.value)}
              maxLength={3000}
              placeholder="React, Node.js, MongoDB"
            />
            <small>Separate technologies with commas.</small>
          </label>
          <label className="admin-field admin-full">
            <span>Project features</span>
            <textarea
              value={features}
              onChange={(event) => setFeatures(event.target.value)}
              rows={3}
              maxLength={5500}
              placeholder="One feature per line"
            />
            <small>Up to 30 features, one per line.</small>
          </label>
          <label className="admin-field">
            <span>Display number</span>
            <input
              name="number"
              value={form.number}
              onChange={change}
              maxLength={8}
              placeholder="e.g. 03 (optional)"
            />
          </label>
        </div>
      </fieldset>
      {error && (
        <p role="alert" className="admin-form-error">
          {error}
        </p>
      )}
      <div className="admin-form-footer">
        <p>Changes appear on your portfolio after saving.</p>
        <div>
          <button
            type="button"
            disabled={busy || uploading}
            onClick={onCancel}
            className="admin-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy || uploading}
            className="admin-button admin-button-primary"
          >
            {busy
              ? "Saving…"
              : uploading
                ? "Uploading…"
                : project
                  ? "Save changes"
                  : "Add project"}
          </button>
        </div>
      </div>
    </form>
  );
}
