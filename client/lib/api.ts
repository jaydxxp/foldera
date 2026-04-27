import { getApiBaseUrl } from "./format";

interface ApiOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | Record<string, unknown> | null;
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  let body: BodyInit | undefined;

  if (options.body instanceof FormData) {
    body = options.body;
  } else if (options.body && typeof options.body === "object") {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(options.body);
  } else if (options.body) {
    body = options.body as BodyInit;
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    body,
    headers,
    credentials: "include",
  });

  const contentType = response.headers.get("content-type");
  const payload = contentType?.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.message ?? "Request failed");
  }

  return payload as T;
}
