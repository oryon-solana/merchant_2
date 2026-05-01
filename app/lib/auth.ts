export const AUTH_STORAGE_KEY = "sizzle_logged_in";
export const AUTH_CHANGED_EVENT = "sizzle-auth-changed";

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(AUTH_STORAGE_KEY) === "true";
}

export function setLoggedIn(value: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, value ? "true" : "false");
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}
