import { useCallback, useEffect, useState } from "react";

export default function usePortfolioProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);

  const reload = useCallback(() => {
    setVersion((current) => current + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 15000);

    async function loadProjects() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/projects", {
          cache: "no-store",
          signal: controller.signal,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.message || "Unable to load projects.");
        }

        if (!Array.isArray(data?.projects)) {
          throw new Error("Invalid projects response.");
        }

        if (active) {
          setProjects(data.projects);
        }
      } catch (error) {
        if (active) {
          setError(
            timedOut
              ? "Projects took too long to load. Please try again."
              : error.message || "Unable to load projects.",
          );
        }
      } finally {
        clearTimeout(timeout);
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [version]);

  return {
    projects,
    loading,
    error,
    reload,
  };
}
