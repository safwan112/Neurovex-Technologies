import assert from "node:assert/strict";
import { test } from "node:test";
import {
  contactInput,
  createContactEmail,
  sendContactEmail,
} from "./contact-email";

const valid = {
  name: "  Ada Lovelace  ",
  email: "  ada@example.com  ",
  phone: "",
  message: "  Please call me about IT support.  ",
  website: "",
};

test("valid input is trimmed and optional phone may be empty", () => {
  const parsed = contactInput.parse(valid);
  assert.equal(parsed.name, "Ada Lovelace");
  assert.equal(parsed.email, "ada@example.com");
  assert.equal(parsed.phone, "");
  assert.equal(parsed.message, "Please call me about IT support.");
});

test("invalid or absent required fields and oversized input are rejected", () => {
  for (const input of [
    { ...valid, email: "bad" },
    { ...valid, name: "" },
    { ...valid, message: "   " },
    { ...valid, message: "x".repeat(5001) },
    { ...valid, phone: "x".repeat(51) },
  ]) {
    assert.equal(contactInput.safeParse(input).success, false);
  }
});

test("a single non-whitespace character is a valid message", () => {
  const result = contactInput.parse({ ...valid, message: "  ?  " });
  assert.equal(result.message, "?");
});

test("email has verified sender, recipient, reply-to, plain text and escaped HTML", () => {
  const input = contactInput.parse({
    ...valid,
    message: "Please call <script>alert(1)</script>",
  });
  const email = createContactEmail(input, new Date("2026-09-28T10:00:00Z"));
  assert.equal(email.from, "Neurovex Website <website@neurovex.ma>");
  assert.deepEqual(email.to, ["contact@neurovex.ma"]);
  assert.equal(email.reply_to, "ada@example.com");
  assert.equal(email.subject, "Nouvelle demande — Ada Lovelace");
  assert.match(email.text, /Téléphone:\nNon renseigné/);
  assert.match(email.text, /Source:\nneurovex.ma\/contact/);
  assert.match(email.html, /&lt;script&gt;/);
  assert.doesNotMatch(email.html, /<script>/);
});

test("Resend success requires an accepted response with an id", async () => {
  const input = contactInput.parse(valid);
  let calls = 0;
  const fetcher = (async (_url: string, options: RequestInit) => {
    calls++;
    const body = JSON.parse(String(options.body));
    assert.equal(body.reply_to, "ada@example.com");
    return Response.json({ id: "email_123" });
  }) as typeof fetch;
  assert.equal(await sendContactEmail(input, "test-key", fetcher), true);
  assert.equal(calls, 1);
});

test("Resend failure and malformed success are rejected", async () => {
  const input = contactInput.parse(valid);
  for (const response of [
    Response.json({ error: "rejected" }, { status: 403 }),
    Response.json({ error: "rejected" }),
    Response.json({}),
  ]) {
    const fetcher = (async () => response) as typeof fetch;
    assert.equal(await sendContactEmail(input, "test-key", fetcher), false);
  }
});
