import Link from "next/link";
import Image from "next/image";
import { clients, stats, testimonials } from "@/lib/content/proof";

/* Each of these renders nothing until real data is added to lib/content/proof.ts. */

export function ClientLogos() {
  if (clients.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <p className="mb-6 text-center text-xs uppercase tracking-widest text-muted">Trusted by teams at</p>
      <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
        {clients.map((c) => (
          <li key={c.name} className="text-muted opacity-80 transition-opacity hover:opacity-100">
            {c.logo ? (
              <Image src={c.logo} alt={c.name} width={120} height={32} className="h-7 w-auto object-contain grayscale" />
            ) : (
              <span className="text-lg font-semibold tracking-tight">{c.name}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function StatsRow() {
  if (stats.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface p-6">
            <dt className="text-[13px] text-muted">{s.label}</dt>
            <dd className="mt-1 text-3xl font-semibold tabular-nums tracking-tight">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Testimonials() {
  if (testimonials.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-moon">What clients say</p>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <figure key={t.name} className="flex flex-col rounded-2xl border border-border bg-surface/70 p-6">
            <blockquote className="flex-1 text-[15px] leading-relaxed">“{t.quote}”</blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              {t.photo && <Image src={t.photo} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />}
              <div className="text-sm">
                <p className="font-medium">{t.name}</p>
                <p className="text-muted">
                  {t.role}, {t.company}
                </p>
              </div>
              {t.caseStudy && (
                <Link href={t.caseStudy} className="ml-auto text-xs text-accent hover:underline">
                  Case study
                </Link>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
