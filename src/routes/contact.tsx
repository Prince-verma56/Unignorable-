import { useMemo, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUpRight, Check } from "lucide-react";
import { SiteFrame } from "@/components/SiteFrame";
import { Frame } from "@/components/media/Frame";
import { SplitLines } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { useGsapContext } from "@/hooks/useGsapContext";
import { applyParallax, revealImage, START } from "@/lib/motion";
import { submitEnquiry } from "@/lib/enquiry.functions";
import { BUDGETS, site, TIMELINES, whatsappLink } from "@/lib/site";
import { services } from "@/lib/data/services";
import campaignGlass from "@/assets/campaign-glass.jpg";

const title = "Start a Project — UNIGNORABLE";
const description =
  "Tell UNIGNORABLE about your next campaign, brand, website or growth challenge.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const fieldClass =
  "w-full border-0 border-b border-border bg-transparent px-0 py-3.5 text-base text-foreground transition-colors placeholder:text-muted-foreground focus:border-signal";

/** Labels sit above their field, in meta type, sentence case. */
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="type-meta text-muted-foreground">
        {label}
        {required ? <span className="text-signal"> *</span> : null}
      </span>
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

function ContactPage() {
  const send = useServerFn(submitEnquiry);
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const serviceOptions = useMemo(() => services.map((service) => service.title), []);

  const ref = useGsapContext<HTMLElement>((ctx) => {
    revealImage(ctx, "[data-reveal-image]");
    applyParallax(ctx);
  }, []);

  const toggleService = (service: string) => {
    setSelected((current) =>
      current.includes(service)
        ? current.filter((item) => item !== service)
        : [...current, service],
    );
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    const form = new FormData(event.currentTarget);
    setStatus("sending");
    setError("");
    try {
      await send({
        data: {
          name: String(form.get("name") ?? ""),
          company: String(form.get("company") ?? ""),
          email: String(form.get("email") ?? ""),
          phone: String(form.get("phone") ?? ""),
          services: selected,
          budget: String(form.get("budget") ?? ""),
          timeline: String(form.get("timeline") ?? ""),
          message: String(form.get("message") ?? ""),
        },
      });
      setStatus("sent");
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Something went wrong. Please try again.",
      );
      setStatus("error");
    }
  };

  return (
    <SiteFrame>
      <section
        ref={ref}
        className="edge relative overflow-hidden pb-[var(--space-band)] pt-[clamp(8rem,20vh,13rem)]"
      >
        <div className="grid-12 gap-y-16">
          <header className="col-span-12 lg:col-span-5">
            <p className="type-meta text-signal">New business — global</p>
            <h1 className="sr-only">Contact</h1>
            <SplitLines
              as="p"
              text={"Bring us the\nimpossible."}
              className="type-display mt-5 max-w-[9ch]"
              lineClass={(_, i) =>
                i === 1 ? "editorial text-[1.12em] lowercase text-signal" : undefined
              }
              start={START.early}
            />
            <p className="type-lead mt-8 text-foreground/75">
              Tell us where you are, where you need to go, and why now. We will take it from
              there.
            </p>

            <div className="relative mt-14 hidden w-[85%] md:block">
              <Frame
                src={campaignGlass}
                alt="Iridescent glass campaign artwork"
                width={1024}
                height={768}
                ratio="16/10"
                depth="far"
              />
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className="type-meta absolute -bottom-6 right-[-8%] inline-flex items-center gap-3 bg-ink px-6 py-4 text-ink-foreground transition-all duration-[320ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:bg-acid hover:text-acid-foreground"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="size-4" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.015c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                WhatsApp ↗
              </a>
            </div>

            <p className="type-meta mt-16 text-foreground/60 md:mt-24">
              {site.email} · {site.locations.join(" / ")}
            </p>
          </header>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            {status === "sent" ? (
              <div
                className="flex min-h-[55svh] flex-col justify-center border-y border-border py-16"
                role="status"
              >
                <Check className="size-10 text-signal" aria-hidden="true" />
                <p className="type-title mt-8 max-w-[14ch]">Your brief is in.</p>
                <p className="type-lead mt-6 text-muted-foreground">
                  We have it. Expect a human reply — not an autoresponder — shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-10">
                <div className="grid gap-8 sm:grid-cols-2">
                  <Field label="Full name" required>
                    <input
                      className={fieldClass}
                      name="name"
                      autoComplete="name"
                      required
                      minLength={2}
                      placeholder="Your name"
                    />
                  </Field>
                  <Field label="Company">
                    <input
                      className={fieldClass}
                      name="company"
                      autoComplete="organization"
                      placeholder="Brand or company"
                    />
                  </Field>
                  <Field label="Email" required>
                    <input
                      className={fieldClass}
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      placeholder="hello@unignorable.studio"
                    />
                  </Field>
                  <Field label="Phone / WhatsApp">
                    <input
                      className={fieldClass}
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      placeholder="+91"
                    />
                  </Field>
                </div>

                <fieldset>
                  <legend className="type-meta text-muted-foreground">Services required</legend>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {serviceOptions.map((service) => {
                      const active = selected.includes(service);
                      return (
                        <Button
                          key={service}
                          type="button"
                          variant={active ? "default" : "outline"}
                          aria-pressed={active}
                          onClick={() => toggleService(service)}
                          className="type-meta h-auto rounded-none px-4 py-3"
                        >
                          {service}
                        </Button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="grid gap-8 sm:grid-cols-2">
                  <Field label="Budget">
                    <select name="budget" className={fieldClass} defaultValue="">
                      <option value="" disabled>
                        Choose a range
                      </option>
                      {BUDGETS.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Project timeline">
                    <select name="timeline" className={fieldClass} defaultValue="">
                      <option value="" disabled>
                        Choose timing
                      </option>
                      {TIMELINES.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Project description" required>
                  <textarea
                    className={`${fieldClass} min-h-32 resize-y`}
                    name="message"
                    required
                    minLength={10}
                    placeholder="What are we making, changing or growing?"
                  />
                </Field>

                {error ? (
                  <p role="alert" className="type-body text-signal">
                    {error}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  disabled={status === "sending"}
                  className="type-meta h-auto w-full rounded-none px-8 py-5 sm:w-auto"
                >
                  {status === "sending" ? "Sending…" : "Send project"}
                  <ArrowUpRight aria-hidden="true" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
