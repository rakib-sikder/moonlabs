import { PageHeader } from "./PageHeader";

export type LegalSection = { title: string; body: string[] };

/** Plain, readable layout for policy pages: table of contents + numbered sections. */
export function LegalPage({
  title,
  intro,
  updated,
  sections,
}: {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHeader eyebrow={`Last updated ${updated}`} title={title} intro={intro} />
      <div className="mx-auto grid max-w-6xl gap-10 px-6 pb-24 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Sections" className="hidden lg:block">
          <ol className="sticky top-28 space-y-1 text-sm">
            {sections.map((s, i) => (
              <li key={s.title}>
                <a href={`#s${i + 1}`} className="block rounded-md px-2 py-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-foreground">
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="max-w-2xl space-y-10">
          {sections.map((s, i) => (
            <section key={s.title} id={`s${i + 1}`} className="scroll-mt-28">
              <h2 className="text-lg font-semibold">
                <span className="mr-2 font-mono text-sm text-moon">{i + 1}.</span>
                {s.title}
              </h2>
              <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-muted">
                {s.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
