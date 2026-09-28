import type { AstroCookies } from "astro";
import { createHmac, timingSafeEqual } from "node:crypto";
import { ADMIN_PASSWORD } from "astro:env/server";

// Password protection for the dev-only admin pages. The password lives in
// `.env` (ADMIN_PASSWORD); the session cookie holds an HMAC derived from it,
// so changing the password logs everyone out.
export const SESSION_COOKIE = "neurovex_admin";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

export const isPasswordConfigured = () => Boolean(ADMIN_PASSWORD);

const sessionToken = () =>
  createHmac("sha256", ADMIN_PASSWORD ?? "")
    .update("neurovex-admin-session")
    .digest("hex");

const safeEqual = (a: string, b: string) => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
};

export const checkPassword = (password: string) =>
  isPasswordConfigured() && safeEqual(password, ADMIN_PASSWORD ?? "");

export const isAuthenticated = (cookies: AstroCookies) => {
  const value = cookies.get(SESSION_COOKIE)?.value;
  return isPasswordConfigured() && !!value && safeEqual(value, sessionToken());
};

export const startSession = (cookies: AstroCookies) =>
  cookies.set(SESSION_COOKIE, sessionToken(), {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    maxAge: SESSION_MAX_AGE,
  });

export const endSession = (cookies: AstroCookies) =>
  cookies.delete(SESSION_COOKIE, { path: "/" });

export const loginRedirect = (next: string) =>
  `/admin/login?next=${encodeURIComponent(next)}`;

export const unauthorized = () =>
  new Response(
    JSON.stringify({ error: "Session expirée. Reconnectez-vous." }),
    { status: 401, headers: { "Content-Type": "application/json" } }
  );
