import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The terms that apply to Moonlab projects, monthly plans and the client portal.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of service"
      updated="8 November 2026"
      intro="These terms cover how we work together. Each project also gets a written scope and price that you approve before we start; where the two differ, the signed scope wins."
      sections={[
        {
          title: "Scope and price",
          body: [
            "Every project starts with a written plan: what we'll build, which tools it connects, the timeline and a fixed price.",
            "Work outside the agreed scope is quoted separately before we do it.",
          ],
        },
        {
          title: "Payment",
          body: [
            "One-time projects are invoiced as agreed in the scope. Monthly plans are billed in advance each month.",
            "Third-party costs, such as software subscriptions, ad spend, API usage and hosting, are paid by you directly to the provider unless agreed otherwise.",
          ],
        },
        {
          title: "Ownership",
          body: [
            "Once paid for, the workflows, code, designs and documentation we create for you are yours.",
            "We may reuse general know-how and non-confidential building blocks in other work, but never your data or anything confidential.",
          ],
        },
        {
          title: "Your responsibilities",
          body: [
            "Provide access to the tools involved and a contact who can answer questions.",
            "Make sure you have the right to use the data and accounts you connect, and that automated messages comply with the rules that apply to you.",
          ],
        },
        {
          title: "Monthly plans",
          body: [
            "Monthly plans can be cancelled with 30 days' notice. Everything we built stays in your accounts.",
          ],
        },
        {
          title: "Client portal",
          body: [
            "Portal access is for you and the people you invite. Keep your sign-in private and tell us if you think it has been misused.",
          ],
        },
        {
          title: "Liability",
          body: [
            "We build carefully and test against real examples, with human approval where mistakes would be costly. We can't guarantee third-party services stay available or unchanged, and our liability for any claim is limited to the fees paid for the work in question.",
          ],
        },
      ]}
    />
  );
}
