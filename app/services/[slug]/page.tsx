import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { CtaBanner } from "@/components/CtaBanner";
import { services } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return { title: `${service.name} automation`, description: service.short };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = services.findIndex((s) => s.slug === slug);
  if (index === -1) notFound();
  const service = services[index];
  const next = services[(index + 1) % services.length];

  return (
    <>
      <PageHeader eyebrow={`Service ${String(index + 1).padStart(2, "0")}`} title={service.name} intro={service.short} />

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="text-xs uppercase tracking-widest text-moon mb-6">What we automate</h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {service.items.map((item) => (
            <li key={item} className="flex gap-4 rounded-xl border border-border bg-surface p-5">
              <svg
                viewBox="0 0 24 24"
                className="mt-0.5 h-5 w-5 shrink-0 text-moon"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M4 12.5 9.5 18 20 6" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-28">
        <Link
          href={`/services/${next.slug}`}
          className="group flex items-center justify-between rounded-2xl border border-border p-8 transition-colors hover:border-accent/40"
        >
          <div>
            <p className="text-xs uppercase tracking-widest text-muted mb-2">Next service</p>
            <p className="text-2xl font-medium">{next.name}</p>
          </div>
          <span className="text-2xl text-accent transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </section>

      <CtaBanner title={`Want ${service.name.toLowerCase()} on autopilot?`} />
    </>
  );
}
