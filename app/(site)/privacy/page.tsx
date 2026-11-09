import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  title: "Privacy policy",
  description: "What Moonlab collects through this website and the client portal, why, and how long we keep it.",
};

const contact = site.email ? `email us at ${site.email}` : "use the contact form on this site";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      updated="8 November 2026"
      intro="Short version: we collect only what we need to reply to you and to run your projects, we don't sell it, and you can ask us to delete it."
      sections={[
        {
          title: "What we collect",
          body: [
            "Contact form: your name, email, company (optional), the services you ticked, budget, timeline and message.",
            "Client portal: your email address and sign-in details, and the project information we and your team add, such as projects, automation run logs, requests, files and invoices.",
            "We don't use advertising trackers on this website.",
          ],
        },
        {
          title: "Why we use it",
          body: [
            "To reply to your enquiry and prepare for your free audit.",
            "To deliver and support the work you hire us for, and to bill for it.",
          ],
        },
        {
          title: "Where it's stored",
          body: [
            "Contact form messages are delivered to our team's private messaging channel.",
            "Client portal data is stored on Cloudflare (D1 database, and file storage when used), with access limited to your organisation and our staff.",
            "Automations we build run inside your own accounts wherever possible, so your business data stays with you.",
          ],
        },
        {
          title: "How long we keep it",
          body: [
            "Enquiries that don't become projects are deleted after 12 months.",
            "Client records are kept for as long as we work together and as long as accounting law requires after that.",
          ],
        },
        {
          title: "Sharing",
          body: [
            "We never sell personal data. We share it only with the service providers needed to run this site and the portal, or when the law requires it.",
          ],
        },
        {
          title: "Your rights",
          body: [`You can ask to see, correct or delete your data at any time. To do so, ${contact}.`],
        },
      ]}
    />
  );
}
