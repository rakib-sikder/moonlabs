import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CtaBanner } from "@/components/CtaBanner";
import { toolCount, toolGroups } from "@/lib/content/integrations";
import { services } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/integrations" },
  title: "Integrations",
  description: "The CRMs, inboxes, AI models, accounting, e-commerce and cloud tools Moonlab connects, and what we do with each one.",
};

const nameOf = (slug: string) => services.find((s) => s.slug === slug)?.name ?? slug;

export default function IntegrationsPage() {
  return (
    <>
      <PageHeader
        eyebrow={`Integrations · ${toolCount} tools`}
        title="We connect the tools you already pay for."
        intro="If a tool has an API, a webhook, an export or just a web page, we can usually connect it. These are the ones we use most."
      />

      <div className="mx-auto grid max-w-6xl gap-10 px-6 pb-24 lg:grid-cols-[200px_1fr]">
        <nav aria-label="Tool categories" className="hidden lg:block">
          <ul className="sticky top-28 space-y-1 text-sm">
            {toolGroups.map((g) => (
              <li key={g.id}>
                <a href={`#${g.id}`} className="flex justify-between rounded-md px-2 py-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-foreground">
                  {g.name}
                  <span className="font-mono text-xs">{g.tools.length}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-12">
          {toolGroups.map((g) => (
            <section key={g.id} id={g.id} className="scroll-mt-28">
              <h2 className="mb-4 text-lg font-semibold">{g.name}</h2>
              <div className="overflow-hidden rounded-2xl border border-border bg-surface/70 backdrop-blur-sm">
                <table className="w-full text-left text-sm">
                  <thead className="hidden sm:table-header-group">
                    <tr className="border-b border-border font-mono text-xs uppercase tracking-wider text-muted">
                      <th className="px-5 py-2.5 font-normal">Tool</th>
                      <th className="px-5 py-2.5 font-normal">What we do with it</th>
                      <th className="px-5 py-2.5 font-normal">Related services</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.tools.map((t) => (
                      <tr key={t.name} className="flex flex-col border-b border-border px-5 py-3.5 last:border-0 sm:table-row sm:p-0">
                        <td className="font-medium sm:w-48 sm:px-5 sm:py-3.5">{t.name}</td>
                        <td className="mt-1 text-muted sm:mt-0 sm:px-5 sm:py-3.5">{t.what}</td>
                        <td className="mt-2 sm:mt-0 sm:px-5 sm:py-3.5">
                          <div className="flex flex-wrap gap-1.5">
                            {t.services.map((s) => (
                              <Link
                                key={s}
                                href={`/services/${s}`}
                                className="rounded-full border border-border px-2 py-0.5 text-[13px] text-muted transition-colors hover:border-accent/40 hover:text-foreground"
                              >
                                {nameOf(s)}
                              </Link>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
          <p className="text-sm text-muted">
            Don&apos;t see yours?{" "}
            <Link href="/contact" className="text-accent hover:underline">
              Ask us
            </Link>{" "}
            and we&apos;ll check it. The free audit covers whether each of your tools can be connected.
          </p>
        </div>
      </div>

      <CtaBanner title="Tell us which tools you use." />
    </>
  );
}
