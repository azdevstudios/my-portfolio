import { useCallback, useEffect, useState } from "react";
import defaults from "../data/profile";
import { apiRequest } from "../lib/api";
import { PortfolioContext } from "./portfolio-context";

export default function PortfolioProvider({ children }) {
  const [profile, setProfile] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const reload = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    let active = true;
    const timeout = setTimeout(() => controller.abort(), 15000);
    apiRequest("/api/profile", { signal: controller.signal })
      .then((data) => {
        if (!data.profile || typeof data.profile !== "object")
          throw new Error("Invalid profile response.");
        if (active) {
          setProfile({ ...defaults, ...data.profile });
          setError("");
        }
      })
      .catch(() => {
        if (active)
          setError("Unable to load your saved profile. Please try again.");
      })
      .finally(() => {
        clearTimeout(timeout);
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [revision]);

  async function saveProfile(section, values) {
    const data = await apiRequest("/api/profile", {
      method: "PUT",
      body: { section, values },
    });
    setProfile({ ...defaults, ...data.profile });
    setError("");
    return data;
  }

  return (
    <PortfolioContext.Provider
      value={{ profile, loading, error, reload, saveProfile }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}
