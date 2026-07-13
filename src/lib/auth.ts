// Lightweight client-side mock auth for the Vishara demo.
// Stores a logged-in flag in localStorage. No backend required for the demo.

const KEY = "vishara_user";

export type VisharaUser = { phone: string; name: string };

export function login(phone: string, name: string = "Patient"): VisharaUser {
  const user: VisharaUser = { phone, name };
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(user));
  }
  return user;
}

export function logout() {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}

export function getUser(): VisharaUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as VisharaUser) : null;
  } catch {
    return null;
  }
}
