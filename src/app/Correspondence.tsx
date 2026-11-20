import { FormEvent, useState } from "react";

type Intent = "general" | "creation" | "bespoke";
const creations = [
  ["yellow-tiger", "Yellow Tiger"],
  ["golden-peacock", "Golden Peacock"],
  ["graceful-crane", "Graceful Crane"],
  ["starry-night", "Starry Night"],
  ["royal-wave", "Royal Wave"],
  ["maestro-guilloche", "Maestro Guilloché"],
] as const;

export default function Correspondence() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [intent, setIntent] = useState<Intent>("general");
  const [creation, setCreation] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/correspondence", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, intent, creation, message, website }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const firstError = data?.errors ? Object.values(data.errors)[0] : data?.error;
        throw new Error(typeof firstError === "string" ? firstError : "Your message could not be sent. Please try again.");
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Your message could not be sent. Please try again.");
    }
  }

  const field = "w-full bg-transparent border-0 border-b border-[#F4F1EA]/20 rounded-none px-0 py-4 text-[14px] text-[#F4F1EA] placeholder:text-[#F4F1EA]/30 focus:border-[#B49A6A] focus:ring-0 outline-none transition-colors";
  const label = "block font-sans text-[9px] tracking-[0.24em] uppercase text-[#B49A6A]";

  return (
    <main className="min-h-screen bg-[#0A0A08] text-[#F4F1EA]">
      <header className="h-[72px] border-b border-[#F4F1EA]/10 flex items-center justify-between px-7 md:px-14">
        <a href="/" className="font-display text-[13px] tracking-[0.42em]">MAISON MILLIN</a>
        <a href="/" className="font-sans text-[9px] tracking-[0.22em] uppercase text-[#F4F1EA]/55 hover:text-[#F4F1EA]">Return to the House</a>
      </header>

      <section className="max-w-[1180px] mx-auto px-7 md:px-14 pt-20 md:pt-28 pb-24">
        <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-16 md:gap-24">
          <div>
            <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#B49A6A]">MAISON MILLIN · PRIVATE ENQUIRIES</p>
            <h1 className="font-display text-[48px] md:text-[68px] leading-[1.05] tracking-[0.01em] mt-8">Private<br/>Correspondence</h1>
            <p className="font-body italic text-[17px] md:text-[19px] leading-[1.7] text-[#F4F1EA]/55 mt-9 max-w-[390px]">Every meaningful creation begins with a conversation.</p>
            <div className="w-12 h-px bg-[#B49A6A] mt-12 mb-8"/>
            <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#F4F1EA]/40 leading-[2.1]">A HOUSE OF HOROLOGICAL ART<br/>BY APPOINTMENT ONLY</p>
            <p className="font-body text-[13px] leading-[1.9] text-[#F4F1EA]/38 mt-8 max-w-[350px]">For enquiries regarding a creation, a bespoke commission, or the House itself, please write to us. A member of the House will respond personally.</p>
          </div>

          <div className="pt-1">
            {status === "sent" ? (
              <div className="border border-[#B49A6A]/35 p-8 md:p-12">
                <p className={label}>MESSAGE RECEIVED</p>
                <h2 className="font-display text-[34px] mt-7">Thank you.</h2>
                <p className="font-body text-[14px] leading-[1.9] text-[#F4F1EA]/55 mt-5">Your correspondence has been received by the House. We will be in touch personally.</p>
                <button onClick={() => { setStatus("idle"); setName(""); setEmail(""); setMessage(""); setCreation(""); setIntent("general"); }} className="mt-10 font-sans text-[9px] tracking-[0.22em] uppercase text-[#B49A6A] border-b border-[#B49A6A]/50 pb-2">Write another message</button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-8">
                <div>
                  <label className={label} htmlFor="correspondence-name">Your name</label>
                  <input id="correspondence-name" className={field} value={name} onChange={e => setName(e.target.value)} autoComplete="name" required minLength={2} maxLength={120} placeholder="Name" />
                </div>
                <div>
                  <label className={label} htmlFor="correspondence-email">Email address</label>
                  <input id="correspondence-email" type="email" className={field} value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required maxLength={254} placeholder="Email" />
                </div>
                <div>
                  <label className={label} htmlFor="correspondence-intent">Subject of your enquiry</label>
                  <select id="correspondence-intent" className={field} value={intent} onChange={e => setIntent(e.target.value as Intent)}>
                    <option className="bg-[#0A0A08]" value="general">A general enquiry</option>
                    <option className="bg-[#0A0A08]" value="creation">A creation</option>
                    <option className="bg-[#0A0A08]" value="bespoke">A bespoke commission</option>
                  </select>
                </div>
                {intent === "creation" && <div>
                  <label className={label} htmlFor="correspondence-creation">Select a creation</label>
                  <select id="correspondence-creation" className={field} value={creation} onChange={e => setCreation(e.target.value)} required>
                    <option className="bg-[#0A0A08]" value="">Choose a creation</option>
                    {creations.map(([value, title]) => <option className="bg-[#0A0A08]" key={value} value={value}>{title}</option>)}
                  </select>
                </div>}
                <div>
                  <label className={label} htmlFor="correspondence-message">Your message</label>
                  <textarea id="correspondence-message" className={field + " min-h-[130px] resize-y"} value={message} onChange={e => setMessage(e.target.value)} required minLength={10} maxLength={3000} placeholder="How may we assist you?"/>
                </div>
                <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
                  <label htmlFor="correspondence-website">Website</label>
                  <input id="correspondence-website" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)}/>
                </div>
                {status === "error" && <p role="alert" className="text-[12px] text-[#D9A59A]">{error}</p>}
                <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <p className="font-sans text-[8px] tracking-[0.12em] leading-[1.8] text-[#F4F1EA]/28 max-w-[220px]">Your details will be used solely to respond to this enquiry.</p>
                  <button disabled={status === "sending"} type="submit" className="group inline-flex items-center gap-7 border border-[#B49A6A]/60 px-7 py-4 font-sans text-[9px] tracking-[0.24em] uppercase text-[#F4F1EA]/80 hover:bg-[#B49A6A]/10 disabled:opacity-50 transition-colors">
                    {status === "sending" ? "Sending…" : "Send correspondence"} <span className="text-[#B49A6A]">→</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
      <footer className="border-t border-[#F4F1EA]/10 px-7 md:px-14 py-8 flex flex-col sm:flex-row justify-between gap-3">
        <span className="font-display text-[11px] tracking-[0.3em] text-[#F4F1EA]/35">MAISON MILLIN</span>
        <span className="font-sans text-[8px] tracking-[0.2em] uppercase text-[#F4F1EA]/25">Excoluit is Creavit</span>
      </footer>
    </main>
  );
}
