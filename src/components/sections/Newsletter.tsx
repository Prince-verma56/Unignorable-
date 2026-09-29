import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { subscribeToNewsletter } from "@/lib/enquiry.functions";

/**
 * Lives inside the footer's ink field rather than as its own band between the
 * CTA and the footer, which interrupted the closing movement.
 */
export function NewsletterForm() {
  const subscribe = useServerFn(subscribeToNewsletter);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (state === "sending" || state === "done") return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      setMsg("Enter a valid email address.");
      return;
    }
    setState("sending");
    try {
      const res = await subscribe({ data: { email: email.trim().toLowerCase() } });
      setState("done");
      setMsg(res.alreadySubscribed ? "You're already on the list." : "You're on the list.");
    } catch {
      setState("error");
      setMsg("Something went wrong. Try again.");
    }
  }

  return (
    <div className="grid-12 mt-14 items-end gap-y-6 border-t border-border pt-8">
      <div className="col-span-12 md:col-span-5">
        <p className="type-meta text-bone/60">Newsletter</p>
        <p className="type-subtitle mt-3 max-w-[16ch]">
          One email. <span className="editorial text-signal">No noise.</span>
        </p>
      </div>

      <form onSubmit={onSubmit} className="col-span-12 md:col-span-6 md:col-start-7" noValidate>
        <label htmlFor="nl-email" className="type-meta text-bone/60">
          Email address
        </label>
        <div className="mt-3 flex items-center gap-4 border-b border-border pb-3 transition-colors focus-within:border-signal">
          <input
            id="nl-email"
            type="email"
            value={email}
            disabled={state === "done"}
            onChange={(e) => {
              setEmail(e.target.value);
              if (state === "error") setState("idle");
            }}
            placeholder="hello@unignorable.studio"
            className="w-full bg-transparent text-base placeholder:text-muted-foreground disabled:opacity-50"
          />
          <button
            type="submit"
            data-cursor="cta"
            disabled={state === "sending" || state === "done"}
            className="type-meta shrink-0 whitespace-nowrap text-signal transition-opacity hover:opacity-70 disabled:opacity-40"
          >
            {state === "sending" ? "Sending…" : "Join ↗"}
          </button>
        </div>
        <p
          aria-live="polite"
          className={`type-meta mt-3 h-4 transition-colors ${
            state === "done" ? "text-signal" : "text-muted-foreground"
          }`}
        >
          {msg}
        </p>
      </form>
    </div>
  );
}

/** @deprecated Kept so inner routes keep compiling; use `NewsletterForm`. */
export const Newsletter = NewsletterForm;
