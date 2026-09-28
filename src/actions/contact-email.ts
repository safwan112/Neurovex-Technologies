import { z } from "zod";

const requiredText = (min: number, max: number) =>
  z.string().trim().min(min).max(max);

export const contactInput = z.object({
  name: requiredText(2, 200),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(50).optional(),
  message: requiredText(1, 5000),
  website: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactInput>;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export function createContactEmail(
  { name, email, phone, message }: ContactInput,
  submittedAt: Date
) {
  const fields = [
    ["Nom", name],
    ["Email", email],
    ["Téléphone", phone || "Non renseigné"],
    ["Message", message],
    ["Source", "neurovex.ma/contact"],
    ["Date", submittedAt.toISOString()],
  ];

  return {
    from: "Neurovex Website <website@neurovex.ma>",
    to: ["contact@neurovex.ma"],
    reply_to: email,
    subject: `Nouvelle demande — ${name}`,
    text: fields.map(([label, value]) => `${label}:\n${value}`).join("\n\n"),
    html: `<h2>Nouvelle demande depuis neurovex.ma</h2>${fields
      .map(
        ([label, value]) =>
          `<p><strong>${label} :</strong><br />${escapeHtml(value).replace(/\n/g, "<br />")}</p>`
      )
      .join("")}`,
  };
}

export async function sendContactEmail(
  input: ContactInput,
  apiKey: string,
  fetcher: typeof fetch = fetch
): Promise<boolean> {
  const response = await fetcher("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createContactEmail(input, new Date())),
  });

  if (!response.ok) return false;
  try {
    const result: unknown = await response.json();
    return (
      typeof result === "object" &&
      result !== null &&
      "id" in result &&
      typeof result.id === "string" &&
      result.id.length > 0 &&
      !("error" in result && result.error)
    );
  } catch {
    return false;
  }
}
