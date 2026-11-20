const ALLOWED_INTENTS = new Set(["general", "creation", "bespoke"]);
const ALLOWED_CREATIONS = new Set([
  "yellow-tiger", "golden-peacock", "graceful-crane",
  "starry-night", "royal-wave", "maestro-guilloche",
]);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}
function clean(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function escapeHtml(value) {
  return value.replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[ch]);
}

export async function onRequest({ request, env }) {
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
  if (!(request.headers.get("content-type") || "").toLowerCase().includes("application/json")) {
    return json({ error: "Expected application/json." }, 415);
  }
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > 12000) return json({ error: "Request too large." }, 413);

  let raw;
  try {
    raw = await request.text();
    if (raw.length > 12000) return json({ error: "Request too large." }, 413);
  } catch { return json({ error: "Invalid request." }, 400); }

  let input;
  try { input = JSON.parse(raw); } catch { return json({ error: "Invalid JSON." }, 400); }
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return json({ error: "Invalid request." }, 400);
  }
  if (clean(input.website, 200)) return json({ accepted: true }, 202);

  const name = clean(input.name, 120);
  const email = clean(input.email, 254);
  const intent = clean(input.intent, 20);
  const creation = clean(input.creation, 40);
  const message = clean(input.message, 3000);
  const errors = {};
  if (name.length < 2) errors.name = "Please enter your name.";
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) errors.email = "Please enter a valid email address.";
  if (!ALLOWED_INTENTS.has(intent)) errors.intent = "Please choose the subject of your message.";
  if (intent === "creation" && !ALLOWED_CREATIONS.has(creation)) errors.creation = "Please choose a creation.";
  if (message.length < 10) errors.message = "Please write a message of at least 10 characters.";
  if (Object.keys(errors).length) return json({ errors }, 400);

  const apiKey = env.RESEND_API_KEY;
  const from = env.MAIL_FROM;
  const to = env.MAIL_TO;
  if (!apiKey || !from || !to) return json({ error: "Correspondence is not configured." }, 503);

  const intentLabels = { general: "A general enquiry", creation: "A creation", bespoke: "A bespoke commission" };
  const creationLabels = {
    "yellow-tiger": "Yellow Tiger", "golden-peacock": "Golden Peacock",
    "graceful-crane": "Graceful Crane", "starry-night": "Starry Night",
    "royal-wave": "Royal Wave", "maestro-guilloche": "Maestro Guilloché",
  };
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeIntent = escapeHtml(intentLabels[intent]);
  const safeCreation = intent === "creation" ? escapeHtml(creationLabels[creation]) : "";
  const safeMessage = escapeHtml(message).replace(/\\r?\\n/g, "<br>");

  let sent;
  try {
    sent = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        from, to: [to], reply_to: email,
        subject: `Private correspondence — ${intentLabels[intent]}`,
        text: [
          "MAISON MILLIN — Private Correspondence", "",
          `Name: ${name}`, `Email: ${email}`, `Subject: ${intentLabels[intent]}`,
          ...(intent === "creation" ? [`Creation: ${creationLabels[creation]}`] : []),
          "", "Message:", message,
        ].join("\\n"),
        html: `<h2>MAISON MILLIN — Private Correspondence</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Subject:</strong> ${safeIntent}</p>
          ${intent === "creation" ? `<p><strong>Creation:</strong> ${safeCreation}</p>` : ""}
          <p><strong>Message:</strong><br>${safeMessage}</p>`,
      }),
    });
  } catch { return json({ error: "Email service temporarily unavailable." }, 502); }
  if (!sent.ok) return json({ error: "Email service could not accept the message." }, 502);
  return json({ accepted: true }, 202);
}
