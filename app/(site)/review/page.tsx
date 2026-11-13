import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ReviewForm } from "@/components/ReviewForm";
import { pageMeta } from "@/lib/seo";

// A page for clients we send the link to, so it stays out of search results.
export const metadata: Metadata = pageMeta(
  "/review",
  "Leave a review",
  "Worked with Moonlab? Tell other businesses how it went. Every review is checked by a person before it appears on the site.",
  undefined,
  { robots: { index: false, follow: true } },
);

export default function ReviewPage() {
  return (
    <>
      <PageHeader
        eyebrow="Clients"
        title="Worked with us? Tell other businesses how it went."
        intro="A few honest sentences help other owners decide. We read every review before it goes on the site, and we never edit what you write."
      />
      <section className="mx-auto max-w-3xl px-6 pb-28">
        <ReviewForm />
      </section>
    </>
  );
}
