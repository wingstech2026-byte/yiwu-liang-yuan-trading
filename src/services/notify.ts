import type { InquiryRecord } from "@/services/inquiry-store";

export type EmailResult = "sent" | "skipped" | "failed";

interface Attachment {
  filename: string;
  data: Uint8Array;
}

const API = "https://api.resend.com/emails";

/**
 * Emails a copy of each inquiry via Resend (https://resend.com). Needs RESEND_API_KEY and INQUIRY_TO_EMAIL;
 * without them this does nothing ("skipped"), so the form works either way.
 * INQUIRY_FROM_EMAIL must be an address on a domain verified in Resend (the default only reaches the Resend account owner).
 */
export async function sendInquiryEmail(record: InquiryRecord, attachment?: Attachment | null): Promise<EmailResult> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO_EMAIL;
  if (!key || !to) return "skipped";

  const from = process.env.INQUIRY_FROM_EMAIL || "Website Inquiries <onboarding@resend.dev>";
  const lines = [
    `Name: ${record.name}`,
    `Company: ${record.company || "-"}`,
    `Country: ${record.country}`,
    `Email: ${record.email}`,
    `WhatsApp: ${record.whatsapp || "-"}`,
    `Product / category: ${record.product}`,
    ...(record.items ? [`Products on quote list: ${record.items}`] : []),
    `Quantity: ${record.quantity || "-"}`,
    `Target price: ${record.targetPrice || "-"}`,
    "",
    "Message:",
    record.message,
    "",
    `Received: ${record.createdAt}  (ID ${record.id})`,
  ];

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()).filter(Boolean),
        reply_to: record.email,
        subject: `New inquiry: ${record.product} - ${record.name} (${record.country})`.slice(0, 200),
        text: lines.join("\n"),
        ...(attachment ? { attachments: [{ filename: attachment.filename, content: Buffer.from(attachment.data).toString("base64") }] } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("[inquiry] email provider returned", res.status);
      return "failed";
    }
    return "sent";
  } catch (err) {
    console.error("[inquiry] email failed", err instanceof Error ? err.message : err);
    return "failed";
  }
}
