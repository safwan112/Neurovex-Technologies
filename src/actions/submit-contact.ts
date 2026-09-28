import { defineAction, ActionError } from "astro:actions";
import { RESEND_API_KEY } from "astro:env/server";
import { contactInput, sendContactEmail } from "./contact-email";

export const submitContact = defineAction({
  accept: "form",
  input: contactInput,
  handler: async (input, context) => {
    // The schema still limits individual fields when Content-Length is absent.
    const contentLength = Number(context.request.headers.get("content-length"));
    if (contentLength > 16_384) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "VALIDATION_ERROR",
      });
    }
    // Silently "succeed" for bots that filled the honeypot field.
    if (input.website) {
      return { success: true };
    }

    if (!RESEND_API_KEY) {
      console.error("Contact email delivery is not configured");
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "EMAIL_DELIVERY_ERROR",
      });
    }

    try {
      if (!(await sendContactEmail(input, RESEND_API_KEY))) {
        console.error("Contact email provider rejected a submission");
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "EMAIL_DELIVERY_ERROR",
        });
      }

      return { success: true };
    } catch (error) {
      if (!(error instanceof ActionError)) {
        // Provider errors may contain personal data; log only the failure type.
        console.error("Contact email delivery request failed");
      }
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "EMAIL_DELIVERY_ERROR",
      });
    }
  },
});
