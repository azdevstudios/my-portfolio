export async function apiRequest(path, { method = "GET", body, signal } = {}) {
  const response = await fetch(path, {
    method,
    credentials: "same-origin",
    cache: "no-store",
    signal,
    ...(body !== undefined
      ? {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      : {}),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) {
    const error = new Error(
      data?.message ||
        (response.status === 404
          ? "Service not found. Restart the local server and try again."
          : "Unable to complete your request."),
    );
    error.status = response.status;
    throw error;
  }
  return data;
}
