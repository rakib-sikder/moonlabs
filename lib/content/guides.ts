// SEO guides shown at /guides. Plain data; rendered by app/(site)/guides.
export type GuideSection = { heading: string; paragraphs: string[]; bullets?: string[] };
export type Guide = {
  slug: string;
  title: string;            // <= 65 chars, includes the main keyword
  description: string;      // meta description, 140-160 chars
  published: string;        // "2026-11-10"
  readMinutes: number;
  keywords: string[];       // 4-6 target phrases
  intro: string[];          // 1-3 paragraphs
  sections: GuideSection[]; // 5-9 sections, H2 headings
  faqs: { q: string; a: string }[];
  services: string[];       // 2-3 service slugs from lib/site.ts
};

export const guides: Guide[] = [
  // ---------------------------------------------------------------------------
  {
    slug: "ai-automation-for-small-business",
    title: "AI Automation for Small Business: Where to Start in 2026",
    description:
      "What AI automation can do for a small business in practice, the jobs it handles well, what to keep a person on, how to pick a first task and judge payback.",
    published: "2026-11-13",
    readMinutes: 7,
    keywords: [
      "ai automation for small business",
      "small business automation",
      "automation for small business",
      "ai automation agency",
      "ai automation agency services",
    ],
    intro: [
      "Most talk about AI is aimed at large companies with IT teams. If you run a business with 2 to 50 people, the useful question is simpler: which of the jobs your team does every week could a machine do, and which should it stay away from? This guide answers that for AI automation for small business, in plain terms and without the hype.",
      "It covers what AI automation actually is, the jobs it does well with a short example of each, what it should not be trusted with, how to pick your first task, when to hire an AI automation agency and when to do it yourself, and a simple sum for checking whether it pays back. All examples are made up to show how things work. They are not client stories.",
    ],
    sections: [
      {
        heading: "What AI automation for small business actually means",
        paragraphs: [
          "Most small business automation is made of plain rules: when a form is filled in, add the person to a spreadsheet and send a reply. Rules are fast, cheap and predictable. They have been around for years and they still do most of the work.",
          "The AI part is one step inside those rules, used only where text has to be read or written. A rule cannot tell whether an email is a complaint, a quote request or spam. An AI model can read it and sort it. A rule cannot write a reply that fits the question. An AI model can draft one. So a typical automation looks like this: a trigger, a few rule steps, one AI step that reads or writes, then more rule steps that file the result or pass it to a person.",
          "Thinking of it this way keeps costs down and mistakes visible. If a step can be done with a rule, use a rule. Save AI for the parts that need judgment about words.",
        ],
      },
      {
        heading: "Jobs small business automation does well",
        paragraphs: [
          "These are the tasks where automation for small business tends to fit best: they happen often, they follow a pattern, and a mistake is easy to spot and fix. Each example below is hypothetical.",
        ],
        bullets: [
          "Answering enquiries. A plumbing company gets questions through its website form at all hours. The automation reads each message, answers common questions about service areas and opening times, and books a callback for anything else.",
          "Sorting email. A small accounting office has one shared inbox. Each new email is read, tagged as client question, new client, invoice or spam, and moved to the right folder or person.",
          "Invoice chasing. A cleaning company sends invoices from its accounting tool. When one is 7 days overdue, the automation sends a polite reminder, and at 21 days it alerts the owner instead of sending another.",
          "Data entry. A dental clinic receives patient forms as PDFs. The automation pulls out the name, phone number and appointment date and adds them to the booking sheet for staff to check.",
          "Follow-ups. A landscaping firm sends quotes by email. If there is no reply after 3 days, the customer gets a short follow-up written to match the original quote.",
          "Review requests. A hair salon sends a message the day after each appointment asking happy customers for a review, with a link to its Google listing.",
          "Reports. A small online shop gets a short summary every Monday morning: orders, refunds and the questions customers asked most last week.",
        ],
      },
      {
        heading: "What it should not be trusted with",
        paragraphs: [
          "AI models can write confident text that is wrong. That is fine when a person reads it before it matters, and a problem when nobody does. Some jobs should keep a person in charge, whatever the tool claims.",
        ],
        bullets: [
          "Anything legal. Contracts, terms, disputes, employment decisions and compliance answers need a qualified person. An automation can collect the documents, but it should not give the advice.",
          "Moving money without approval. Paying bills, issuing refunds and changing bank details should always wait for a person to click approve. An automation can prepare the payment and ask, not send it on its own.",
          "Sensitive data without masking. Health details, card numbers, social security numbers and similar data should be removed or masked before any text goes to an AI model, and only kept in tools that are meant to hold it.",
          "Replies that make promises. Discounts, delivery dates and refunds offered by an AI step without a rule behind them can cost you. Limit what it is allowed to say.",
        ],
      },
      {
        heading: "How to pick your first automation for small business",
        paragraphs: [
          "Start small. The first project should be quick to build, easy to check and obviously useful, so you can see whether automation suits your business before spending more.",
          "A good first task passes three tests. If it fails one, pick another.",
          "Write the task down as steps before anyone builds anything. If you cannot describe it as \"when this happens, do that\", it is not ready to automate yet.",
        ],
        bullets: [
          "Frequent. It happens many times a week, not a few times a year. More runs means more time saved.",
          "Repetitive. It looks roughly the same each time. The same form, the same kind of email, the same report.",
          "Clear rules. You can explain to a new hire exactly what to do, including what to do when something looks odd.",
        ],
      },
      {
        heading: "AI automation agency services vs doing it yourself",
        paragraphs: [
          "You can build simple automations yourself with tools such as Zapier, Make or n8n. If the task is one connection between two tools you already use, and you enjoy setting things up, this is often the right call.",
          "An AI automation agency earns its fee when the task connects several tools, involves an AI step that needs testing, or has to keep working while you are busy running the business. Typical AI automation agency services include working out which tasks are worth automating, building and testing the workflow, setting limits on what the AI step can do, handling errors, and watching the automation after launch so a broken connection is noticed and fixed.",
          "The question to ask yourself is not \"can I build it?\" but \"who will fix it when it breaks in six months?\" If the answer is nobody, either keep it very simple or pay someone to own it.",
        ],
      },
      {
        heading: "A simple way to judge payback",
        paragraphs: [
          "Use one sum. Hours saved per week, multiplied by what an hour of that person's time costs you, gives the weekly saving. Multiply by 52 for the year. Then compare it with the build cost plus a year of running costs, such as tool subscriptions and AI usage fees. Check those on each vendor's own pricing page, because they vary by plan and volume.",
          "A made-up example: sorting the shared inbox takes 4 hours a week, and the automation removes 3 of them because 1 hour of checking remains. If that person's time costs you $20 an hour, the saving is 3 x $20 = $60 a week, or $3,120 a year. A one-time build from $99 would pay for itself in about two weeks of savings, before tool fees.",
          "If the number is clearly positive after running costs, go ahead. If it only works when every guess goes your way, pick a different task.",
        ],
      },
      {
        heading: "How Moonlab works",
        paragraphs: [
          "Moonlab is an AI automation agency for small businesses. Every project starts with a free 30-minute audit. We look at how your team spends its week, point out the tasks worth automating, and tell you plainly if something is not worth it.",
          "The price is fixed and agreed before any work starts. A single automation starts from $99 as a one-time project. The monthly plan is $199 per month for up to 2 new automations a month, with monitoring included, and there is a larger plan at $399 per month. Details are at /pricing.",
          "Everything is built in your own accounts, so you keep the automations if we stop working together. Risky steps, such as anything that sends money or makes a promise to a customer, wait for a person on your team to approve them.",
          "Book the audit at /contact. Related services: sales and lead follow-up at /services/sales-and-leads, customer support at /services/customer-support, and operations at /services/operations.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is AI automation for small business?",
        a: "It is a set of rules that runs routine tasks for you, such as filing form entries or sending reminders, with an AI step added only where text has to be read or written, for example sorting an email or drafting a reply.",
      },
      {
        q: "Which small business automation should I start with?",
        a: "Pick a task that happens many times a week, looks the same each time and has clear rules. Common first choices are answering enquiries, sorting a shared inbox, chasing overdue invoices and asking for reviews.",
      },
      {
        q: "Is automation for small business safe with customer data?",
        a: "It can be, if it is set up with care. Sensitive data should be masked before it reaches an AI model, automations should run in your own accounts, and anything that moves money should wait for a person to approve it.",
      },
      {
        q: "What do AI automation agency services include?",
        a: "Usually an audit of which tasks are worth automating, building and testing the workflow, limits on what the AI step can do, error handling, and monitoring after launch. At Moonlab the audit is free and takes 30 minutes.",
      },
      {
        q: "How much does an AI automation agency cost?",
        a: "It varies by agency and by task. At Moonlab a single automation starts from $99 one-time, the monthly plan is $199 per month for up to 2 new automations a month with monitoring, and a larger plan is $399 per month. The price is fixed before work starts.",
      },
    ],
    services: ["sales-and-leads", "customer-support", "operations"],
  },
  // ---------------------------------------------------------------------------
  {
  slug: "n8n-automation-agency",
  title: "n8n Automation Agency: What We Build and How It Works",
  description:
    "What an n8n automation agency builds, when n8n is the right tool, self-hosted vs hosted trade-offs and what to ask before you hire an n8n expert.",
  published: "2026-11-13",
  readMinutes: 7,
  keywords: [
    "n8n automation agency",
    "n8n automation",
    "n8n ai automation",
    "n8n workflow automation",
    "hire an n8n expert",
  ],
  intro: [
    "You have heard that n8n can take repetitive work off your team, and you are now deciding whether to build it yourself or hire an n8n automation agency. This guide is for business owners and operations leads in that position.",
    "It explains what n8n is in plain terms, when it is the right tool and when Zapier, Make or custom code is a better fit, the kind of n8n automation an agency usually builds, the trade-offs of self-hosting, and what good work from an agency looks like. It ends with the questions to ask before you hire an n8n expert and how we work at Moonlab.",
    "One note before we start. n8n's prices, plans and licence terms change, so we do not quote them here. Check n8n's own site for the current details.",
  ],
  sections: [
    {
      heading: "What n8n is, in plain terms",
      paragraphs: [
        "n8n is a workflow tool. You connect the apps your business already uses, such as your forms, inbox, CRM, accounting tool and spreadsheets, and tell it what to do when something happens. A new form entry arrives, so it adds the lead to the CRM and sends a reply. An invoice lands in an inbox, so it reads the details and records them.",
        "You build these workflows in a visual editor by placing steps on a canvas and joining them up. When the built-in steps are not enough, you can add a code step to reshape data or handle a case the standard steps do not cover. That mix of visual steps and code is the main reason technical teams like it.",
        "n8n can be used two ways. You can use it as a hosted service, where n8n runs it for you, or you can self-host it on your own server. The workflows look the same either way. What changes is who looks after the server and where your data sits.",
      ],
    },
    {
      heading: "When n8n automation is the right pick, and when it is not",
      paragraphs: [
        "n8n is a good tool, but it is not the right answer for every job. A good agency will tell you when something else fits better. We cover the full comparison in /guides/zapier-vs-make-vs-n8n. The short version is below.",
      ],
      bullets: [
        "Choose n8n when you want the workflows and their data on your own server, when the logic branches or needs small pieces of code, or when you expect to add AI steps and want control over how they run.",
        "Choose Zapier when the workflow is short and linear, uses popular apps, and will be looked after by someone on your team who is not technical.",
        "Choose Make when you want a hosted visual canvas for workflows with several branches or a lot of data reshaping, and you do not need to self-host.",
        "Choose custom code when the process is central to the business, runs at high volume, handles very sensitive data, or needs a system that no workflow tool connects to well.",
      ],
    },
    {
      heading: "What an n8n automation agency typically builds",
      paragraphs: [
        "Most n8n workflow automation projects fall into a few familiar types. The examples below are hypothetical, to show the shape of the work rather than a real client.",
      ],
      bullets: [
        "Lead capture and instant reply. A cleaning company gets leads from its website form and two directories. The workflow collects each lead in one place, adds it to the CRM, sends the customer a reply within a minute and alerts the owner on their phone.",
        "CRM sync. A small agency keeps clients in one CRM and projects in a separate tool. When a deal is marked won, the workflow creates the project, copies the contact details and keeps both records matched when either one changes.",
        "Invoice and document processing with an AI step. A wholesaler receives supplier invoices as PDFs by email. The workflow pulls each attachment, uses an AI step to read the supplier, date, amount and line items, checks them against simple rules and adds them to the accounting tool. Anything that fails a check goes to a person for review.",
        "Support email triage. An online shop gets a mix of order questions, returns and complaints in one inbox. An AI step sorts each email by type and urgency, adds a label, drafts a reply for common questions and sends urgent ones to the right person straight away.",
        "Weekly reports. A service business wants Monday numbers without someone building a spreadsheet by hand. The workflow pulls bookings, revenue and open tickets from three tools every Monday morning and sends a short summary to the owner by email.",
      ],
    },
    {
      heading: "n8n AI automation: where the AI step helps",
      paragraphs: [
        "Two of the examples above use AI, and that is where n8n AI automation is most useful: reading free text that a fixed rule cannot handle, such as an email, a PDF or a customer message. The AI step turns that text into structured data or a draft, and the rest of the workflow follows normal rules.",
        "AI steps need more care than rule-based ones. They can give a wrong answer with full confidence, they add a usage fee from the AI provider, and they need testing on real examples before they touch customers. A sound design checks the AI output against simple rules and sends anything unclear to a person. If a fixed rule can do the job, use the rule.",
      ],
    },
    {
      heading: "Self-hosted vs hosted n8n",
      paragraphs: [
        "This choice matters more with n8n than with most tools, because self-hosting is a real option. Neither choice is right for everyone.",
      ],
      bullets: [
        "Data control. Self-hosting keeps workflow data on a server you control, which helps when you handle personal, health or financial records. With the hosted service, your data passes through n8n's infrastructure, so read their terms on where it is stored and processed.",
        "Maintenance. A self-hosted server needs backups, monitoring, disk space checks and a plan for when it goes down. The hosted service handles that for you.",
        "Who patches it. n8n releases updates, some of them security fixes. On the hosted service n8n applies them. On your own server someone has to apply them, test that your workflows still run afterwards and roll back if they do not. Agree in writing who that person is.",
        "Cost. Hosted pricing and self-hosting costs are structured differently. For self-hosting, count the server and the time to look after it, not only the licence. Check n8n's site for current terms.",
      ],
    },
    {
      heading: "What to expect from an n8n automation agency",
      paragraphs: [
        "Building a workflow that runs once in a demo is the easy part. What you are paying an agency for is a workflow that keeps running, tells someone when it fails, and that you can still own if the agency is gone. Expect these as standard.",
      ],
      bullets: [
        "Scoping first. A written description of each workflow, what starts it, what it does, what it should do with unusual cases and how you will know it works, agreed before building starts.",
        "Built in your own accounts. The n8n instance, the app connections and the API keys belong to your business, not to the agency or to one employee's personal login.",
        "Error alerts. When a run fails, a named person gets a message with enough detail to act on it. A check that the workflow is still running at all, because a stopped workflow sends no errors.",
        "Documentation. A short plain-language note per workflow covering its purpose, trigger, connected accounts, known limits and owner.",
        "Handover. A walkthrough with your team, access to everything, and a clear answer on what support looks like after delivery and what changes cost.",
      ],
    },
    {
      heading: "Questions to ask before you hire an n8n expert",
      paragraphs: [
        "Whether you hire an n8n expert as a freelancer or an agency, these questions sort careful builders from the rest. Good answers are specific. Vague answers are a warning.",
      ],
      bullets: [
        "Would you use n8n for this, or is another tool or custom code a better fit? Why?",
        "Should we self-host or use the hosted service, and who will update and back up the server if we self-host?",
        "Whose accounts will everything run in, and what do we keep if we stop working together?",
        "How will we find out when a workflow fails, and how quickly will you respond?",
        "What happens to a case the workflow cannot handle?",
        "How will you test it before it touches real customers or real data?",
        "Is the price fixed, what does it include, and which tool or AI usage fees will we pay on top?",
      ],
    },
    {
      heading: "How Moonlab works",
      paragraphs: [
        "Moonlab builds automations in n8n, Make, Zapier and custom code. Every project starts with a free 30-minute audit. We look at the task, tell you whether it is worth automating and which tool we would use, and agree a fixed price before any work starts. A single automation starts from $99 as a one-time project, and there are monthly plans at $199 and $399 per month for ongoing work and monitoring.",
        "We do not start from n8n and look for a use for it. Our rule is this: \"We pick the simplest tool that will still be reliable in a year. That means no-code where it fits and custom code where it doesn't.\" If n8n is the right tool, we build it in your accounts with alerts and documentation and hand it over. If something simpler will do, we will say so.",
        "Book an audit at /contact. Related services: operations automation at /services/operations, custom builds at /services/custom-build, and web apps and SaaS at /services/web-apps-and-saas.",
      ],
    },
  ],
  faqs: [
    {
      q: "What does an n8n automation agency do?",
      a: "It scopes, builds, tests and hands over workflows in n8n that connect your business tools and run tasks automatically, such as replying to leads, syncing a CRM, reading invoices or sending weekly reports. A good agency also sets up error alerts, writes documentation and builds everything in your own accounts.",
    },
    {
      q: "Should I self-host n8n or use the hosted version?",
      a: "Self-host if you need the data on a server you control and you have someone who will back it up, monitor it and apply updates. Use the hosted service if you would rather not look after a server. Check n8n's site for current pricing and terms for each option.",
    },
    {
      q: "Is n8n better than Zapier or Make?",
      a: "Not in general. n8n suits branching workflows, code steps and teams that want to self-host. Zapier suits short, simple workflows run by non-technical staff, and Make suits complex flows on a hosted canvas. The right choice depends on the workflow, the data and who will maintain it.",
    },
    {
      q: "Can n8n handle AI automation?",
      a: "Yes. n8n AI automation usually means adding an AI step that reads an email, PDF or message and turns it into structured data or a draft reply. Those steps need testing, checks on the output and a route to a person for unclear cases, and the AI provider charges for usage.",
    },
    {
      q: "How much does it cost to hire an n8n expert?",
      a: "It depends on the number of tools, the state of the data, any AI steps and how many exceptions need a person. At Moonlab a single automation starts from $99 as a one-time project, and you get a fixed price after a free 30-minute audit. n8n's own fees are separate, so check its site.",
    },
  ],
  services: ["operations", "custom-build", "web-apps-and-saas"],
  },
  // ---------------------------------------------------------------------------
  {
  slug: "invoice-automation-small-business",
  title: "Invoice Automation for Small Business: A Practical Guide",
  description:
    "How invoice automation works for a small business: sending invoices, polite reminders, reading supplier bills with AI, where a person checks and how to start.",
  published: "2026-11-13",
  readMinutes: 7,
  keywords: [
    "invoice automation",
    "invoice processing automation",
    "invoice automation software",
    "automate invoice reminders",
    "accounts payable automation small business",
  ],
  intro: [
    "In many small businesses, invoices are still handled by hand. Someone copies job details into an invoice, emails it, remembers (or forgets) to chase it, and later checks the bank to mark it paid. On the other side, supplier bills arrive as PDFs and emails, and someone types each one into the books. Invoice automation takes over the repetitive parts of that work and leaves the decisions with you.",
    "This guide is for owners and bookkeepers in the US and in Bangladesh who create, send, chase and receive invoices themselves. It covers both sides: money coming in from customers and money going out to suppliers. It explains what each step looks like when automated, where a person must stay in the loop, the mistakes that cause real problems, and how to start with one small piece instead of rebuilding everything at once.",
  ],
  sections: [
    {
      heading: "What invoice automation covers",
      paragraphs: [
        "Invoice automation is a set of small workflows, not one big system. Each workflow watches for an event, such as a job being marked done or a supplier email arriving, and then does a fixed set of steps in the tools you already use.",
        "It helps to split the work into two sides, because the risks are different. On the money in side, the main risk is sending the wrong thing to a customer. On the money out side, the main risk is paying the wrong amount, or paying twice. A good setup handles the routine cases on its own and sends anything unusual to a person.",
      ],
      bullets: [
        "Money in: creating invoices from finished jobs or orders, sending them, reminding customers when payment is late, marking invoices paid, and giving you a weekly list of what is overdue.",
        "Money out: reading supplier invoices, pulling out the key details, checking them against what you expected to pay, filing them into your accounting tool, and flagging only the ones that do not match.",
      ],
    },
    {
      heading: "Money in: from finished job to paid invoice",
      paragraphs: [
        "The starting point is whatever already tells you a job is finished. That might be a row in a Google Sheet, a status in a job tracker, a completed order in an online shop, or a delivery note. The automation reads that event and builds the invoice from it, so nobody has to retype the customer name, the items or the price.",
        "The invoice is created in your accounting tool (for example QuickBooks, Xero or Tally) or from a template you already use, then sent from your own email address. When a payment lands, the automation matches it to the right invoice and marks it paid. Once a week, you get one short list of every invoice that is still unpaid, how many days late it is, and what reminders have already gone out.",
      ],
      bullets: [
        "Trigger: a job or order is marked complete in the place your team already records it.",
        "Create: the invoice is built from the job details, with the correct customer, items, price, tax and due date.",
        "Send: the invoice goes out from your own email account, with a short, plain message.",
        "Mark paid: when a matching payment arrives, the invoice is marked paid and reminders stop.",
        "Report: a weekly overdue list goes to the owner or bookkeeper, sorted by amount and days late.",
      ],
    },
    {
      heading: "How to automate invoice reminders without annoying customers",
      paragraphs: [
        "Most late payments are not refusals. The customer forgot, the email got buried, or the invoice is waiting for someone to approve it. A polite reminder at a set point usually solves it. When you automate invoice reminders, the schedule stays the same every time, which is fairer to customers than chasing only when someone happens to remember.",
        "A simple schedule works well: a friendly note a few days before the due date, a reminder on the due date, then reminders at set days overdue, such as 7 and 14 days. After that, the automation stops and a person decides what happens next. The most important rule is that every reminder checks the payment status right before it is sent. A reminder to a customer who paid yesterday does more damage than no reminder at all.",
      ],
      bullets: [
        "Keep the wording polite and short, with the invoice number, amount, due date and how to pay.",
        "Check payment status immediately before each send, not only when the schedule was set.",
        "Let a person pause reminders for one customer, for example during a dispute or a payment plan.",
        "Stop after the last scheduled reminder and hand the case to a person instead of escalating the tone automatically.",
      ],
    },
    {
      heading: "Money out: invoice processing automation for supplier bills",
      paragraphs: [
        "Supplier invoices arrive in many shapes: a PDF attached to an email, a link to download, a photo of a paper bill, or the details typed into the email itself. This is where invoice processing automation earns its keep, because reading and typing these is slow and easy to get wrong.",
        "An AI step reads each invoice and pulls out the supplier name, invoice number, invoice date, total and tax. Those details are then checked against what you expected to pay, such as a purchase order or an agreed monthly amount. If everything matches, the invoice is filed into your accounting tool as a bill, with the original document attached. If anything does not match, it goes to a person with a short note saying what is different. That is the core of accounts payable automation for a small business: the routine bills are handled, and your attention goes only to the ones that need it.",
      ],
      bullets: [
        "Collect: supplier invoices sent to one inbox address are picked up automatically.",
        "Read: an AI step extracts supplier, invoice number, date, total and tax from the PDF or email.",
        "Check: the details are compared with the purchase order or expected amount, and with past invoices to catch duplicates.",
        "File: matching invoices are entered as bills in your accounting tool with the original attached.",
        "Flag: mismatches, unreadable documents and new suppliers go to a person, with the reason stated.",
      ],
    },
    {
      heading: "Where a person must stay in the loop",
      paragraphs: [
        "Automation should prepare decisions about money, not make all of them. AI reading is good but not perfect, and a wrong total on a supplier bill is a real cost. Set clear points where the workflow stops and waits for a named person.",
        "These checks do not slow things down much, because the automation has already done the reading, matching and filing. The person only has to look at the cases that are flagged and press approve or reject.",
      ],
      bullets: [
        "Approving payments. The automation can prepare a payment list, but a person approves it before money leaves the account.",
        "Disputes. If a customer questions an invoice or a supplier bill looks wrong, reminders pause and a person handles it.",
        "Anything over a set amount. Pick a limit that suits your business, and route every invoice above it to a person, even when it matches.",
        "New suppliers and changed bank details. These are common routes for fraud, so they should always be confirmed by a person directly with the supplier.",
        "Documents the AI could not read with confidence. These should be flagged, not guessed.",
      ],
    },
    {
      heading: "Common mistakes with invoice automation",
      paragraphs: [
        "Most problems come from how the workflow was designed, not from the tools. These are the ones to watch for.",
      ],
      bullets: [
        "No exception handling. The workflow assumes every invoice is normal. When one is missing a total or has a new supplier, it either fails without telling anyone or files bad data. Every step needs a rule for what happens when something is off, and a person who gets told.",
        "Duplicate invoices. A supplier resends the same invoice, or a job is marked done twice, and it gets entered or sent twice. Check the invoice number, supplier and amount against what is already recorded before creating anything.",
        "Reminders sent to customers who already paid. This happens when reminders are scheduled once and never recheck payment status. It annoys good customers and makes the business look careless.",
        "No audit trail. If you cannot see what the automation did, when and why, you cannot answer a customer, a supplier or your accountant. Keep a simple log of every invoice created, sent, filed, flagged and approved.",
        "Automating before the process is clear. If nobody agrees on when a job counts as finished, the automation cannot know either. Settle the rule first.",
      ],
    },
    {
      heading: "How to start small, and whether you need new invoice automation software",
      paragraphs: [
        "You do not need to replace your accounting tool or buy new invoice automation software to start. Most of this can be built on top of the tools you already use, connected with an automation platform or a small custom script. Pick one piece that happens often and is clearly defined, get it working, and then add the next.",
        "Good first projects are the weekly overdue list, or automated reminders with a payment check before each send. Both are low risk, because they inform people rather than move money. Supplier invoice reading is a good second step, run in a review mode first where a person checks every result for a few weeks before anything is filed automatically.",
        "Here is a made-up example to show how to size the work. Say you send 60 invoices a month and each one takes 5 minutes to create and send by hand. That is 60 x 5 = 300 minutes, or 5 hours a month. Say 15 of them need chasing, at 10 minutes each for checking and writing the email. That is 15 x 10 = 150 minutes, or 2.5 hours. Together that is 7.5 hours a month on money in alone. Use your own counts and times; the point is to know the number before you decide what to automate first.",
      ],
    },
    {
      heading: "How Moonlab builds invoice automation",
      paragraphs: [
        "We start with a free 30-minute audit. You show us how invoices move through your business today, and we tell you which part is worth automating first, what the checks should be, and where a person needs to stay in the loop. If a step is not worth automating, we will say so.",
        "Before any work starts, we agree a fixed price. A single automation starts from $99 one-time, and there are monthly plans at $199 and $399 a month if you want several workflows built over time with monitoring included. Everything is built in your own accounting and email accounts, so the invoices, the logs and the automation stay with you. Book the audit at /contact.",
        "Related services: finance and HR automation at /services/finance-and-hr, operations automation at /services/operations, and custom builds at /services/custom-build.",
      ],
    },
  ],
  faqs: [
    {
      q: "What is invoice automation?",
      a: "Invoice automation means using software to handle the repetitive parts of invoicing: creating invoices from finished jobs, sending them, reminding late payers, marking them paid, and reading and filing supplier bills. A person still approves payments and handles anything unusual.",
    },
    {
      q: "Do I need new invoice automation software?",
      a: "Usually not. Most workflows can be built on top of your existing accounting tool (for example QuickBooks, Xero or Tally) and your email account, connected by an automation platform or a small custom script. Start with what you already use.",
    },
    {
      q: "How do I automate invoice reminders without upsetting customers?",
      a: "Use a fixed, polite schedule, such as a note before the due date, one on the due date and reminders at 7 and 14 days overdue. Check payment status right before each reminder is sent, let a person pause reminders for a customer, and stop after the last one so a person decides what comes next.",
    },
    {
      q: "How accurate is AI invoice processing automation?",
      a: "AI reading of supplier invoices works well on clear documents but is not perfect. That is why each result should be checked against a purchase order or expected amount, and why anything that does not match, or that the AI could not read with confidence, goes to a person instead of being filed.",
    },
    {
      q: "Is accounts payable automation safe for a small business?",
      a: "It is safe when payments are approved by a person, invoices above a set amount are always reviewed, new suppliers and changed bank details are confirmed directly, duplicates are checked, and every action is logged. The automation prepares the work; a person releases the money.",
    },
  ],
  services: ["finance-and-hr", "operations", "custom-build"],
  },
  // ---------------------------------------------------------------------------
  {
    slug: "choose-software-company-bangladesh",
    title: "How to Choose a Software Company in Bangladesh: A Buyer's Guide",
    description:
      "How to choose a software company in Bangladesh: types of firms, what to check before hiring, red flags, pricing models and why a short paid pilot beats lists.",
    published: "2026-11-13",
    readMinutes: 7,
    keywords: [
      "software company in bangladesh",
      "best software company in bangladesh",
      "software development company bangladesh",
      "business automation bangladesh",
      "web development company in dhaka",
    ],
    intro: [
      "Picking a software company in Bangladesh is easy to start and hard to get right. There are large outsourcing firms, product companies, small agencies and thousands of freelancers, and almost all of them have a nice website. The difference shows up later: when the project runs late, when you want to change something after launch, or when you find out the code and the hosting account are not in your name.",
      "This guide is for business owners in Bangladesh and for foreign companies outsourcing work here. It covers the kinds of companies you will meet and when each one fits, what to check before you hire a software development company in Bangladesh, the red flags, how pricing models work, and why a short paid pilot tells you more than any ranking list.",
    ],
    sections: [
      {
        heading: "The kinds of software companies in Bangladesh",
        paragraphs: [
          "Not every project needs the same kind of team. Matching the company to the size and risk of the work matters more than finding the biggest name.",
        ],
        bullets: [
          "Large outsourcing firms: many developers, formal processes and experience with foreign clients. They fit long projects with a big budget and a clear specification. Small jobs can get a junior team and slow replies.",
          "Product companies: they build and sell their own software, such as accounting, school or HR systems. They fit when a ready product already does most of what you need. Custom changes are usually limited or slow.",
          "Small agencies: a handful of people who handle design, build and support together. They fit websites, web apps and business automation where you want to talk directly to the people doing the work. Check that they are not stretched across too many clients.",
          "Freelancers: one person, often skilled, usually cheaper. They fit small, well-defined tasks. The risk is continuity: if that one person gets busy or disappears, nobody else knows the system.",
        ],
      },
      {
        heading: "What to check before you hire a software development company in Bangladesh",
        paragraphs: [
          "A short checklist catches most problems before you sign anything. Ask for each item in writing, not just on a call.",
        ],
        bullets: [
          "A real portfolio you can click: live websites and apps, not only screenshots or design mockups. Ask which part they built.",
          "People you can talk to: you should meet the person who will actually build or manage your project, not only a salesperson.",
          "Who owns the code and accounts: the domain, hosting, code repository, app store listing and any paid tools should be in your name, with the company added as a user.",
          "A written fixed scope and price: what is included, what is not, the timeline and what happens if you want changes.",
          "Support after launch: how bugs are reported, how fast they respond and what ongoing changes cost.",
          "Payments and messaging, if relevant: ask if they have connected bKash, Nagad or card payments before, and SMS or WhatsApp messages, and which official providers they used.",
          "Data security: where customer data is stored, who has access, how passwords and API keys are handled and what happens to their access when the project ends.",
        ],
      },
      {
        heading: "Red flags to walk away from",
        paragraphs: [
          "Some warning signs are easy to spot once you know them. One on its own can be a misunderstanding. Two or three together usually mean trouble.",
        ],
        bullets: [
          "No written scope. If everything is agreed on a phone call or in Messenger, every disagreement later becomes your word against theirs.",
          "Code and hosting kept on their accounts. This makes it hard to leave, and you may have to rebuild from scratch if the relationship ends badly.",
          "Vague timelines like 'very soon' or 'within a few weeks' with no milestones you can check.",
          "'Lifetime' promises, such as lifetime free support or lifetime hosting for a one-time fee. Nobody can run servers and fix bugs forever for free, so the promise usually ends quietly.",
          "A full payment upfront for a large project, with nothing delivered until the end.",
          "They agree to everything. A good team tells you when an idea is not worth building.",
        ],
      },
      {
        heading: "Pricing models: fixed price, monthly and hourly",
        paragraphs: [
          "Most companies use one of three models, and each fits a different kind of work. Ask which model a quote uses before you compare two quotes, because the numbers are not comparable otherwise.",
          "Fixed price means one agreed price for a defined scope. It fits websites, single automations and apps where the requirements are clear. It protects your budget, but it only works if the scope is written down properly, and changes outside it are priced separately.",
          "Monthly means a set fee for ongoing work, such as maintenance, small changes, monitoring and new automations over time. It fits businesses that keep improving their systems instead of building once and stopping.",
          "Hourly means you pay for the time spent. It fits open-ended work where nobody can define the scope yet, such as investigating an old system. Ask for a weekly report of hours and a cap, or the bill can grow without anyone noticing.",
        ],
      },
      {
        heading: "Why 'best software company in Bangladesh' lists are not a good way to choose",
        paragraphs: [
          "Searching for the best software company in Bangladesh gives you plenty of ranked lists. Many are written by the companies themselves, by sites that sell placements, or by people who have never worked with the firms they rank. Even an honest list cannot tell you whether a company fits your project, your budget and the way you like to work.",
          "A better approach takes a few weeks and costs little. Shortlist two or three companies from referrals and portfolios you can actually click. Ask each one for references, meaning past clients you can contact yourself, and ask those clients what went wrong and how it was handled. Then give your top choice a short paid pilot: one small, real piece of the project with a fixed price. You learn how they communicate, how they handle feedback and whether they deliver on time, before you commit to the full build.",
        ],
      },
      {
        heading: "Business automation in Bangladesh: what to ask a web development company in Dhaka",
        paragraphs: [
          "Many businesses here do not need a large custom system. They need business automation: order updates sent automatically, leads put into a sheet and assigned, invoices and reminders generated without someone typing them. If that is your goal, ask a web development company in Dhaka whether they build automation as a core service or only as an add-on to websites.",
          "Ask them to describe one workflow they have automated, step by step, and what happens when it fails. A team that has run automations in production will talk about alerts, retries and who gets notified. For examples of what can be automated on WhatsApp, read /guides/whatsapp-automation-for-business-bangladesh.",
        ],
      },
      {
        heading: "How Moonlab works",
        paragraphs: [
          "Moonlab is a software and automation company with an office in Dhaka at H-152/K, 3rd Floor, Green Road, Kalabagan. We work with clients in Bangladesh and the US. Automation is our core focus, and we also build websites, web apps and mobile apps.",
          "Every project starts with a free 30-minute audit, where we look at how your work actually runs and tell you what is worth building and what is not. If you go ahead, we agree a fixed price before any work starts. Everything is built in your own accounts, so the code, hosting and tools belong to you from day one.",
          "For reference, a single automation starts from $99 one-time, and ongoing plans are $199 a month and $399 a month. You can read more about the team at /about, or book your free audit at /contact.",
        ],
      },
    ],
    faqs: [
      {
        q: "How do I find a reliable software company in Bangladesh?",
        a: "Shortlist two or three companies from referrals and portfolios you can click, speak to past clients yourself, and start with a short paid pilot. Check that the scope and price are written down and that the code and accounts will be in your name.",
      },
      {
        q: "Which is the best software company in Bangladesh?",
        a: "There is no single answer, because the right company depends on your project size, budget and how you like to work. Ranked lists are often paid or self-written. A small paid pilot and real references tell you more than any list.",
      },
      {
        q: "Should I hire a freelancer or a software development company in Bangladesh?",
        a: "A freelancer can suit a small, clearly defined task. For a system your business depends on, a company is usually safer, because more than one person knows the work and support continues if someone leaves.",
      },
      {
        q: "Who should own the code and hosting after the project?",
        a: "You should. Ask for the domain, hosting, code repository and any paid tools to be set up in your own accounts, with the company added as a user. That way you can change teams later without starting over.",
      },
      {
        q: "Can a web development company in Dhaka work with clients outside Bangladesh?",
        a: "Yes. Many teams in Dhaka work with foreign clients over video calls, shared project boards and written updates. Agree on meeting times that suit both time zones, and keep the scope, price and milestones in writing.",
      },
    ],
    services: ["web-development", "web-apps-and-saas", "operations"],
  },
  // ---------------------------------------------------------------------------
  {
    slug: "business-automation-cost",
    title: "How Much Does Business Automation Cost? A Plain Pricing Guide",
    description:
      "What drives the cost of business automation, the three ways it is sold, the running costs people forget and a simple sum to check whether it pays back.",
    published: "2026-11-13",
    readMinutes: 7,
    keywords: [
      "business automation cost",
      "how much does automation cost",
      "automation agency pricing",
      "workflow automation pricing",
      "automation return on investment",
    ],
    intro: [
      "The honest answer to \"how much does automation cost?\" is that it depends on what you are automating. That answer is not much use when you are trying to decide whether to spend the money, so this guide breaks it down into parts you can check for your own business.",
      "It covers what makes a project cheap or expensive, the three ways automation is usually sold, the running costs that are easy to miss, a simple sum for working out whether it pays back, and the questions to ask an agency before you sign. It is written for owners of small and mid-sized businesses, whether you are in the US or in Bangladesh.",
    ],
    sections: [
      {
        heading: "What drives the cost of an automation",
        paragraphs: [
          "Two automations that sound similar can take very different amounts of work. The price follows the work, and the work mostly comes from four things.",
          "A useful rule: the more clearly you can describe the task as \"when this happens, do that\", the cheaper it is to build. Every \"it depends\" in your description adds time.",
        ],
        bullets: [
          "How many tools are connected. Moving a form entry into a Google Sheet is one connection. Moving it into a sheet, a CRM, an accounting tool and a WhatsApp message is four, and each one has to be set up, tested and kept working.",
          "How messy the data is. If phone numbers are typed in five formats, customer names are spelled differently in each system, or half the rows have blanks, the automation needs cleaning steps before it can do anything useful.",
          "Whether AI is involved. Rule-based steps are predictable and quick to test. Steps where an AI model reads an email, sorts a request or drafts a reply need more testing, a check for wrong answers, and they add a usage fee.",
          "How many exceptions need a human. Refunds over a limit, VIP customers, orders with missing details. Each exception needs a rule for when the automation stops and who it hands the case to.",
        ],
      },
      {
        heading: "The three ways automation is sold",
        paragraphs: [
          "Most agencies and freelancers sell automation in one of three ways. None of them is wrong. Each one moves the risk to a different place.",
          "Moonlab uses the first two. A single automation starts from $99 as a one-time project. The monthly plan is $199 per month, which covers up to 2 new automations a month with monitoring included, and there is a larger plan at $399 per month. Every project starts with a free 30-minute audit, and the fixed price is agreed before work starts. Current details are at /pricing.",
        ],
        bullets: [
          "One-off fixed-price project. You agree the scope and the price, and the work is delivered for that price. You know the total before you start, and the builder carries the risk if it takes longer. The trade-off is that the scope has to be written down clearly, and changes after that are a new conversation. It also does not cover what happens when something breaks six months later, unless support is included.",
          "Monthly plan. You pay a fixed amount each month for a set amount of new work plus monitoring and fixes. This suits a business with a list of tasks to automate over time, or one that wants someone watching the automations. The trade-off is that you pay in quiet months too, so it only makes sense if you will use it.",
          "Hourly. You pay for time spent. It is flexible and works for small fixes or work that cannot be scoped yet. The trade-off is that you carry the risk. The total is unknown at the start, and a slow builder costs you more than a fast one.",
        ],
      },
      {
        heading: "The running costs people forget",
        paragraphs: [
          "The build price is only part of the cost. An automation runs on other companies' tools, and those have their own charges. We do not quote them here because they vary by plan, by country and by volume, and they change. Check each vendor's own pricing page before you commit, not a number in a blog post.",
          "Ask for these costs to be listed in the proposal, next to the build price, so you can see the full monthly figure before you agree.",
        ],
        bullets: [
          "Tool subscriptions. Automation platforms such as Zapier, Make or n8n, plus any CRM, form or inbox tool the workflow depends on. Many have tiers based on how many tasks you run a month, so your volume decides which tier you need.",
          "Message and API usage fees. WhatsApp template messages, SMS, email sending and AI model calls are usually charged by use. A workflow that runs 50 times a month and one that runs 5,000 times can have very different bills.",
          "Maintenance when a tool changes. Tools update their apps, rename fields and retire old connections. When that happens the automation can stop or, worse, keep running with wrong data. Someone has to notice and fix it, and that time is a cost whether you pay an agency or do it yourself.",
        ],
      },
      {
        heading: "How to work out whether it pays back",
        paragraphs: [
          "You can test any automation idea with one sum. Take the hours it saves per week, multiply by what an hour of that person's time costs you, and compare the yearly total against the build cost plus the running cost.",
          "Here is a made-up example to show the arithmetic. Say a task takes 5 hours a week, and the automation removes 4 of them because 1 hour of checking and exceptions remains. Say that person's time costs you $15 an hour. The saving is 4 x $15 = $60 a week, and $60 x 52 weeks = $3,120 a year. If the build were a one-time project at a fixed quote, the payback time is the quote divided by $60. At the $99 starting price that is 99 / 60 = 1.65, so under two weeks. On a $199 monthly plan the yearly cost is $199 x 12 = $2,388, which leaves $3,120 - $2,388 = $732 a year from this one task, before tool fees. That is a thin margin for one task, and it shows why a monthly plan makes sense when you have several tasks to automate, not one.",
          "Then subtract the running costs from the section above. If the number is still clearly positive, the project is worth doing. If it only works when every estimate goes your way, it is not. The same sum works in taka. Use your own hours and your own wage figure, not ours.",
        ],
        bullets: [
          "Hours saved per week x hourly cost = weekly saving.",
          "Weekly saving x 52 = yearly saving.",
          "Build cost + (monthly running cost x 12) = first-year cost.",
          "Yearly saving minus first-year cost = what you actually keep in year one.",
        ],
      },
      {
        heading: "What to ask an agency before signing",
        paragraphs: [
          "A good proposal answers most of these without being asked. If the answers are vague, expect the invoice to be vague too.",
        ],
        bullets: [
          "Is the price fixed, and what exactly is included in it?",
          "Which tool subscriptions and usage fees will I pay on top, and who pays them, me or you?",
          "Whose accounts will the automation run in? It should be yours, so you keep it if we stop working together.",
          "What happens when it breaks? Who finds out, how fast, and is the fix included?",
          "What does the automation do when it meets a case it cannot handle?",
          "How will it be tested before it touches real customers or real data?",
          "Will I get a written description of how it works, in plain language?",
          "What does a change cost after delivery?",
        ],
      },
      {
        heading: "Mistakes that make projects expensive",
        paragraphs: [
          "Most cost overruns come from decisions made before any building starts. These are the common ones.",
        ],
        bullets: [
          "Automating a process that is not settled. If the steps change every week, you pay for the build and then pay again for each change. Fix the process on paper first.",
          "Starting with the biggest, most complicated workflow. Start with one small task that runs often. It pays back sooner and teaches you what the next one should be.",
          "Vague scope. \"Automate our sales\" cannot be priced. \"When a lead fills in the form, add it to the CRM and send a WhatsApp reply within a minute\" can.",
          "Skipping the data clean-up. Messy data does not go away when you automate. It just moves faster.",
          "Using AI where a simple rule would do. It adds usage fees and testing time for no gain.",
          "Trying to automate every exception. Handling the common cases and handing the rare ones to a person is usually far cheaper than covering everything.",
          "No owner after launch. If nobody is responsible for the automation, small faults sit unnoticed until they become costly ones.",
        ],
      },
      {
        heading: "Get a fixed price for your own case",
        paragraphs: [
          "The quickest way to get a real number is to describe one task to someone who builds these for a living. Book a free 30-minute audit at /contact. We look at the task, tell you whether it is worth automating, list the running costs you should expect, and give you a fixed price before any work starts. If the sum does not work in your favour, we will say so.",
          "Related services: operations automation at /services/operations, custom builds at /services/custom-build, and sales and lead follow-up at /services/sales-and-leads.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much does it cost to automate one business task?",
        a: "It depends on how many tools are connected, how clean the data is, whether AI is involved and how many exceptions need a person. At Moonlab a single automation starts from $99 as a one-time project, and you get a fixed price after a free 30-minute audit, before any work starts.",
      },
      {
        q: "Is a monthly plan or a one-off project better?",
        a: "A one-off project suits a single, clearly defined task. A monthly plan suits a business with several tasks to automate over time, or one that wants monitoring and fixes included. Moonlab's monthly plan is $199 per month for up to 2 new automations a month with monitoring, and there is a larger plan at $399 per month.",
      },
      {
        q: "What other costs are there besides the build?",
        a: "Subscriptions for the tools the automation runs on, usage fees for messages, SMS or AI calls, and maintenance when a tool changes. These vary by vendor, plan and volume, so check each vendor's pricing page and ask for them to be listed in the proposal.",
      },
      {
        q: "How do I know if automation will pay for itself?",
        a: "Multiply the hours saved per week by what an hour of that time costs you, then by 52. Compare that yearly saving with the build cost plus twelve months of running costs. If the result is clearly positive even with cautious estimates, it pays back.",
      },
      {
        q: "Does adding AI make an automation more expensive?",
        a: "Usually, yes. AI steps need more testing, a check for wrong answers and a usage fee from the AI provider. Use AI only where the task needs reading or writing free text. Fixed rules are cheaper and more predictable for everything else.",
      },
    ],
    services: ["operations", "custom-build", "sales-and-leads"],
  },
  // ---------------------------------------------------------------------------
  {
    slug: "zapier-vs-make-vs-n8n",
    title: "Zapier vs Make vs n8n vs Custom Code: How to Choose",
    description:
      "A plain comparison of Zapier, Make, n8n and custom code for small businesses: what each one is, where it fits, how to decide and the mistakes to avoid.",
    published: "2026-11-13",
    readMinutes: 7,
    keywords: [
      "zapier vs make vs n8n",
      "zapier vs make",
      "n8n vs zapier",
      "no-code vs custom code automation",
      "best automation tool for small business",
    ],
    intro: [
      "If you are about to build your first automations, the first question is usually which tool to use. Zapier, Make and n8n come up in every search, and sooner or later someone suggests paying a developer to write it properly instead.",
      "All four routes can work. They differ in how much complexity they handle, where your data sits, who can maintain the result and how the cost grows as you use it more. This guide explains each option in plain terms, shows where each one fits, gives you a simple way to decide and covers the mistakes that cause trouble whichever tool you pick.",
      "One note before we start. Prices, plan names and usage limits for these tools change often, so we do not quote them here. Check each vendor's own site before you commit.",
    ],
    sections: [
      {
        heading: "What each option is",
        paragraphs: [
          "Zapier is a hosted no-code tool. It is known for a very large library of app connections and a simple model: a trigger happens in one app, then one or more actions run in other apps. You build in the browser and Zapier runs it for you.",
          "Make is also hosted, but you build on a visual canvas. You lay out a scenario as connected modules, and you can see the data move from one step to the next. That layout suits workflows that branch or need to reshape data along the way.",
          "n8n is a workflow tool that you can use hosted or run on your own server. It has a visual editor like the others, and it lets you add code steps when the built-in ones are not enough. Custom code means a developer writes the automation as a program and hosts it for you. At Moonlab we use Python and Node.js for this.",
        ],
      },
      {
        heading: "Where each one fits best",
        paragraphs: [
          "None of these is the best tool in general. Each one is a good fit for a certain kind of job and a certain kind of team.",
        ],
        bullets: [
          "Zapier fits short, linear workflows between popular apps, built and looked after by someone who is not technical. A hypothetical example: when a form is submitted, add a row to a sheet and send a message to the sales channel.",
          "Make fits workflows with several branches, loops over lists of items, or data that has to be reformatted between systems, where seeing the whole flow on one canvas helps.",
          "n8n fits teams that want the workflow and its data on their own server, or that expect to mix visual steps with small pieces of code. Self-hosting means someone has to look after that server.",
          "Custom code fits work that is unusual, high in volume, sensitive, or central to how the business runs, and anything that needs an app with no ready-made connection.",
        ],
      },
      {
        heading: "A simple way to decide",
        paragraphs: [
          "Write the workflow down as a numbered list of steps before you open any tool. Then answer five questions about it. The answers usually point to one or two options and rule out the rest.",
        ],
        bullets: [
          "How many steps are there? A handful of steps in a straight line suits the simplest tool. Dozens of steps suggest a canvas tool or code.",
          "How much branching and data handling is there? If the flow splits on conditions, loops over lists or has to clean and combine data, choose a tool built for that or write code.",
          "How sensitive is the data? If it includes health, financial or personal records, find out where each tool stores and processes it. Self-hosting or custom code gives you more control over that.",
          "Who will maintain it? A tool your own staff can open and understand is worth more than a stronger one that only an outside developer can touch.",
          "How much volume will it handle? Hosted tools generally charge by usage, so a workflow that runs thousands of times a day costs very differently from one that runs twenty times. Estimate your monthly runs and check current pricing.",
        ],
      },
      {
        heading: "When no-code stops being enough",
        paragraphs: [
          "No-code tools are a sensible place to start, and many businesses never need anything else. The signs that you have outgrown one tend to be practical. The workflow has grown so large that nobody wants to edit it. You are using awkward workarounds to do something the tool was not designed for. The usage bill is rising faster than the value you get. Or you need a connection, a speed or a level of control that the tool does not offer.",
          "At that point custom code is worth pricing. It costs more to build and needs a developer to change, but it can do exactly what the process requires, it can be tested properly, and its running cost does not depend on a per-run charge from a platform. A common middle path is to keep the simple workflows in a no-code tool and move only the heavy or sensitive one into code.",
          "Our own position at Moonlab is this: \"We pick the simplest tool that will still be reliable in a year. That means no-code where it fits and custom code where it doesn't.\"",
        ],
      },
      {
        heading: "Why the tool matters less than how you run it",
        paragraphs: [
          "Every automation fails at some point, on any of these tools. An app changes a field name, a login expires, a customer types something unexpected. What decides whether that becomes a real problem is how the workflow was set up, not which tool it was built in.",
          "Three things matter more than the tool choice.",
        ],
        bullets: [
          "Monitoring: someone gets an alert when a run fails, and someone checks now and then that the workflow is still running at all. A workflow that has quietly stopped sends no error.",
          "Error handling: the workflow knows what to do when a step fails. It retries, skips the item and records it, or stops and tells a person. It should never lose data silently.",
          "Documentation: a short written note for each workflow covering what it does, what starts it, which accounts it uses and who owns it. One page is enough.",
        ],
      },
      {
        heading: "Common mistakes",
        paragraphs: [
          "These mistakes show up across all four options, and all of them can be avoided.",
        ],
        bullets: [
          "Picking by popularity. The tool your friend uses or the one with the most videos may not match your workflow. Start from the steps you wrote down.",
          "Building with no alerts. The workflow fails one night and nobody finds out until a customer complains a week later.",
          "One person holding all the knowledge. If only one employee or one freelancer understands the setup, you are stuck when they leave. Keep the accounts in the company's name and write the notes.",
          "Automating a process that is still changing. Settle the process first, then automate it.",
          "Running everything through personal logins. When that person's account is closed, every connection breaks at once.",
          "Never reviewing usage and cost. Check the numbers every few months so growth does not surprise you.",
        ],
      },
      {
        heading: "Get help choosing",
        paragraphs: [
          "If you are not sure which route fits your process, book a free 30-minute audit at /contact. We look at the workflow you have in mind, tell you which option we would use and why, and say so if a simple no-code setup you can build yourself is enough.",
          "Related services: operations automation at /services/operations, custom builds at /services/custom-build, and web apps and SaaS at /services/web-apps-and-saas.",
        ],
      },
    ],
    faqs: [
      {
        q: "Which is cheapest: Zapier, Make or n8n?",
        a: "It depends on how many workflows you run, how many steps they have and how often they run. Each vendor counts usage in its own way, and prices and plans change, so estimate your monthly volume and compare it against each vendor's current pricing page. If you self-host n8n, include the cost of the server and the time to maintain it.",
      },
      {
        q: "Is n8n harder to use than Zapier?",
        a: "For a simple workflow, most non-technical people find Zapier quicker to learn because the model is one trigger followed by actions. n8n gives you more control and the option to add code, which helps on complex work but takes longer to get comfortable with. Self-hosting adds server upkeep on top.",
      },
      {
        q: "Can I switch tools later?",
        a: "Yes, but workflows do not transfer between tools, so switching means rebuilding them. That is manageable if each workflow is documented and you know what it is supposed to do. It is one more reason to write those notes from the start.",
      },
      {
        q: "When should a small business choose custom code?",
        a: "When the workflow is central to the business and a no-code tool cannot do it reliably, when the data is too sensitive to pass through another platform, when volume makes usage-based pricing expensive, or when you need to connect a system that has no ready-made connection. For a few simple workflows, no-code is usually the better first step.",
      },
      {
        q: "Do I need a developer to use Zapier or Make?",
        a: "Not for simple workflows. Many owners and operations managers build their first ones themselves. Help becomes useful when the workflow branches a lot, handles important data or needs proper error handling and alerts.",
      },
    ],
    services: ["operations", "custom-build", "web-apps-and-saas"],
  },
  // ---------------------------------------------------------------------------
  {
    slug: "whatsapp-automation-for-business-bangladesh",
    title: "WhatsApp Automation for Business in Bangladesh: A Practical Guide",
    description:
      "What you can automate on WhatsApp in Bangladesh, the Business app vs the official API, a sample order flow, what it costs to start and the mistakes to avoid.",
    published: "2026-11-10",
    readMinutes: 6,
    keywords: [
      "whatsapp automation bangladesh",
      "whatsapp business api bangladesh",
      "whatsapp chatbot for business",
      "whatsapp order status automation",
      "whatsapp business app vs api",
    ],
    intro: [
      "In Bangladesh, a lot of business happens on WhatsApp. Customers ask for prices there, confirm orders there and send the screenshot of their bKash payment there. For a small team, that means one or two people spend most of the day answering the same questions on a phone.",
      "WhatsApp automation takes the repeat work off that phone. This guide covers what you can realistically automate, the difference between the free WhatsApp Business app and the official WhatsApp Business Platform, a simple example flow, how to think about cost, and when it is honestly not worth doing.",
    ],
    sections: [
      {
        heading: "What you can automate on WhatsApp",
        paragraphs: [
          "Most of the value comes from four jobs. None of them need a complicated AI system to start. They need a clear set of rules and a connection to the place where your data already lives, such as a Google Sheet, your online store or your courier account.",
        ],
        bullets: [
          "Enquiries: instant replies to common questions like price, size, delivery charge inside and outside Dhaka, and opening hours, with a hand-over to a person when the question is unusual.",
          "Order and parcel status: when an order is confirmed, packed or handed to the courier, the customer gets a message with the tracking details, so they stop asking 'vai, parcel kothay?'.",
          "Appointment reminders: clinics, salons, tutors and service businesses can send a reminder the day before and let the customer confirm or reschedule with one reply.",
          "Lead routing to sales: new enquiries are tagged by product or area and assigned to the right salesperson, and anything left unanswered for too long triggers an alert.",
        ],
      },
      {
        heading: "WhatsApp Business app vs the WhatsApp Business Platform",
        paragraphs: [
          "The WhatsApp Business app is the free app you install on a phone. It gives you a business profile, a product catalogue, labels, quick replies, a greeting message and an away message. For a shop with one person on the phone, these basics already save time, and you should set them up before paying for anything.",
          "The app has limits. It is built for a person typing, not for software. It does not connect properly to your store, sheet or CRM, and it has no supported way for another system to send messages on your behalf. Tools that fake this through WhatsApp Web break often and can get the number restricted.",
          "The WhatsApp Business Platform, often called the WhatsApp API, is Meta's official route for software to send and receive messages. You use it through Meta's Cloud API directly or through a Meta-approved Business Solution Provider (BSP). It requires a verified Meta business account and an approved display name.",
          "Two rules shape everything you build on the platform. First, when a customer messages you, you can reply freely for a limited customer service window. Second, any message you start, or send after that window has closed, must use a template that Meta has approved in advance, and the customer should have opted in to receive it. Order updates and reminders are templates, so plan their wording early.",
        ],
      },
      {
        heading: "A simple example flow for an online shop",
        paragraphs: [
          "Here is a flow for a typical Facebook or website shop in Dhaka that takes cash on delivery and bKash. It is small enough for one project.",
        ],
        bullets: [
          "A customer places an order on the website or the team adds it to a Google Sheet from a Messenger chat.",
          "The automation sends an approved confirmation template on WhatsApp with the order summary and a 'Confirm' and 'Cancel' button.",
          "If the customer taps Confirm, the order row is marked confirmed. If there is no reply after a set time, the order goes to a person to call.",
          "When the parcel is booked with the courier, the customer gets a second template with the tracking number.",
          "Any free-text reply from the customer lands in a shared inbox where the team can answer it, with the order details shown next to the chat.",
        ],
      },
      {
        heading: "What it costs to get started",
        paragraphs: [
          "There are three separate costs, and it helps to keep them apart. The first is Meta's own charge for certain messages on the platform, which depends on the message category and the customer's country. Meta changes these rates from time to time, so check the current pricing on Meta's site rather than trusting an old blog post.",
          "The second is the provider or inbox tool, if you use one. Some BSPs and shared-inbox tools charge a monthly fee, others charge per message on top of Meta. The third is the build itself: designing the flow, writing the templates, connecting your sheet or store and testing it.",
          "A single workflow like the order flow above fits a one-time project, and ongoing changes and monitoring fit a monthly plan. See /pricing for current plans. You get a fixed price after the free audit.",
        ],
      },
      {
        heading: "Common mistakes",
        paragraphs: [
          "Most disappointing WhatsApp projects fail for the same avoidable reasons.",
        ],
        bullets: [
          "Using unofficial tools or bulk senders that automate WhatsApp Web. They are cheap until the number gets banned, and that number is often the one printed on every product.",
          "Messaging people who never opted in. It annoys customers, leads to blocks and reports, and can hurt your number's quality rating with Meta.",
          "Building a chatbot with ten menu levels. Customers want an answer or a person, not a phone tree in chat form.",
          "No hand-over to a human. Every flow needs a clear point where a real person takes over, and the team must see those chats quickly.",
          "Templates written as an afterthought. Rejected templates delay launch, so write them in plain language with clear variables before the build starts.",
          "Nobody owns it after launch. Prices change, products change and the bot keeps quoting last month's delivery charge.",
        ],
      },
      {
        heading: "When it is not worth it",
        paragraphs: [
          "If you get a handful of WhatsApp messages a day and one person answers them comfortably, the free Business app with quick replies and labels is probably enough. A paid build will not pay back.",
          "It is also not worth automating a process that is not settled yet. If your delivery charges, return policy or booking rules change every week, fix the process first. Automation copies whatever you give it, including the confusion.",
          "If most conversations are negotiations or sensitive cases, keep people in charge and automate only the reminders and status updates.",
        ],
      },
      {
        heading: "Get a free WhatsApp automation audit",
        paragraphs: [
          "To find out which job would save you the most time, book a free 30-minute audit at /contact. We look at how your messages actually come in, tell you what is worth automating and what is not, and you keep the list either way.",
          "Related services: customer support automation at /services/customer-support, sales and lead follow-up at /services/sales-and-leads, and order and parcel updates for online shops at /services/e-commerce.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is the WhatsApp Business API available in Bangladesh?",
        a: "Yes. Businesses in Bangladesh can use the WhatsApp Business Platform through Meta's Cloud API or through a Meta-approved provider. You need a verified Meta business account, a phone number for the platform and an approved display name.",
      },
      {
        q: "Can I send bulk messages on WhatsApp to my customers?",
        a: "Only to customers who have opted in, and only with templates Meta has approved. Unofficial bulk senders that automate WhatsApp Web break the rules and put your number at risk of being banned.",
      },
      {
        q: "Do I need a chatbot to automate WhatsApp?",
        a: "Not always. Order confirmations, parcel updates and reminders are rule-based messages that do not need AI at all. A chatbot helps when you get many free-text questions, and even then it should hand over to a person quickly.",
      },
      {
        q: "Can I keep using my WhatsApp number on my phone?",
        a: "It depends on your setup and provider. Meta now supports using some numbers on both the Business app and the platform, but the options and limits vary, so confirm with your provider before you move your main number.",
      },
    ],
    services: ["customer-support", "sales-and-leads", "e-commerce"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "small-business-automation-ideas",
    title: "12 Small Business Automation Ideas You Can Set Up This Month",
    description:
      "Twelve small business tasks you can automate now, grouped by sales, support, operations and finance, with the trigger, what happens and the tools for each.",
    published: "2026-11-10",
    readMinutes: 7,
    keywords: [
      "small business automation ideas",
      "tasks to automate in small business",
      "business process automation examples",
      "n8n zapier make automation ideas",
      "automate small business workflows",
    ],
    intro: [
      "Most small businesses do not need a big automation project. They need a few boring jobs to stop landing on the owner's desk. The good news is that the most useful automations are usually small: one trigger, a few steps, one result.",
      "Below are 12 tasks you can automate this month, grouped by sales, support, operations and finance. For each one we list the trigger, what happens and the tools that usually do the job. The tools named are common examples. The right choice depends on what you already use.",
    ],
    sections: [
      {
        heading: "Sales",
        paragraphs: [
          "Sales automations pay back fastest because a slow reply often means a lost lead. These three are where most businesses should start.",
        ],
        bullets: [
          "1. Instant lead follow-up. Trigger: a form is submitted on your website or an ad lead form. What happens: the lead is added to your CRM, gets a personal-sounding reply by email or SMS within a minute, and a salesperson gets an alert. Tools: Zapier or Make, your form tool, HubSpot, Pipedrive or GoHighLevel.",
          "2. Follow-up reminders that do not depend on memory. Trigger: a deal has had no activity for a set number of days. What happens: the owner of the deal gets a task, or a polite check-in email goes out for approval. Tools: your CRM's built-in workflows, or n8n reading the CRM on a schedule.",
          "3. Quotes from a template. Trigger: a deal moves to the 'quote' stage. What happens: a quote document is filled from the deal details, saved as a PDF and sent for review before it goes to the customer. Tools: Google Docs templates, Make or Zapier, PandaDoc or a similar tool.",
        ],
      },
      {
        heading: "Customer support",
        paragraphs: [
          "Support automations should make customers feel answered faster, not pushed away. Keep a person one step away in every flow.",
        ],
        bullets: [
          "4. Inbox sorting. Trigger: a new email arrives at your support or info address. What happens: it is labelled by type, such as order, complaint, invoice or spam, and routed to the right person, with urgent words flagged. Tools: Gmail or Outlook rules for the simple cases, n8n or Make with an AI step for the rest.",
          "5. Answers to repeat questions. Trigger: a chat on your website, Messenger or WhatsApp. What happens: an assistant answers from your own FAQ and policies, and hands over to a person when it is unsure. Tools: a chat widget or the official WhatsApp Business Platform, connected to a knowledge base you control.",
          "6. Review requests. Trigger: a job is marked complete or an order is delivered. What happens: a short message a few days later asks for a review, with a direct link to your Google review page. Tools: your booking or store system, Zapier or Make, an SMS or email tool.",
        ],
      },
      {
        heading: "Operations",
        paragraphs: [
          "Operations automations remove copy and paste. They are less exciting than chatbots and often save more time.",
        ],
        bullets: [
          "7. Booking confirmations and reminders. Trigger: an appointment is booked. What happens: the customer gets a confirmation, a reminder the day before and a simple way to reschedule. Tools: Calendly, Cal.com or your booking system, plus SMS or WhatsApp.",
          "8. Data entry from forms, PDFs and emails. Trigger: a new order form, supplier invoice or application arrives. What happens: the key fields are pulled out and written to the right row in a sheet or database, with anything unclear sent for a quick check. Tools: n8n or Make with an AI extraction step, Google Sheets or Airtable.",
          "9. New customer onboarding. Trigger: a contract is signed or a first payment is received. What happens: a welcome email goes out, a folder is created, tasks are added for the team and the customer gets a form for the details you need. Tools: Google Drive, your project tool, Zapier or Make.",
        ],
      },
      {
        heading: "Finance and reporting",
        paragraphs: [
          "Money tasks are repetitive and easy to forget, which makes them good candidates. Keep an approval step on anything that moves money.",
        ],
        bullets: [
          "10. Invoices and payment reminders. Trigger: a job is completed or a monthly date arrives. What happens: an invoice is created from the job details and sent, and friendly reminders go out if it is still unpaid after a set time. Tools: QuickBooks, Xero or Stripe invoicing, with Zapier or Make for the gaps.",
          "11. Receipt and expense capture. Trigger: a receipt is photographed or forwarded to an email address. What happens: the amount, date and vendor are read and logged, and the file is stored with a consistent name. Tools: your accounting tool's receipt capture, or n8n with an AI step and Google Drive.",
          "12. A weekly numbers report. Trigger: every Monday morning. What happens: leads, sales, open invoices and booking counts are pulled from each tool into one short message or dashboard. Tools: Google Sheets or Looker Studio, n8n on a schedule, email, Slack or Telegram.",
        ],
      },
      {
        heading: "How to choose your first one",
        paragraphs: [
          "Pick the task that happens most often and annoys people the most, not the one that sounds the most impressive. Write down the steps a person follows today, including the exceptions. If you cannot describe the steps, the automation will not be able to follow them either.",
          "Then decide where a human should stay in the loop. Anything that goes to a customer or touches money should start with an approval step. You can remove it later once the output is reliably right. This is how we run our own systems, including LeadPilot, the lead engine we use for our own outreach.",
        ],
      },
      {
        heading: "What not to automate",
        paragraphs: [
          "Some work should stay with people, at least for now. Automating it either saves very little or costs you trust.",
        ],
        bullets: [
          "Tasks that happen a few times a month. The setup and upkeep will cost more than the time saved.",
          "Processes that are still changing. Settle the steps first, then automate them.",
          "Sensitive conversations, such as complaints, refunds, bad news and anything medical or legal. Automate the logging and reminders, not the reply.",
          "Decisions that need judgement, like pricing a custom job or approving credit. An automation can gather the facts, a person should decide.",
          "Anything you cannot monitor. If nobody will notice when it breaks, it will quietly break.",
        ],
      },
      {
        heading: "Start with a free audit",
        paragraphs: [
          "If you want a second opinion on which of these fits your business, book a free 30-minute audit at /contact. We go through a normal week with you, list what is worth automating, and tell you plainly what is not.",
          "Related services: connected workflows in n8n, Make and Zapier at /services/custom-build, back-office automation at /services/operations, and lead follow-up at /services/sales-and-leads.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the easiest thing to automate in a small business?",
        a: "Instant replies to new leads and appointment reminders are usually the easiest. They have a clear trigger, a simple message and an obvious benefit. Most businesses can have one running within a week or two.",
      },
      {
        q: "Should I use Zapier, Make or n8n?",
        a: "Zapier is the easiest to start with and has the widest app list. Make handles more complex flows at a lower cost per task. n8n can be self-hosted, which suits higher volumes or data you want to keep on your own server.",
      },
      {
        q: "Do I need AI for business automation?",
        a: "Most useful automations are plain rules: when this happens, do that. AI helps with messy inputs, such as reading invoices, sorting emails or drafting replies. Use it where the input is unstructured and keep a person checking the output at first.",
      },
      {
        q: "How much does it cost to automate a small business task?",
        a: "It depends on how many tools are involved and how many exceptions there are. Tool subscriptions are often modest for small volumes. Moonlab's current plans are listed on the pricing page, and you get a fixed price before any work starts.",
      },
    ],
    services: ["custom-build", "operations", "sales-and-leads"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "missed-call-text-back-and-online-booking",
    title: "Missed Call Text Back and Online Booking for Small Businesses",
    description:
      "Missed calls and phone-only booking lose customers. How missed-call text back, online booking with reminders and after-hours answering work, plus a setup list.",
    published: "2026-11-10",
    readMinutes: 6,
    keywords: [
      "missed call text back",
      "online booking for small business",
      "appointment reminder texts",
      "after hours answering service",
      "missed calls home services",
    ],
    intro: [
      "If you run a plumbing company, a clinic or a salon, the phone is still where a lot of new business starts. The trouble is that the phone rings when you are under a sink, with a patient or in the middle of a haircut. When nobody answers, many callers do not leave a voicemail. They call the next business on the list.",
      "Phone-only booking adds a second leak. Customers who would happily book at 10pm cannot, so they wait until morning and often forget. This guide explains three fixes that work well together: missed-call text back, online booking with reminders and after-hours answering. It also covers how to set them up and what to measure.",
    ],
    sections: [
      {
        heading: "Why missed calls cost more than they look",
        paragraphs: [
          "A missed call is not just one lost conversation. For home services, the caller usually has an urgent problem and is ready to pay someone today. For clinics and salons, the caller has made a decision to book and wants it done now.",
          "Most businesses have no idea how many calls they miss, because a missed call leaves almost no trace. Your phone system or carrier can usually export a call log. Looking at a few weeks of it, with missed calls by hour of day, is the cheapest piece of research you can do before spending anything.",
        ],
      },
      {
        heading: "How missed-call text back works",
        paragraphs: [
          "Missed-call text back sends an automatic SMS to anyone whose call was not answered. The message thanks them, says you are with a customer and gives them a way forward: reply with what they need, or tap a link to book.",
          "Behind the scenes, your business number runs through a phone system that can detect an unanswered call, such as a VoIP provider, a CRM with built-in calling, or a service like Twilio. When the call ends without being picked up, it triggers the text. The reply comes back into a shared inbox or CRM so the team can see the whole thread in one place.",
          "A good text is short and sounds like a person wrote it. For example: 'Sorry we missed your call, this is [Business name]. We are on a job right now. Reply with what you need and your address and we will get back to you within the hour, or book here: [link].' Only promise a response time you can actually keep.",
          "In the US, business texting from a regular local number usually needs A2P 10DLC registration with the carriers, and every message should make it easy to opt out. Your SMS provider will walk you through registration. Allow for it in the timeline, since approval is not instant.",
        ],
      },
      {
        heading: "Online booking with reminders",
        paragraphs: [
          "Online booking lets customers pick a time without calling. It works best when it shows real availability, asks only for the details you truly need and confirms the booking straight away by text and email.",
          "Reminders do most of the work after that. A reminder the day before and another a couple of hours before, each with a one-tap way to confirm or reschedule, catches the people who would otherwise forget. A rescheduled slot can be offered to someone else. A no-show cannot.",
          "For home services, a booking might be an estimate window rather than an exact time. That is fine. Show the windows you actually offer, and send the 'technician on the way' text when the job starts, so customers are home when you arrive.",
        ],
      },
      {
        heading: "After-hours answering",
        paragraphs: [
          "Some calls cannot wait for a text reply. Emergency plumbing, a burst pipe or a patient with a question about tomorrow's appointment all need something better than silence.",
          "There are a few options. An after-hours voicemail can send a transcript straight to the on-call person's phone. An AI voice agent can answer, collect the details, book a slot or flag a real emergency to a human. A traditional answering service is still a good choice for some clinics. Whatever you choose, decide clearly what counts as urgent and who gets woken up.",
          "Clinics should be careful with patient details in texts and AI tools. Keep messages to scheduling, avoid health information in SMS and check that every tool handling patient data meets your privacy obligations.",
        ],
      },
      {
        heading: "Setup checklist",
        paragraphs: [
          "You can usually have the basics running in 1-2 weeks. Work through this list in order.",
        ],
        bullets: [
          "Pull a few weeks of call logs and note when calls are missed.",
          "Choose a phone setup that can trigger a text on a missed call, ideally keeping your existing number.",
          "Register for business texting with your SMS provider and allow time for approval.",
          "Write the missed-call text, the booking confirmation and both reminders in plain language, with opt-out wording.",
          "Set up online booking with your real hours, service types and buffer times between jobs.",
          "Add the booking link to your website, Google Business Profile and the missed-call text.",
          "Send all replies into one inbox or CRM so nothing lives on one person's phone.",
          "Decide the after-hours rule: what is urgent, who is on call and how they are alerted.",
          "Test every path yourself from a personal phone before switching it on.",
        ],
      },
      {
        heading: "What to measure",
        paragraphs: [
          "Measure a few simple numbers before you start and again a month later. You do not need a dashboard for this, a weekly look at a sheet is enough.",
        ],
        bullets: [
          "Missed calls per week, and how many of them replied to the text.",
          "Time from a missed call to the first real reply from your team.",
          "Bookings made online, and how many came outside business hours.",
          "No-shows and late cancellations before and after reminders.",
          "New jobs or appointments that started from a missed call.",
        ],
      },
      {
        heading: "Book a free audit",
        paragraphs: [
          "If you want to know how many calls you are missing and what to fix first, book a free 30-minute audit at /contact. We look at your call flow and booking path and give you a short list of changes, whether or not you work with us.",
          "Related services: missed-call text back and AI voice agents at /services/voice-and-calls, booking and reminder workflows at /services/operations, and booking-ready websites at /services/web-development.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is missed call text back?",
        a: "It is an automatic text message sent to someone whose call you did not answer. It lets them know you saw the call and gives them a way to reply or book online. The aim is to keep the conversation going before they call a competitor.",
      },
      {
        q: "Is it legal to text people who called my business?",
        a: "Replying to someone who just called you is common practice, but US texting rules still apply. Register your number for business texting, keep the message about their enquiry, include opt-out wording and do not add them to marketing lists without consent. Check with your provider or legal adviser if you are unsure.",
      },
      {
        q: "Can I keep my existing business phone number?",
        a: "Usually yes. Many phone systems can port your number or forward calls in a way that still triggers the text. Check this before you choose a provider, because changing the number on your vans and listings is a big job.",
      },
      {
        q: "Do appointment reminders really reduce no-shows?",
        a: "Reminders help because most no-shows are people who simply forgot. A reminder with an easy reschedule option turns some of those into changed bookings you can refill. Track your own no-show count before and after to see the effect for your business.",
      },
    ],
    services: ["voice-and-calls", "operations", "web-development"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "website-audit-checklist-small-business",
    title: "Website Audit Checklist for Small Business: 20 Points to Check",
    description:
      "A practical 20-point website checklist for small businesses: HTTPS, mobile layout, titles, images, contact forms, email links, booking, sitemap and speed.",
    published: "2026-11-10",
    readMinutes: 7,
    keywords: [
      "website audit checklist",
      "small business website checklist",
      "website checklist for seo",
      "fix contact form not working",
      "website health check",
    ],
    intro: [
      "When we look at small business websites, the same problems come up again and again. Most of them are not design problems. They are small technical mistakes that quietly cost enquiries: a contact form that sends to nowhere, an email link that still points to the template address, or a page that is hard to use on a phone.",
      "This checklist covers the 20 things worth checking first. You can work through most of it yourself in an hour with a phone, a laptop and a free tool or two. Each point says what to check and what good looks like.",
    ],
    sections: [
      {
        heading: "Security and setup (points 1-4)",
        paragraphs: [
          "These are the basics that browsers and search engines notice first. If any of them fail, fix them before anything else.",
        ],
        bullets: [
          "1. HTTPS everywhere. Every page should load on https:// with the padlock showing. Type your address with http:// and check it redirects to the secure version.",
          "2. A valid certificate. Click the padlock and check the certificate covers your domain and is not close to expiry. Make sure renewal is automatic, because expired certificates show visitors a full-page warning.",
          "3. One main address. The www and non-www versions should end up at the same address. Two live copies of the site split your search signals.",
          "4. Mixed content. Images or scripts loaded over plain http on a secure page can break the padlock. Your browser's developer console lists them.",
        ],
      },
      {
        heading: "Mobile and layout (points 5-6)",
        paragraphs: [
          "Most visitors to a local business site arrive on a phone, so check the site on a real phone, not just a narrow desktop window.",
        ],
        bullets: [
          "5. A mobile viewport. The page should fit the screen without pinching or sideways scrolling. If it looks like a tiny desktop page, the viewport meta tag is usually missing.",
          "6. Readable text and tappable buttons. Text should be readable without zooming, and buttons and links should be big enough and far enough apart to tap with a thumb.",
        ],
      },
      {
        heading: "Search basics (points 7-11)",
        paragraphs: [
          "These are the on-page details search engines use to understand each page. They take minutes to fix and are missed on a surprising number of sites.",
        ],
        bullets: [
          "7. A unique page title on every page. Each title should say what the page is about and where you work, for example 'Emergency Plumber in Austin | Company Name'. Watch for every page sharing the same title, or titles like 'Home' and 'Untitled'.",
          "8. A meta description for every important page. It does not change rankings directly, but it is often the text people read in search results before they click.",
          "9. One H1 per page. The main heading should describe the page. Common problems are no H1 at all, the logo used as the H1, or several H1s on one page.",
          "10. Images sized for the web. Photos straight from a camera or phone can be several megabytes each. Resize them to the size they are shown at and use a modern format like WebP.",
          "11. Alt text on meaningful images. Describe what the image shows, such as 'technician fitting a water heater'. Skip decorative images and do not stuff keywords.",
        ],
      },
      {
        heading: "Contact paths (points 12-15)",
        paragraphs: [
          "This is where we find the most costly problems. A site can look perfect and still lose every enquiry because the contact path is broken.",
        ],
        bullets: [
          "12. A contact form that actually delivers. Fill in your own form and check the message arrives, lands in the inbox and not spam, and reaches someone who reads it. Check again after any site update or hosting change.",
          "13. Email links pointing to a real address. Click every email link. A common mistake is a mailto link still set to the theme's placeholder, such as info@example.com or the template designer's address, or an address on a domain you no longer use.",
          "14. A tappable phone number. On a phone, tapping the number should start a call. That needs a tel: link, not just text or an image of the number.",
          "15. A clear booking path. If customers can book, the booking button should be visible on the home page and every service page, and the flow should work end to end on a phone.",
        ],
      },
      {
        heading: "Local listings and indexing (points 16-18)",
        paragraphs: [
          "These points help search engines find your pages and connect your website to your business listing.",
        ],
        bullets: [
          "16. Google Business Profile linked and consistent. Your profile should link to your site, and the business name, address and phone number should match the site exactly.",
          "17. A sitemap. Most sites can generate one at /sitemap.xml. Submit it in Google Search Console and check it only lists pages that really exist.",
          "18. A robots.txt that is not blocking you. Open /robots.txt. If it says 'Disallow: /' for all user agents, search engines are being told to stay out, often left over from when the site was being built.",
        ],
      },
      {
        heading: "Upkeep and speed (points 19-20)",
        paragraphs: [
          "The last two points are small signals that tell visitors whether anyone is looking after the site.",
        ],
        bullets: [
          "19. An up-to-date footer. A copyright year from several years ago makes a business look closed. Make the year update itself, and check that opening hours and service areas are current.",
          "20. Reasonable speed. Run your home page and one service page through Google PageSpeed Insights on mobile. Oversized images, too many plugins and heavy sliders are the usual causes of a slow site.",
        ],
      },
      {
        heading: "How to use this checklist",
        paragraphs: [
          "Go through the list once on a phone and once on a laptop, and note each problem with the page address. Fix the contact paths first, since they cost you enquiries directly, then security, then the search basics.",
          "Repeat the check every few months and after any redesign, plugin update or hosting move. Many of these problems appear after a change nobody tested. A simple uptime and form check can be automated so you hear about a broken form before a customer does.",
        ],
      },
      {
        heading: "Get a free website audit",
        paragraphs: [
          "If you would rather have someone else run the check, book a free 30-minute audit at /contact. We go through these points on your site, show you what is broken and what matters most, and you keep the list.",
          "Related services: fixes, redesigns and ongoing care at /services/web-development, technical and local SEO at /services/seo, and SSL, hosting and email deliverability at /services/cloud-and-devops.",
        ],
      },
    ],
    faqs: [
      {
        q: "How often should a small business audit its website?",
        a: "A quick check every few months is enough for most small sites. Also check after any redesign, plugin update, theme change or hosting move, since that is when forms and links tend to break.",
      },
      {
        q: "Why is my website contact form not sending emails?",
        a: "The usual causes are a wrong recipient address, the site's server not being allowed to send mail, or messages landing in spam because the domain's email settings (SPF, DKIM, DMARC) are missing. Send a test message and check the form's settings and your spam folder first.",
      },
      {
        q: "Can I do a website audit myself?",
        a: "Yes, most of this checklist needs only a phone, a browser and free tools like Google PageSpeed Insights and Search Console. Fixing some issues, such as redirects or email settings, may need your web developer or host.",
      },
      {
        q: "Does a website audit help with SEO?",
        a: "Yes. Fixing titles, headings, images, sitemaps and robots.txt removes problems that stop search engines from understanding or indexing your pages. It will not replace good content and reviews, but it makes sure they are not wasted.",
      },
    ],
    services: ["web-development", "seo", "cloud-and-devops"],
  },
];
