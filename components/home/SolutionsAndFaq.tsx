import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { industryDetails } from "@/lib/content/industries";
import { faqs } from "@/lib/content/company";
import { industryIcons } from "@/lib/icons";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHead } from "./SectionHead";

export function Solutions() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionHead
        eyebrow="Solutions"
        title="Ready-made playbooks for your industry."
        link={{ href: "/industries", label: "All solutions" }}
      />
      <ul className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {industryDetails.map((ind) => {
          const Icon = industryIcons[ind.slug];
          return (
            <li key={ind.slug} className="bg-surface">
              <Link href={`/industries/${ind.slug}`} className="group flex h-full flex-col gap-3 p-6 transition-colors hover:bg-surface-2/60">
                <Icon className="h-5 w-5 text-muted transition-colors group-hover:text-accent" strokeWidth={1.6} />
                <span className="font-medium">{ind.name}</span>
                <span className="flex-1 text-[13px] leading-relaxed text-muted">{ind.headline}</span>
                <span className="inline-flex items-center gap-1 text-xs text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  See the playbook <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function HomeFaq() {
  const items = faqs.flatMap((g) => g.items).slice(0, 7);
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1fr_1.6fr]">
      <div>
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-moon">FAQ</p>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-[2rem] sm:leading-tight">Questions we hear before every project.</h2>
        <Link href="/faq" className="mt-5 inline-flex items-center gap-1 text-sm text-accent hover:underline">
          All questions <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <Accordion items={items} />
    </section>
  );
}
