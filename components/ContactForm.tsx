"use client";

import { useState, type FormEvent } from "react";
import { track } from "@vercel/analytics";
import { Check, AlertCircle } from "lucide-react";
import { site } from "@/data/site";
import { useLanguage } from "./LanguageProvider";

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const { t } = useLanguage();
  const f = t.contact.form;
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");

    track("contact_form_submit");

    // No backend configured → fall back to opening the user's mail client.
    if (!site.formEndpoint) {
      const subject = encodeURIComponent(`Yeni proje — ${name}`);
      const body = encodeURIComponent(
        `${message}\n\n— ${name}\n${email}`,
      );
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      setStatus("success");
      form.reset();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(site.formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/10 p-5 text-sm text-foreground">
        <Check className="h-5 w-5 shrink-0 text-accent" />
        {f.success}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          type="text"
          name="name"
          required
          placeholder={f.name}
          aria-label={f.name}
          className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-accent/50"
        />
        <input
          type="email"
          name="email"
          required
          placeholder={f.email}
          aria-label={f.email}
          className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-accent/50"
        />
      </div>
      <textarea
        name="message"
        required
        rows={4}
        placeholder={f.message}
        aria-label={f.message}
        className="resize-none rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-accent/50"
      />
      {status === "error" && (
        <p className="flex items-center gap-2 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {f.error}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary mt-1 w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? f.sending : f.submit}
      </button>
    </form>
  );
}
