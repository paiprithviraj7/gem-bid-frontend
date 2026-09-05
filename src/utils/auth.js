// Minimal mock-auth persistence using localStorage. Stores the logged-in
// user's public info (never the password) so a page refresh doesn't log
// them out. This is intentionally simple — see MASTER PROMPT section 15.
const STORAGE_KEY = "gem_current_user";

export function setCurrentUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function getCurrentUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEY);
}