import type { APIRoute } from "astro";
import { endSession } from "./auth";

// Dev-only endpoint (injected by the dev-admin integration in astro.config.mjs).
export const prerender = false;

export const POST: APIRoute = ({ cookies, redirect }) => {
  endSession(cookies);
  return redirect("/admin/login");
};
