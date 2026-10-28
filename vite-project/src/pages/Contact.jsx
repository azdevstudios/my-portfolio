import { useState } from "react";
import { ArrowUpRight, MapPin, MessageCircle, Check, ArrowRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import ScrollReveal from "../components/ScrollReveal";

import { profile } from "../data/profile";
import "../portfolio.css";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const fields = [
  {
    name: "name",
    label: "Your name",
    type: "text",
    placeholder: "Your full name",
    autoComplete: "name",
    maxLength: 100,
  },
  {
    name: "email",
    label: "Email address",
    type: "email",
    placeholder: "you@example.com",
    autoComplete: "email",
    maxLength: 254,
  },
  {
    name: "subject",
    label: "What are you planning?",
    type: "text",
    placeholder: "A website, dashboard or web application",
    maxLength: 150,
  },
];

const inputClass =
  "mt-3 w-full rounded-lg border border-[var(--line)] bg-[var(--page-bg)] px-4 py-3.5 text-sm text-[var(--text)] transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus-visible:outline-none focus:ring-0";

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const phone = String(profile.whatsapp || "").replace(/\D/g, "");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Please enter your name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!form.subject.trim()) {
      nextErrors.subject = "Please enter a subject.";
    }

    if (form.message.trim().length < 10) {
      nextErrors.message = "Please write at least 10 characters.";
    }

    if (!phone) {
      nextErrors.form = "WhatsApp contact is currently unavailable.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstField = ["name", "email", "subject", "message"].find(
        (name) => nextErrors[name]
      );

      if (firstField) {
        event.currentTarget.elements.namedItem(firstField)?.focus();
      }

      return;
    }

    const message = [
      "Portfolio enquiry",
      "",
      `Name: ${form.name.trim()}`,
      `Email: ${form.email.trim()}`,
      `Subject: ${form.subject.trim()}`,
      "",
      form.message.trim(),
    ].join("\n");

    window.location.assign(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    );
  }

  return (
    <div className="portfolio-page min-h-screen">
      <div className="pf-container">
        <ScrollReveal><section className="pf-about-header">
          <p className="pf-eyebrow">Contact / Let’s connect</p>

          <h1 className="pf-heading pf-about-title">
            Good work starts
            <br />
            <span className="pf-accent">with a conversation.</span>
          </h1>

          <p className="pf-description">
            Have a website or application in mind? Tell me what
            you’re planning and where you need help.
          </p>
        </section></ScrollReveal>

        <section
          aria-label="Contact details and enquiry form"
          className="contact-layout"
        >
          {/* Contact information */}
          <aside className="contact-aside">
            <span className="contact-symbol"><MessageCircle size={27} aria-hidden="true"/></span>
            <h2 className="pf-heading text-3xl">
              Let’s build something useful.
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-7 text-(--muted)">
              Share the main features, who the website is for,
              and any timeline or design references you have.
            </p>

            <div className="mt-8 flex items-center gap-3 text-sm text-(--muted)">
              <MapPin
                size={18}
                className="shrink-0 text-(--accent)"
                aria-hidden="true"
              />

              Faisalabad, Pakistan
            </div>

            {phone && (
              <a
                href={`https://wa.me/${phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-3 rounded-lg border border-(--line) bg-(--panel-bg) px-5 py-4 text-sm font-medium transition-colors hover:border-(--accent)"
              >
                <FaWhatsapp
                  size={21}
                  color="#25D366"
                  aria-hidden="true"
                />

                Chat on WhatsApp

                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            )}

            <p className="mt-6 max-w-xs text-xs leading-6 text-(--muted)">
              Prefer a direct message? You can skip the form
              and contact me on WhatsApp.
            </p>
            <div className="contact-next">
              <p className="pf-eyebrow">A SIMPLE START</p>
              <ol>
                <li><span>01</span><div><strong>Share your idea</strong><p>A quick brief is all we need to begin.</p></div></li>
                <li><span>02</span><div><strong>Talk through the details</strong><p>Goals, features and the direction you have in mind.</p></div></li>
                <li><span>03</span><div><strong>Find the next step</strong><p>Agree on what your project needs.</p></div></li>
              </ol>
            </div>
          </aside>

          {/* Enquiry form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="contact-form"
          >
            <h2 className="pf-heading text-2xl">
              Tell me about your project.
            </h2>

            <p className="mb-8 mt-3 text-xs leading-6 text-(--muted)">
              All fields are required. This opens your enquiry
              in WhatsApp, where you can review it and press Send.
            </p>
            <fieldset className="enquiry-types">
              <legend>I’m thinking about…</legend>
              <div>{["A website", "A web application", "Something else"].map(type => <button key={type} type="button" aria-pressed={form.subject === type} onClick={() => {setForm(current => ({...current, subject: type})); setErrors(current => ({...current, subject: ""}));}}>{form.subject === type && <Check size={13} aria-hidden="true"/>}{type}</button>)}</div>
            </fieldset>

            <div className="grid gap-6 sm:grid-cols-2">
              {fields.map((field) => (
                <div
                  key={field.name}
                  className={
                    field.name === "subject" ? "sm:col-span-2" : ""
                  }
                >
                  <label
                    htmlFor={field.name}
                    className="text-xs font-medium"
                  >
                    {field.label}
                  </label>

                  <input
                    {...field}
                    id={field.name}
                    required
                    value={form[field.name]}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors[field.name])}
                    aria-describedby={
                      errors[field.name]
                        ? `${field.name}-error`
                        : undefined
                    }
                    className={inputClass}
                  />

                  {errors[field.name] && (
                    <p
                      id={`${field.name}-error`}
                      className="mt-2 text-xs text-red-600 dark:text-red-400"
                    >
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}

              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="text-xs font-medium"
                >
                  Project details
                </label>

                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  minLength={10}
                  maxLength={2000}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="What would you like to build?"
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message ? "message-error" : undefined
                  }
                  className={`${inputClass} resize-y`}
                />

                {errors.message && (
                  <p
                    id="message-error"
                    className="mt-2 text-xs text-red-600 dark:text-red-400"
                  >
                    {errors.message}
                  </p>
                )}
              </div>
            </div>

            {errors.form && (
              <p
                role="alert"
                className="mt-5 text-sm text-red-600 dark:text-red-400"
              >
                {errors.form}
              </p>
            )}

            <button type="submit" className="pf-button mt-7">
              Continue in WhatsApp
              <ArrowRight size={17} aria-hidden="true" />
            </button>
            <p className="form-footnote">Your message stays with you until you send it in WhatsApp.</p>
          </form>
        </section>
      </div>
    </div>
  );
}
