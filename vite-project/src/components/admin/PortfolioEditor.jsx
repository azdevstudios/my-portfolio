import { useState } from "react";
import { useNavigate, useBeforeUnload } from "react-router-dom";
import { HiOutlineCheck, HiOutlineLockClosed } from "react-icons/hi2";
import usePortfolio from "../../hooks/usePortfolio";

const sections = {
  profile: {
    title: "The person behind the work.",
    description: "Your introduction, your story, your words.",
    fields: [
      { name: "name", label: "Full name", max: 120 },
      { name: "role", label: "Professional title", max: 120 },
      { name: "location", label: "Location", max: 160 },
      { name: "heroTitle", label: "Homepage headline", max: 160 },
      { name: "heroAccent", label: "Headline accent", max: 160 },
      {
        name: "description",
        label: "Homepage introduction",
        max: 1000,
        rows: 3,
      },
      {
        name: "biography",
        label: "About page biography",
        max: 6000,
        rows: 8,
        help: "Use a blank line to separate paragraphs.",
      },
    ],
  },
  settings: {
    title: "Keep the conversation open.",
    description: "Manage the contact links visitors use to reach you.",
    fields: [
      {
        name: "whatsapp",
        label: "WhatsApp number",
        max: 15,
        help: "Include country code. Digits only, without + or spaces. Leave blank to disable.",
      },
      { name: "github", label: "GitHub URL", type: "url", max: 2000 },
      { name: "linkedin", label: "LinkedIn URL", type: "url", max: 2000 },
      { name: "instagram", label: "Instagram URL", type: "url", max: 2000 },
    ],
  },
};

function EditorForm({ section, profile, saveProfile }) {
  const config = sections[section];
  const initial = Object.fromEntries(
    config.fields.map(({ name }) => [name, profile[name] || ""]),
  );
  const [values, setValues] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [baseline, setBaseline] = useState(initial);
  const navigate = useNavigate();
  const dirty = JSON.stringify(values) !== JSON.stringify(baseline);
  useBeforeUnload((event) => {
    if (dirty) {
      event.preventDefault();
      event.returnValue = "";
    }
  });

  async function submit(event) {
    event.preventDefault();
    if (busy || !dirty) return;
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      const result = await saveProfile(section, values);
      const next = Object.fromEntries(
        config.fields.map(({ name }) => [name, result.profile[name] || ""]),
      );
      setValues(next);
      setBaseline(next);
      setSaved(true);
    } catch (error) {
      if (error.status === 401) navigate("/admin/login", { replace: true });
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      className="admin-panel admin-editor admin-profile-editor"
      onSubmit={submit}
      aria-busy={busy}
    >
      <fieldset disabled={busy}>
        <div className="admin-form-grid">
          {config.fields.map((field) => (
            <label
              key={field.name}
              className={`admin-field ${field.rows || section === "settings" ? "admin-full" : ""}`}
            >
              <span>
                {field.label}
                {section === "profile" && " *"}
              </span>
              {field.rows ? (
                <textarea
                  name={field.name}
                  value={values[field.name]}
                  rows={field.rows}
                  maxLength={field.max}
                  required
                  onChange={(event) => {
                    setValues((current) => ({
                      ...current,
                      [field.name]: event.target.value,
                    }));
                    setSaved(false);
                  }}
                />
              ) : (
                <input
                  name={field.name}
                  type={field.type || "text"}
                  inputMode={field.name === "whatsapp" ? "numeric" : undefined}
                  pattern={
                    field.name === "whatsapp" ? "[0-9]{8,15}" : undefined
                  }
                  value={values[field.name]}
                  maxLength={field.max}
                  required={section === "profile"}
                  onChange={(event) => {
                    setValues((current) => ({
                      ...current,
                      [field.name]: event.target.value,
                    }));
                    setSaved(false);
                  }}
                />
              )}
              {field.help && <small>{field.help}</small>}
            </label>
          ))}
        </div>
      </fieldset>
      {error && (
        <p role="alert" className="admin-form-error">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="admin-save-success">
          <HiOutlineCheck size={17} aria-hidden="true" />
          Changes saved to your portfolio.
        </p>
      )}
      <div className="admin-form-footer">
        <p>{dirty ? "You have unsaved changes." : "Your changes are saved."}</p>
        <div>
          <button
            type="button"
            className="admin-button"
            disabled={busy || !dirty}
            onClick={() => {
              setValues(baseline);
              setError("");
              setSaved(false);
            }}
          >
            Discard changes
          </button>
          <button
            type="submit"
            className="admin-button admin-button-primary"
            disabled={busy || !dirty}
          >
            {busy ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default function PortfolioEditor({ section }) {
  const { profile, loading, error, reload, saveProfile } = usePortfolio();
  const config = sections[section];
  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="pf-eyebrow">Portfolio / {section}</p>
          <h1 className="pf-heading">{config.title}</h1>
          <p>{config.description}</p>
        </div>
      </header>
      {loading ? (
        <p role="status" className="admin-loading">
          Loading your details…
        </p>
      ) : error ? (
        <div role="alert" className="admin-error">
          <p>{error}</p>
          <button type="button" onClick={reload} className="admin-button">
            Try again
          </button>
        </div>
      ) : (
        <EditorForm
          key={section}
          section={section}
          profile={profile}
          saveProfile={saveProfile}
        />
      )}
      {section === "settings" && (
        <div className="admin-security-note">
          <HiOutlineLockClosed size={19} aria-hidden="true" />
          <p>
            Login credentials are managed through your private server
            environment settings. They are never displayed here.
          </p>
        </div>
      )}
    </>
  );
}
