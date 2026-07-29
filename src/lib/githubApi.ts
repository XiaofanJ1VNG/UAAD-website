"use client";

import { API_BASE } from "./githubConfig";

export const TOKEN_STORAGE_KEY = "uaad_gh_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

// Verifies a token actually works and can reach the repo.
export async function verifyToken(token: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}`, { headers: authHeaders(token) });
  return res.ok;
}

function toBase64(str: string): string {
  // btoa only handles Latin1, so UTF-8 encode first.
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function fromBase64(b64: string): string {
  const binary = atob(b64.replace(/\n/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export interface GhFile {
  content: string; // decoded text
  sha: string | null; // null if the file doesn't exist yet
}

// Reads a text file from the repo. Returns sha: null if it doesn't exist
// yet (fresh repo), so callers can create it on first write.
export async function getFile(path: string, token: string): Promise<GhFile> {
  const res = await fetch(`${API_BASE}/contents/${path}`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  if (res.status === 404) return { content: "", sha: null };
  if (!res.ok) throw new Error(`Failed to read ${path}: ${res.status}`);
  const json = await res.json();
  return { content: fromBase64(json.content), sha: json.sha };
}

// Creates or updates a text file. Pass the sha you got from getFile() when
// updating an existing file (GitHub requires it to prevent silently
// clobbering someone else's concurrent edit).
export async function putTextFile(
  path: string,
  content: string,
  message: string,
  token: string,
  sha: string | null
): Promise<void> {
  const res = await fetch(`${API_BASE}/contents/${path}`, {
    method: "PUT",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: toBase64(content),
      sha: sha ?? undefined,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to write ${path}: ${res.status} ${body}`);
  }
}

// Uploads a binary file (image) and returns its permanent raw URL.
export async function putBinaryFile(
  path: string,
  base64Content: string,
  message: string,
  token: string
): Promise<string> {
  const res = await fetch(`${API_BASE}/contents/${path}`, {
    method: "PUT",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: base64Content }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to upload ${path}: ${res.status} ${body}`);
  }
  const json = await res.json();
  return json.content.download_url as string;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // strip the "data:image/png;base64," prefix
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
