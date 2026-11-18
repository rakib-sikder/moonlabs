import type { Guide } from "./guides";

export const moreGuides2: Guide[] = [
  // ---------------------------------------------------------------------------
  {
    slug: "whatsapp-business-api-guide",
    title: "WhatsApp Business API vs App: A Guide for Small Firms",
    description:
      "WhatsApp Business app or WhatsApp Business API? What each one does, how templates and opt-in work, how to pick a provider and how Meta charges, in plain terms.",
    published: "2026-11-18",
    readMinutes: 6,
    keywords: [
      "whatsapp business api",
      "whatsapp business app vs api",
      "whatsapp business api for small business",
      "whatsapp message templates",
      "whatsapp business api providers",
    ],
    intro: [
      "The WhatsApp Business app is free and built for one person with a phone. The WhatsApp Business API is for businesses that need several people, automation or a CRM connected to the same number. If you only answer a handful of chats a day, the app is enough. If you want automated replies, reminders or a shared inbox, you need the API.",
      "This guide explains the difference, how message templates and opt-in work, how to choose a provider, and how Meta charges for conversations in general terms. It is written for owners in the UK, EU and US. WhatsApp is common for customer contact in the UK and across Europe, and growing in the US. Rules and prices change, so check Meta's current documentation before you commit.",
    ],
    sections: [
      {
        heading: "WhatsApp Business app vs API: the core difference",
        paragraphs: [
          "The WhatsApp Business app is a free app you install on a phone. It adds a business profile, labels, quick replies and a catalog. It is simple and it works well for a sole trader or a very small shop.",
          "The WhatsApp Business API (the Cloud API, run by Meta) has no app screen of its own. It is a connection that other software uses. You send and receive messages through a provider's inbox, your CRM or your own system. That is what allows several staff to share one number, bots to answer, and booking or order systems to send messages automatically.",
        ],
        bullets: [
          "App: one phone, a small number of linked devices, manual work, no cost to use.",
          "API: many agents, automation, CRM and booking links, usage-based fees, and a provider to set up.",
          "App: easy to start in an afternoon.",
          "API: needs a verified business, a phone number, and some setup time.",
        ],
      },
      {
        heading: "When the free app is enough",
        paragraphs: [
          "Stay on the app if one or two people handle every chat, you reply by hand, and nobody needs reports. A hairdresser taking bookings, or a plumber replying to quote requests from his phone, does not need the API.",
          "Use labels to mark new enquiries, quotes sent and jobs booked. Set an away message and a greeting message. Add your opening hours and a link to your website. These small steps solve most of what a small business needs.",
        ],
      },
      {
        heading: "When you need the WhatsApp Business API",
        paragraphs: [
          "Move to the API when the phone becomes the bottleneck. Typical signs are staff sharing a phone, missed chats after hours, and wanting to send order updates or appointment reminders without typing each one.",
        ],
        bullets: [
          "Several people need to reply from one number, each on their own computer.",
          "You want automatic replies, appointment reminders or order updates.",
          "Chats should create or update records in your CRM or booking tool.",
          "You want to send a message to many opted-in customers at once, such as a service reminder.",
          "You need an AI assistant to answer common questions, with a handover to a person.",
        ],
      },
      {
        heading: "Message templates and the 24-hour window",
        paragraphs: [
          "On the API, WhatsApp limits when you can message a customer. When a customer writes to you, a window opens in which you can reply freely. Outside that window, you can only send a pre-approved message template.",
          "A template is a fixed message you submit to Meta for approval, for example an appointment reminder with blanks for the name and time. Approval usually comes quickly, but Meta can reject templates that look like spam or are unclear. Write templates that state the purpose plainly, and categorize them honestly (utility, marketing, authentication). Meta's current rules on categories and the exact length of the reply window are on its developer site.",
        ],
        bullets: [
          "Utility templates: order updates, appointment reminders, delivery notices.",
          "Marketing templates: offers and announcements, which have stricter rules and often cost more.",
          "Authentication templates: one-time codes.",
        ],
      },
      {
        heading: "Opt-in: getting permission to message",
        paragraphs: [
          "WhatsApp requires that people have agreed to hear from you on WhatsApp before you message them first. In the UK and EU, privacy law (UK GDPR, GDPR and PECR or ePrivacy rules for marketing) adds its own requirements for consent and for the right to opt out. In the US, consumer messaging rules such as the TCPA mainly cover texts and calls, and state rules vary. This is not legal advice, so check with a professional for your situation.",
          "In practice: ask on your website form or at checkout with a clear, unticked box that says WhatsApp. Keep a record of who agreed and when. Make it easy to stop by replying STOP. Never buy lists and message people who have never dealt with you.",
        ],
      },
      {
        heading: "Choosing a WhatsApp Business API provider",
        paragraphs: [
          "You normally reach the API through a business solution provider, which gives you an inbox, templates, and links to other tools. Many exist, from simple shared inboxes to full customer platforms. You can also connect through Meta's Cloud API directly with developer help.",
          "Compare providers on a few practical points, and check each one's current pricing page, since plans change often.",
        ],
        bullets: [
          "Shared inbox that fits how your team works.",
          "Connections to your CRM, booking tool or shop.",
          "Template management and opt-in records.",
          "Per-seat or per-message markup on top of Meta's charges.",
          "Export of your chats and contacts if you leave.",
          "Support in your time zone and language.",
        ],
      },
      {
        heading: "How Meta charges, in general terms",
        paragraphs: [
          "Meta charges for messages sent through the API, and the model has changed over time, from conversation-based charges to per-message pricing for some template types. Rates depend on the message category and the country of the customer. Replies within the customer service window have been free in recent pricing, but check the current rules.",
          "On top of Meta's fees, your provider may charge a monthly fee or a markup. Ask for a written example for your expected volume, so you can estimate your cost per month. Do not rely on a figure from a blog post, including this one, because rates are updated regularly.",
        ],
      },
      {
        heading: "How Moonlab can help",
        paragraphs: [
          "We connect WhatsApp to your CRM and booking tools so messages are logged, reminders go out on time, and a person takes over when a chat needs judgment. Customer messaging fits under /services/customer-support, and the follow-up side under /services/sales-and-leads. If you also want to cut missed enquiries, see /guides/missed-call-text-back-and-online-booking.",
          "If you are not sure whether you need the app or the API, a free 30-minute automation audit at /contact will tell you plainly.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is the WhatsApp Business API free?",
        a: "No. Meta charges for messages sent through it, depending on category and country, and providers may add a monthly fee. The WhatsApp Business app is free. Check Meta's pricing page for current rates.",
      },
      {
        q: "Can I use the app and the API on the same number?",
        a: "Generally a number is either on the app or on the API, not both at once, although Meta has introduced coexistence options for some setups. Check the current rules before you move your number.",
      },
      {
        q: "Do I need a Facebook page to use the API?",
        a: "You need a Meta business account and to verify your business, and your provider will walk you through it. Verification asks for business documents, which can take a few days.",
      },
      {
        q: "Can I send marketing messages to my customer list?",
        a: "Only to people who agreed to receive them on WhatsApp, and only with approved templates. UK and EU marketing consent rules apply as well. Never upload a list of people who did not opt in.",
      },
      {
        q: "Can an AI chatbot answer WhatsApp messages?",
        a: "Yes, through the API. A good setup limits what the bot can say, logs every chat and hands over to a person for anything it cannot answer.",
      },
    ],
    services: ["customer-support", "sales-and-leads", "operations"],
    category: "Sales & marketing",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "accounts-payable-automation",
    title: "Accounts Payable Automation for Small Business",
    description:
      "How accounts payable automation works for a small business: capture bills, match them, route approvals and pay on time, with a person approving every payment.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "accounts payable automation",
      "ap automation small business",
      "automate bill payments",
      "supplier invoice processing",
      "accounts payable software",
    ],
    intro: [
      "Accounts payable automation means software collects supplier bills, reads them, checks them, sends them for approval and prepares the payment, so nobody retypes a PDF. A person still approves every payment. For a small business, the goal is fewer missed bills, fewer typing errors and a calmer month end.",
      "This guide walks through the four stages (capture, match, approve, pay), what to automate first, how to avoid paying the same bill twice or paying a fraudster, and what kinds of tools exist. It suits owners and bookkeepers using QuickBooks, Xero or a similar accounting tool in the US, UK or Europe. For the wider picture, see /guides/invoice-automation-small-business.",
    ],
    sections: [
      {
        heading: "What accounts payable automation covers",
        paragraphs: [
          "Accounts payable is the work of paying what you owe: supplier bills, subscriptions, contractors and utilities. Done by hand, it is a loop of finding bills in email, typing them in, asking someone to approve, then paying and recording it.",
          "Automation removes the typing and the chasing. It does not remove the decisions. You should still choose which bills to pay and when.",
        ],
        bullets: [
          "Capture: bills arrive in one place, whether email, upload or supplier portal.",
          "Read: supplier, number, date, amounts and tax are extracted.",
          "Match: the bill is compared with a purchase order or past pattern.",
          "Approve: the right person gets a request and approves or rejects it.",
          "Pay and record: the payment is prepared and the books are updated.",
        ],
      },
      {
        heading: "Step 1: capture every bill in one place",
        paragraphs: [
          "Create one shared address such as bills@yourcompany.com and ask suppliers to send invoices there. Forward anything that still arrives in personal inboxes. Receipts from your phone can go to the same place.",
          "A simple automation watches that inbox, saves each attachment to a folder named by month and supplier, and creates a draft bill in your accounting tool. Many accounting products have a built-in way to do this, so check what yours offers before buying anything extra.",
        ],
      },
      {
        heading: "Step 2: read and match the details",
        paragraphs: [
          "An AI or OCR step pulls out the fields. Then simple rules check them. Is the supplier known? Is the invoice number new? Is the amount close to what you usually pay or what the purchase order says?",
          "Anything that passes all checks is marked ready. Anything that fails, such as a new supplier, a changed bank detail or an unusual amount, is flagged with the reason. This keeps attention on the few bills that need it.",
        ],
        bullets: [
          "Duplicate check: same supplier, number and amount already recorded.",
          "Amount check: within a set range of the purchase order or usual spend.",
          "Tax check: the tax or VAT figure adds up with the total.",
          "Supplier check: a known supplier with known bank details.",
        ],
      },
      {
        heading: "Step 3: route approvals to the right person",
        paragraphs: [
          "Decide who approves what. A common small business rule is that the manager approves anything up to a limit, and the owner approves anything above it. Write the rule down so the workflow can follow it.",
          "The approver should get one message with the bill, the match result and two buttons. Send it to email or chat, and send a reminder if it sits for two days. Keep a record of who approved and when, because your accountant will ask.",
        ],
      },
      {
        heading: "Step 4: pay on time, with a person approving",
        paragraphs: [
          "Prepare a payment run on a set day each week, for example Thursday, listing every approved bill due before the next run. Paying on time protects supplier relationships and avoids late fees. In the UK, paying promptly also matters under late payment rules for business debts.",
          "Keep the final release of money in a person's hands. The automation can create the batch in your bank or accounting tool, but someone should click approve. Never let a workflow change bank details or release payments on its own.",
        ],
      },
      {
        heading: "Fraud and error checks worth keeping",
        paragraphs: [
          "Fake invoices and changed bank details are among the most common small business fraud routes. Automation can help here, because it checks every bill the same way.",
        ],
        bullets: [
          "Confirm any bank detail change by phoning the supplier on a number you already hold.",
          "Flag first-time suppliers for a person to check.",
          "Block payment of an invoice number already paid.",
          "Require a second approver above an amount you choose.",
          "Keep a log of every capture, flag, approval and payment.",
        ],
      },
      {
        heading: "Tools: dedicated AP software or build on what you have",
        paragraphs: [
          "There are dedicated bill capture and payment tools that connect to QuickBooks and Xero, and the accounting products themselves have bill inboxes and approval options. Prices and features change, so check each vendor's pricing page and trial a tool on a month of real bills.",
          "If your process has quirks, such as several approvers or a custom spreadsheet, a small custom workflow in n8n, Make or Zapier on top of your accounting tool can be cheaper and fit better. Our guide at /guides/automate-quickbooks-xero covers what to connect first.",
        ],
      },
      {
        "heading": "A worked example and common mistakes",
        "paragraphs": [
          "Here is a made-up example. A building supplies merchant in Leeds receives about eighty supplier bills a month, mostly as email attachments. The bookkeeper spends a day and a half typing them into Xero. She sets up a bills inbox, and an automation saves each attachment, reads the supplier, number, date and totals and creates a draft bill in Xero with the PDF attached.",
          "Bills from known suppliers within ten percent of the usual amount are marked ready for the Thursday payment run. Anything from a new supplier, with a different bank detail or above the limit the owner chose goes to a person with a note saying why. On Thursday the owner reviews the list, approves it and releases the payment batch from the bank herself.",
          "Common mistakes are letting the system pay without approval, trusting the AI reading on poor scans, having no duplicate check and not confirming bank detail changes by phone."
        ]
      },
      {
        heading: "How Moonlab can help",
        paragraphs: [
          "We build bill capture, checks and approval flows inside your own accounts, with a person approving every payment. See /services/finance-and-hr and /services/operations for how we work.",
          "A free 30-minute automation audit at /contact will show whether this is worth doing for your volume of bills.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is accounts payable automation?",
        a: "It is software that captures supplier bills, reads the details, checks them, routes them for approval and prepares payment. A person approves payments, but the typing and chasing are handled for you.",
      },
      {
        q: "Is AP automation worth it for a small business?",
        a: "It can be if you handle a steady flow of bills, for example more than a few dozen a month. For very low volumes, a bill inbox in your accounting tool may be enough.",
      },
      {
        q: "Can it pay bills automatically?",
        a: "It can prepare payments, but we recommend a person approves each payment run. Automatic payment of unchecked bills is how duplicates and fraud get through.",
      },
      {
        q: "Does it work with QuickBooks and Xero?",
        a: "Yes, most tools and custom workflows connect to both. Check which fields and attachments the connection supports before you pick one.",
      },
      {
        q: "How accurate is AI reading of invoices?",
        a: "It is good on clear documents and weaker on scans, handwriting and unusual layouts. That is why a check step and a person reviewing flagged bills matter.",
      },
    ],
    services: ["finance-and-hr", "operations", "custom-build"],
    category: "Finance & operations",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "automate-quickbooks-xero",
    title: "Automate QuickBooks or Xero: What to Connect First",
    description:
      "What to connect first when you automate QuickBooks or Xero: bank feeds, invoices, receipts, your CRM and payments, in a sensible order with checks at each step.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "automate quickbooks",
      "xero automation",
      "quickbooks integrations",
      "xero integrations small business",
      "quickbooks automation ideas",
    ],
    intro: [
      "To automate QuickBooks or Xero, connect your bank feed first, then invoicing, then receipts and bills, then your CRM and payment tools. That order gives you clean data before you add anything that creates more of it.",
      "This guide lists what to connect, why in that order, and which checks to keep so automation does not quietly put wrong numbers in your books. It applies to both QuickBooks Online and Xero, which are common in the US, UK and Europe. Features and plans change, so check each vendor's own site for what your plan includes. Nothing here is accounting advice, so ask your accountant before changing how you record things.",
    ],
    sections: [
      {
        heading: "Start with clean foundations",
        paragraphs: [
          "Automation copies your mess faster. Before you connect anything, spend an hour on the basics: a tidy chart of accounts, customers and suppliers without duplicates, and a clear rule for who is responsible for the books each week.",
          "Ask your accountant which categories and tax settings you should not change. Then write a one page list of what you want automated, so you can tick items off in order.",
        ],
      },
      {
        heading: "1. Bank feeds and rules",
        paragraphs: [
          "Connect your business bank and card accounts so transactions flow in each day. This is built into both products. Then create bank rules for repeat items such as software subscriptions and rent, so they are coded automatically.",
          "Keep a weekly check: someone looks at what the rules coded and fixes mistakes. Rules that are too broad are a common source of wrong categories. Both tools suggest matches, and you stay in control of what is accepted.",
        ],
      },
      {
        heading: "2. Invoices from jobs, orders or quotes",
        paragraphs: [
          "The next win is creating invoices without retyping. Connect the place where jobs or sales are recorded, such as a booking tool, a shop or a spreadsheet, so an invoice draft appears when a job is done.",
          "Start with drafts that a person reviews and sends. Move to automatic sending only when you trust the data. Our guide at /guides/invoice-automation-small-business covers money in and out in more detail.",
        ],
      },
      {
        heading: "3. Receipts and supplier bills",
        paragraphs: [
          "Receipts and bills are where most small business admin time goes. Use a receipt capture option, either the one in your accounting tool or a connected app, and a shared inbox for supplier bills.",
          "Add checks for duplicates and unusual amounts. See /guides/accounts-payable-automation for the full approval flow.",
        ],
      },
      {
        heading: "4. Your CRM and quotes",
        paragraphs: [
          "When a deal is marked won in your CRM, a customer can be created in QuickBooks or Xero with the right contact details, and a draft invoice can follow. This keeps names, emails and addresses the same in both places.",
        ],
        bullets: [
          "Match customers by email or an ID, not by name alone, to avoid duplicates.",
          "Decide which system owns contact details and let changes flow one way.",
          "Test with a handful of records before switching it on for everyone.",
        ],
      },
      {
        heading: "5. Payments and reconciliation",
        paragraphs: [
          "Connect your payment processors, such as Stripe, PayPal, GoCardless or Square, so payments and fees arrive in the books as they happen. Add a pay now link to invoices if your tool supports it.",
          "Reconcile payouts, not just sales. Processors pay out net of fees and on a delay, so the bank deposit rarely equals the sales total. A good connection records fees as expenses and matches the payout.",
        ],
      },
      {
        heading: "6. Reports and reminders",
        paragraphs: [
          "Once data is clean, set up a weekly summary of cash, overdue invoices and bills due. See /guides/automated-business-reports for how to build it, and /guides/late-invoice-reminders for the reminder schedule.",
          "Add an alert when a connection breaks. Bank feeds and app connections do expire, and a silent failure can leave weeks of gaps.",
        ],
      },
      {
        "heading": "A worked example and common mistakes",
        "paragraphs": [
          "Here is a made-up example. A cleaning company with six staff uses QuickBooks Online and wants to cut bookkeeping time. The owner follows the order in this guide instead of connecting everything at once.",
          "In week one the bookkeeper connects the business bank and card feeds and writes rules for the monthly software subscriptions, fuel and insurance. She checks the coded transactions each Friday. In week two they connect the booking tool, so when a job is marked complete a draft invoice appears in QuickBooks with the right customer and price. She reviews the drafts for two weeks and then lets the invoices send themselves for regular customers only.",
          "In week four they connect Stripe, so card payments and fees are recorded as they happen, and the payout is matched to the bank deposit. Then they add a Monday message listing overdue invoices and bills due. Each connection has an alert that tells the owner if it stops working.",
          "At the end of each month the bookkeeper reviews a short list of exceptions with the accountant. This keeps the books clean, and avoids the mistakes below."
        ],
        "bullets": [
          "Connecting everything at once and not knowing which step broke something.",
          "Broad bank rules that mis-code unrelated items.",
          "Creating duplicate customers because matching used names, not emails.",
          "Ignoring payment processor fees.",
          "No alert when a connection expires.",
          "Sending invoices automatically before the data has been checked.",
          "Changing the chart of accounts without telling the accountant."
        ]
      },
      {
        "heading": "How to decide and what to do this week",
        "paragraphs": [
          "Use these criteria to decide whether a connection is ready to switch on, and keep the list short so you actually follow it."
        ],
        "bullets": [
          "Do you trust the source data, for example clean customer names and prices?",
          "Can you see what the connection did, in a log or in the books?",
          "Will you be told if it stops working?",
          "Is a person reviewing drafts before anything is sent to a customer?",
          "Has your accountant agreed how it should be recorded?",
          "Can you switch it off in one step if something goes wrong?"
        ]
      },
      {
        heading: "How Moonlab can help",
        paragraphs: [
          "We connect QuickBooks and Xero to your CRM, shop, forms and payment tools inside your own accounts, with checks and alerts. See /services/finance-and-hr.",
          "A free 30-minute automation audit at /contact will tell you which of these connections is worth doing first.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can I automate QuickBooks without coding?",
        a: "Yes. Built-in features, app marketplace connections and tools like Zapier or Make cover most needs without code. Custom work is only needed for unusual processes.",
      },
      {
        q: "Is Xero or QuickBooks better for automation?",
        a: "Both connect to a very wide range of apps. Choose on the features, your country and your accountant's preference, not automation alone.",
      },
      {
        q: "What should I automate first?",
        a: "Bank feeds and rules, then invoice creation. They save the most time with the least risk.",
      },
      {
        q: "Will automation make mistakes in my books?",
        a: "It can if the data going in is wrong. Keep review steps, duplicate checks and a monthly review with your accountant.",
      },
      {
        q: "Do I need a paid connector tool?",
        a: "Not always. Many integrations are free or included. A connector tool helps when you need custom logic. Check current pricing for each.",
      },
    ],
    services: ["finance-and-hr", "operations", "custom-build"],
    category: "Finance & operations",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "late-invoice-reminders",
    title: "Late Invoice Reminders: Schedule and Polite Templates",
    description:
      "A simple schedule and polite templates for late invoice reminders, plus the basics of the UK Late Payment Act and why US rules vary by state. Not legal advice.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "late invoice reminder",
      "payment reminder email template",
      "overdue invoice email",
      "chasing late payments",
      "late payment of commercial debts act",
    ],
    intro: [
      "The best late invoice reminder is short, polite and sent on a fixed schedule: a note before the due date, one on the day, then follow ups at a week and two weeks overdue. Most late payments are forgetfulness, not refusal.",
      "This guide gives you the schedule, ready to adapt templates and the basics of interest on late business payments in the UK, with a note on the US. It is not legal advice, so check your own contract terms and talk to a solicitor or attorney for anything serious. You can automate the whole schedule, and we cover that at the end.",
    ],
    sections: [
      {
        heading: "Make it easy to pay before you chase",
        paragraphs: [
          "Many late invoices are late because they are hard to pay. Put the amount, due date, invoice number and a payment link or bank details at the top of the invoice. State your payment terms on every invoice and in your contract, for example 14 or 30 days.",
          "Send the invoice to the person who pays, not only to your contact. Ask at the start of a job who handles accounts.",
        ],
      },
      {
        heading: "A reminder schedule that works",
        paragraphs: [
          "Use the same schedule for everyone. It feels fairer and it means you do not have to decide each time. Adjust the days to your payment terms.",
        ],
        bullets: [
          "3 days before due: a friendly heads up.",
          "On the due date: a short note with the pay link.",
          "7 days overdue: a polite reminder.",
          "14 days overdue: a firmer message and a phone call.",
          "21 to 30 days overdue: a final notice from the owner, mentioning next steps.",
        ],
      },
      {
        heading: "Polite templates you can adapt",
        paragraphs: [
          "Template for the due date: \"Hi [Name], a quick note that invoice [number] for [amount] is due today. You can pay here: [link]. If it has already been paid, thank you and please ignore this. Thanks, [Your name]\"",
          "Template at 7 days overdue: \"Hi [Name], invoice [number] for [amount] was due on [date] and we cannot see a payment yet. Could you let me know when we can expect it? The invoice is attached again for convenience. Thanks, [Your name]\"",
          "Template at 14 days overdue: \"Hi [Name], invoice [number] for [amount] is now 14 days overdue. Please arrange payment by [date], or call me if there is a problem so we can sort it out. Thanks, [Your name]\"",
        ],
      },
      {
        heading: "Late payment interest in the UK (B2B basics)",
        paragraphs: [
          "In the UK, the Late Payment of Commercial Debts (Interest) Act 1998 gives businesses a right to claim statutory interest and fixed compensation on late payment of business to business debts, unless your contract sets a substantial alternative remedy. The rate and the fixed sums are set by the government, so check the current figures on GOV.UK.",
          "The Act applies to commercial debts between businesses, not to consumers. Using it is a choice, and many small firms keep it as a backstop. If you want to rely on it, put your payment terms and a line about statutory interest in your contract and on your invoices. This is not legal advice, so check with a professional.",
        ],
      },
      {
        heading: "What about the US and Europe?",
        paragraphs: [
          "The US has no single federal late payment interest law for business invoices. Rules vary by state, and what you can charge is mostly set by your contract. If you want to charge a late fee, state the rate in your written terms before work starts, and check your state's limits on interest.",
          "In the EU, a late payment directive sets common standards for commercial transactions, and each country implements it in its own way. Ask a local professional for the specific rules.",
        ],
      },
      {
        heading: "Automating the schedule safely",
        paragraphs: [
          "A reminder workflow reads your invoices from QuickBooks, Xero or another tool and sends the right message on the right day. It is a good first automation because it informs people rather than moving money.",
        ],
        bullets: [
          "Check payment status right before each send.",
          "Let a person pause reminders for a customer, for example during a dispute.",
          "Send from your own email address, with your name.",
          "Stop after the last reminder and alert a person.",
          "Log every message sent.",
        ],
      },
      {
        heading: "When to pick up the phone",
        paragraphs: [
          "After two written reminders, call. A short, friendly phone call often finds the real reason, such as a missing purchase order or a staff change. Write down what was said and the date they promised to pay, then confirm it by email.",
          "If a customer keeps missing promises, consider stopping work until you are paid, and ask a professional about debt collection options.",
        ],
      },
      {
        "heading": "A worked example",
        "paragraphs": [
          "Here is a made-up example. A freelance designer in Edinburgh invoices small businesses on 30 day terms. She used to chase only when she remembered, which meant some invoices went unpaid for two months. She sets up a fixed schedule in her accounting tool and an automation.",
          "Three days before the due date the client gets a friendly note with the invoice attached and a pay link. On the due date there is a short reminder. At seven days overdue the second template goes out. At fourteen days she gets a message herself and phones the client. Each automatic message first checks the payment status, and she can pause any client with one click. She also adds her payment terms and a sentence about statutory interest on late business payments to her contracts and invoices.",
          "Most clients pay after the first or second note. For the rare slow payer, the phone call at fourteen days usually uncovers the reason, such as a missing purchase order number, which she fixes at once.",
          "Common mistakes to avoid are sending reminders to people who have paid, using an angry tone too early, having no written terms, and not recording what was agreed on the phone."
        ]
      },
      {
        heading: "How Moonlab can help",
        paragraphs: [
          "We set up reminder schedules in your own accounting and email accounts. See /services/finance-and-hr and our wider guide at /guides/invoice-automation-small-business.",
          "A free 30-minute automation audit at /contact is a good place to start.",
        ],
      },
    ],
    faqs: [
      {
        q: "How often should I send invoice reminders?",
        a: "A common pattern is before the due date, on the due date, and then at 7 and 14 days overdue, followed by a phone call. Keep it the same for every customer.",
      },
      {
        q: "Can I charge interest on late invoices in the UK?",
        a: "For business to business debts, the Late Payment of Commercial Debts (Interest) Act 1998 allows statutory interest and compensation in many cases. Check GOV.UK for current rates and seek advice if unsure.",
      },
      {
        q: "Can I charge a late fee in the US?",
        a: "Often yes if your written contract says so before work starts, but rules vary by state. Check your state's limits.",
      },
      {
        q: "Should reminders be automated?",
        a: "Yes, for the routine schedule, with a payment status check before each send and a person taking over after the last reminder.",
      },
      {
        q: "What if the customer says they never got the invoice?",
        a: "Resend it with the link, confirm the right email address, and give a new due date if fair. Keep a record of what was sent.",
      },
    ],
    services: ["finance-and-hr", "operations", "custom-build"],
    category: "Finance & operations",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "hr-onboarding-automation",
    title: "HR Onboarding Automation: A New-Hire Checklist",
    description:
      "How to automate new-hire onboarding: a checklist for accounts, documents, equipment and payroll handoff, with a person checking each step. For small teams.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "hr onboarding automation",
      "new hire onboarding checklist",
      "employee onboarding automation",
      "onboarding workflow small business",
      "automate employee onboarding",
    ],
    intro: [
      "Onboarding automation means that when you mark someone as hired, a checklist starts: documents are sent, accounts are created, equipment is ordered and payroll is told. Nothing gets forgotten, and the new hire feels expected.",
      "This guide gives a practical checklist for small teams, shows which parts to automate and which to leave to people, and covers the privacy care needed with employee data. It suits businesses with 2 to 50 staff in the US, UK and Europe. Employment rules differ by country and state, so this is not legal advice. Ask an employment adviser or your payroll provider what documents you must collect.",
    ],
    sections: [
      {
        heading: "Why onboarding is worth automating",
        paragraphs: [
          "In a small business, onboarding usually lives in one manager's head. Someone forgets to order the laptop, or payroll hears about the new hire after the first pay date. Each miss makes the first week awkward.",
          "A written checklist fixes most of it. Automation then makes the checklist run itself and nudges the right person when a task is due.",
        ],
      },
      {
        heading: "Before day one: the checklist",
        paragraphs: [
          "Start the workflow when the offer is accepted. Put the start date and role in one place, such as your HR tool, a spreadsheet or your CRM, and let the workflow read from it.",
        ],
        bullets: [
          "Send the welcome email with start time, address, dress code and who to ask for.",
          "Send the contract or offer letter for e-signature.",
          "Collect required details via a secure form (not by email attachment).",
          "Create work email and the accounts they need.",
          "Order or prepare a laptop, phone and access cards.",
          "Tell the team and the line manager, and book first week meetings.",
        ],
      },
      {
        heading: "Documents and right to work",
        paragraphs: [
          "What you must collect depends on your country. In the UK you must check right to work before someone starts. In the US, the I-9 form is required and must be completed within set time limits. In the EU, rules vary by country. Check the current requirements with an adviser or the official government site.",
          "Use a secure e-signature and form tool. Store documents in a restricted folder, not in a shared inbox. Automation can send the right form and track whether it has been completed, but a person should check the documents themselves.",
        ],
      },
      {
        heading: "Accounts and equipment",
        paragraphs: [
          "Create a standard access list per role. A sales hire gets the CRM and email. A bookkeeper gets accounting access. Automating account creation through Google Workspace or Microsoft 365 saves time and reduces errors, but access to money or customer data should be approved by a person.",
          "Use a role template so you do not hand out full access by default. The same list becomes your offboarding list, so access is removed when someone leaves.",
        ],
      },
      {
        heading: "Payroll handoff",
        paragraphs: [
          "Payroll needs the person's start date, pay rate, tax details and bank details, and it needs them before the cut off date. The workflow can send a task to whoever runs payroll, with a link to the data, and chase if it is not done.",
          "Never put bank details or tax IDs into chat messages or unprotected spreadsheets. Use your payroll provider's own onboarding form where one exists.",
        ],
      },
      {
        heading: "The first week and first month",
        paragraphs: [
          "Onboarding does not end on day one. Schedule check ins automatically: a note on day one, a short chat at the end of week one, and a review at 30 days.",
        ],
        bullets: [
          "Day 1: welcome, tour, accounts working.",
          "Week 1: training tasks and meeting the team.",
          "Day 30: feedback both ways and goals.",
          "End of probation: a reminder to the manager to decide.",
        ],
      },
      {
        heading: "Privacy and keeping a person in the loop",
        paragraphs: [
          "Employee data is personal data. Under UK GDPR and GDPR, collect only what you need, keep it secure and delete it when it is no longer needed. Limit who can see it. Do not send HR data to an AI tool without checking its data terms.",
          "Automation should prepare and remind. People should make hiring decisions, check documents and talk to the new hire.",
        ],
      },
      {
        "heading": "A worked example and common mistakes",
        "paragraphs": [
          "Here is a made-up example. A marketing agency in Amsterdam with fifteen staff hires a designer who starts in two weeks. The office manager marks the hire as accepted in a shared sheet, and that starts a workflow.",
          "The workflow sends the designer a welcome email with the address, start time and a name to ask for, and a link to a secure form for personal and bank details. It sends the contract for e-signature. It creates a task for IT to set up the email address and software accounts from the designer role template, and a task to prepare a laptop. It creates a task for the manager to book a first week plan, and a task for payroll with the start date, due before the payroll deadline.",
          "Each task has an owner and a due date, and the workflow reminds the owner if it is late. On day one the designer gets a message with the plan, and on day five a short check in. At thirty days the manager receives a reminder to hold a review. The manager checks required documents by hand.",
          "This keeps the human parts human. Here are the mistakes to avoid."
        ],
        "bullets": [
          "Sending personal documents by plain email.",
          "Giving new hires access to everything by default.",
          "Telling payroll after the pay run is closed.",
          "No named owner for each task.",
          "Forgetting the offboarding list that mirrors onboarding.",
          "Storing identity documents in shared folders.",
          "Automating before the checklist has been agreed."
        ]
      },
      {
        "heading": "How to decide and what to do this week",
        "paragraphs": [
          "Use these questions to decide which onboarding steps to automate first and which to keep fully manual."
        ],
        "bullets": [
          "Does the step happen for every new hire in the same way?",
          "Does it involve sensitive data that needs a person to check it?",
          "Is it often forgotten or done late today?",
          "Is there a clear owner and a due date?",
          "Would a delay cause real harm, such as a missed pay run?",
          "Can you test it with a dummy new hire first?"
        ]
      },
      {
        heading: "How Moonlab can help",
        paragraphs: [
          "We build onboarding flows on the tools you already use, with a person approving the sensitive steps. See /services/finance-and-hr and /services/operations. Related reading: /guides/business-process-automation-guide.",
          "A free 30-minute automation audit at /contact will help you decide where to start.",
        ],
      },
    ],
    faqs: [
      {
        q: "What should an onboarding checklist include?",
        a: "Contract, required documents, work accounts, equipment, payroll details, a first week plan and check ins at one week and 30 days.",
      },
      {
        q: "Can I automate right to work checks?",
        a: "You can automate requests and reminders, but a person should check the documents. Rules vary by country, so confirm with an adviser.",
      },
      {
        q: "Do I need HR software?",
        a: "Not at first. A checklist in your existing tools with a few automations is enough for a small team. Move to HR software when you grow.",
      },
      {
        q: "Is it safe to store employee data in spreadsheets?",
        a: "Only if access is restricted and the file is secured. Sensitive data is better held in your payroll or HR tool.",
      },
      {
        q: "How long does it take to set up?",
        a: "A basic version can be live in days. Most of the time goes into agreeing the checklist, not building it.",
      },
    ],
    services: ["finance-and-hr", "operations", "custom-build"],
    category: "Finance & operations",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "employee-scheduling-automation",
    title: "Employee Scheduling Automation for Small Business",
    description:
      "How employee scheduling automation works: build shifts faster, handle swaps, send reminders and track time, with practical steps for small teams and shops.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "employee scheduling automation",
      "shift scheduling software",
      "automate staff scheduling",
      "shift swap app",
      "employee time tracking small business",
    ],
    intro: [
      "Employee scheduling automation means shifts are built from rules and availability, staff get reminders on their phones, swaps are approved in a few taps and hours flow into payroll. It replaces the weekly spreadsheet and the group chat that nobody can search.",
      "This guide is for owners and managers of shops, cafes, clinics, cleaning teams and similar businesses in the US, UK and Europe. It covers what to put in your rules, how to handle swaps and time off, how to track time properly and what to check on labor law. Working time rules differ by country and state, so this is not legal advice. Check with an employment adviser.",
    ],
    sections: [
      {
        heading: "What scheduling automation actually does",
        paragraphs: [
          "At its simplest, a scheduling tool holds your staff list, their roles and availability, and your shift pattern. You draft the week, publish it and everyone is notified. More advanced tools suggest a draft from rules, flag clashes and show labor cost as you build.",
          "The saving is mostly in the back and forth. Fewer messages asking who can cover, fewer missed shifts and fewer corrections after the week has started.",
        ],
      },
      {
        heading: "Write your scheduling rules down first",
        paragraphs: [
          "Software cannot follow rules you have never stated. Spend an hour writing them, because they are also the basis for fair treatment of your staff.",
        ],
        bullets: [
          "Minimum cover for each shift and each role.",
          "Skills needed, such as keyholder, first aid or a licence.",
          "Maximum hours per week and minimum rest between shifts.",
          "How far ahead the schedule is published.",
          "How requests for time off are made and approved.",
          "Rules for breaks, as required where you operate.",
        ],
      },
      {
        heading: "Availability and time off",
        paragraphs: [
          "Collect availability once, in one place, and let staff update it themselves. A form or the scheduling tool's own page works. Time off requests should go to a manager with a clear approve or decline step and a reason.",
          "Connect approved time off to the calendar so the draft schedule never puts someone on a shift during leave. Keep a record that you can show if there is ever a dispute.",
        ],
      },
      {
        heading: "Shift swaps and open shifts",
        paragraphs: [
          "Swaps are where most chaos starts. A good setup lets one employee offer a shift, lets qualified colleagues claim it, and sends the result to the manager for approval before the schedule changes.",
          "Open shifts can be posted to the team, and the first qualified person who accepts gets it, subject to hours limits. Keep a person approving, so that overtime and cover rules are respected.",
        ],
      },
      {
        heading: "Reminders that reduce no shows",
        paragraphs: [
          "Send a reminder the evening before and a short one a couple of hours ahead. Make it easy to confirm. If a staff member does not confirm, alert a manager early instead of finding out at opening time.",
          "Use the channel your team actually reads. Many teams prefer text or WhatsApp to email. Check that people have agreed to receive work messages on their personal phones, and keep messages to work content.",
        ],
      },
      {
        heading: "Time tracking and payroll",
        paragraphs: [
          "Hours worked should come from a clock in and clock out record, not from memory. Mobile clock in, a tablet at the door or a simple timesheet form can all work. Compare scheduled hours with actual hours, and let a manager approve each timesheet before it moves to payroll.",
          "Pass approved hours to your payroll tool in a set format each pay period. Where your payroll provider has a direct connection to your scheduling tool, use it, so numbers are not retyped.",
        ],
      },
      {
        heading: "Labor law and fairness",
        paragraphs: [
          "Rules on rest breaks, maximum hours, overtime, minors and advance notice of schedules vary widely between countries and, in the US, between states and cities. Some places have predictive scheduling laws. The UK and EU have working time rules and holiday entitlements. This is not legal advice, so ask an employment adviser what applies to you.",
          "Treat the tool as a helper. A manager should always review the draft for fairness before it goes out.",
        ],
      },
      {
        "heading": "A worked example and common mistakes",
        "paragraphs": [
          "Here is a made-up example. A cafe in Portland has twelve part time staff and posts the weekly rota in a group chat. Swaps are arranged by message, nobody knows who agreed what, and last month two people turned up for one shift and nobody for another.",
          "The owner moves to a scheduling tool. She enters each person's role and availability, and sets the minimum cover for each shift: two on the counter, one in the kitchen, and a keyholder for opening. On Thursday she builds the next week, the tool warns her about one clash and one person over their hours, and she fixes both before publishing on Friday.",
          "Staff see their shifts on their phones. If someone cannot work, they offer the shift in the app, a colleague who is qualified and under their hours limit can claim it, and the owner gets one tap to approve. Reminders go the evening before. Staff clock in on a tablet by the door, the owner approves timesheets each Monday and sends the totals to payroll.",
          "Over time the data shows which shifts are overstaffed and which are short. Avoid the mistakes below when you set this up."
        ],
        "bullets": [
          "Not writing the rules down before configuring the tool.",
          "Publishing the schedule with very short notice.",
          "Allowing swaps without manager approval.",
          "Using personal chat apps with no record.",
          "Tracking time by memory instead of clock in records.",
          "Ignoring rest break and overtime rules.",
          "Letting the tool decide without a fairness check."
        ]
      },
      {
        heading: "How Moonlab can help",
        paragraphs: [
          "We connect scheduling, time tracking and payroll tools and add the reminders and approvals that your team needs. See /services/operations and /services/finance-and-hr. Related: /guides/hr-onboarding-automation.",
          "A free 30-minute automation audit at /contact will show whether a custom setup is worth it, or whether an off the shelf scheduling app is enough.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do I need scheduling software or can I use a spreadsheet?",
        a: "A spreadsheet works for a handful of staff. Once you have swaps, several locations or time tracking, a scheduling tool saves time. Check current pricing for a few options.",
      },
      {
        q: "Can scheduling be fully automatic?",
        a: "Tools can suggest a draft from rules, but a manager should review it for fairness and law before it is published.",
      },
      {
        q: "How do I handle shift swaps?",
        a: "Let staff offer and claim shifts in the tool, and have a manager approve the change so cover and hours rules are kept.",
      },
      {
        q: "Is clock in by phone allowed?",
        a: "Usually yes, but location tracking raises privacy questions, particularly under UK GDPR and GDPR. Explain it to staff and collect only what you need.",
      },
      {
        q: "Can the schedule feed payroll?",
        a: "Yes. Approved timesheets can be passed to payroll each period. Check what your payroll tool supports.",
      },
    ],
    services: ["operations", "finance-and-hr", "custom-build"],
    category: "Finance & operations",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "automated-business-reports",
    title: "Automated Business Reports: Build a Monday Summary",
    description:
      "Build an automated business report that lands every Monday: what to include, where the numbers come from and how to make it short enough that people read it.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "automated business reports",
      "weekly business report",
      "automate weekly report",
      "monday morning report",
      "small business kpi report",
    ],
    intro: [
      "An automated business report pulls numbers from your tools on a schedule and sends a short summary, usually on Monday morning, so nobody builds it by hand. The best ones fit on one screen and answer three questions: how did last week go, what needs attention and what is coming.",
      "This guide shows what to include, how to build the report with the tools you already use, and how to keep it accurate and short. It suits owners and managers who spend an hour a week copying figures into a spreadsheet. If you want a live view instead of a message, see /guides/small-business-dashboard.",
    ],
    sections: [
      {
        heading: "Why a short weekly report beats a dashboard nobody opens",
        paragraphs: [
          "A dashboard needs you to remember to look at it. An email or chat message arrives whether you remember or not. For most small teams, a weekly message that takes two minutes to read does more good than a clever dashboard.",
          "The habit matters more than the tool. Pick a day and a time, send it to the people who act on it and review it in a short weekly meeting.",
        ],
      },
      {
        heading: "What to include",
        paragraphs: [
          "Choose 5 to 8 numbers. More than that, and nobody reads them. Pick figures that you can influence and that change from week to week.",
        ],
        bullets: [
          "Sales or revenue for last week and the week before.",
          "New enquiries or leads, and how many were answered within a day.",
          "Quotes sent and quotes won.",
          "Invoices overdue and the total owed.",
          "Cash in the bank, if the owner wants it.",
          "Website visits and top pages, from Google Analytics or Search Console.",
          "Reviews received and average rating.",
          "Open support tickets or complaints.",
        ],
      },
      {
        heading: "Where the numbers come from",
        paragraphs: [
          "List each number and where it lives: accounting tool, CRM, booking system, shop, ad accounts, Google Business Profile or a spreadsheet. If a figure only exists in someone's head, decide where it will be recorded first.",
          "Most of these tools have APIs or connectors, and tools like Google Sheets, Looker Studio, Zapier, Make and n8n can read them. Check that your plan allows data access, because some limit it.",
        ],
      },
      {
        heading: "How to build it, step by step",
        paragraphs: [
          "Keep the first version simple. A common pattern is a scheduled workflow that runs early Monday, collects the figures into a sheet, adds the previous week for comparison and sends a formatted message.",
        ],
        bullets: [
          "Trigger: a schedule, for example Monday at 7:00 local time.",
          "Collect: pull each number from its source.",
          "Calculate: change versus last week, as a number and a simple arrow or word.",
          "Format: a short email or chat message with a link to the detail.",
          "Send: to named people, with a fallback alert if a source fails.",
        ],
      },
      {
        heading: "Adding an AI summary, carefully",
        paragraphs: [
          "An AI step can write two or three plain sentences from the numbers, such as noting that quotes sent are up but wins are flat. This is useful for people who dislike tables.",
          "Give the AI only the numbers, tell it not to guess causes, and keep the table in the message so readers can check the facts. Do not send customer personal data to an AI tool without checking its data terms.",
        ],
      },
      {
        heading: "Keep the numbers trustworthy",
        paragraphs: [
          "A report that is wrong once loses trust for months. Agree definitions in writing. What counts as a lead? Is revenue before or after tax and refunds? Use the same definitions every week.",
          "Add checks. If a number is zero or far outside its usual range, flag it as possibly broken instead of presenting it as fact. If a connection fails, the report should say so.",
        ],
      },
      {
        heading: "Make people act on it",
        paragraphs: [
          "Add a line for the one thing to fix this week. Review the report in a ten minute meeting. If nobody ever acts on a figure, remove it.",
          "Review the report every quarter. Drop numbers that no longer matter and add ones that do.",
        ],
      },
      {
        "heading": "A worked example and common mistakes",
        "paragraphs": [
          "Here is a made-up example. A physiotherapy practice with three therapists wants a Monday summary. The owner chooses six numbers: appointments attended, appointments missed, new patient enquiries, revenue invoiced, unpaid invoices and new Google reviews.",
          "A workflow runs at seven on Monday morning. It reads the booking system for last week's appointments, the accounting tool for invoices, the enquiry form for new patients and the Google profile for reviews. It writes the numbers into a sheet next to the previous week, works out the change, and builds a short email. The top line says, for example, that missed appointments were up on the week before, in a sentence written from the numbers only. Below sits a small table, and a link to the sheet.",
          "If a source cannot be read, the email says so in the first line instead of showing a zero. The owner reads it in two minutes, picks one action for the week, and the team discusses it at the Monday huddle. After a month she removes the review count, which nobody acts on, and adds average wait time for a first appointment.",
          "Avoid these mistakes."
        ],
        "bullets": [
          "Too many numbers, so nothing stands out.",
          "Unclear definitions that change week to week.",
          "A zero shown as a real result when a connection failed.",
          "Sending it to people who never act on it.",
          "Letting an AI step guess reasons it cannot know.",
          "No history, so trends are invisible.",
          "Never reviewing which figures still matter."
        ]
      },
      {
        "heading": "How to decide and what to do this week",
        "paragraphs": [
          "Use these questions to choose the right numbers for your own report, and to decide when to stop adding more."
        ],
        "bullets": [
          "Would a different number change what you do this week?",
          "Is it available automatically, or does someone have to type it?",
          "Can your team influence it within a month?",
          "Is the definition written down and agreed?",
          "Does it compare to last week or last month, so the trend is clear?",
          "Who reads the report, and what will they do with it?"
        ]
      },
      {
        heading: "How Moonlab can help",
        paragraphs: [
          "We build weekly reports from your accounting, CRM and website tools in your own accounts. See /services/data-and-analytics and /services/operations.",
          "A free 30-minute automation audit at /contact will help you choose the numbers worth tracking.",
        ],
      },
    ],
    faqs: [
      {
        q: "What should a weekly business report include?",
        a: "Five to eight numbers: revenue, new leads, quotes sent and won, overdue invoices, website visits and reviews are a good start.",
      },
      {
        q: "Can I build one with Google Sheets?",
        a: "Yes. Sheets can pull from many tools through connectors, and a scheduled script or workflow tool can email the result.",
      },
      {
        q: "Should I use AI for the summary?",
        a: "It can help, as long as it only sees the numbers, does not guess causes and the table stays in the message.",
      },
      {
        q: "Is a report better than a dashboard?",
        a: "For most small teams, a short weekly report gets read more often. A dashboard is useful for detail when you need it.",
      },
      {
        q: "How do I stop the report from being wrong?",
        a: "Write down definitions, add range checks and alert someone when a source fails.",
      },
    ],
    services: ["data-and-analytics", "operations", "custom-build"],
    category: "Finance & operations",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "quote-automation-service-business",
    title: "Quote Automation for Service Businesses and Trades",
    description:
      "How trades and service businesses can send quotes faster with templates, forms and automatic follow-ups, while you stay in charge of the price.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "quote automation",
      "estimate software for contractors",
      "send quotes faster",
      "quote follow up",
      "quoting software small business",
    ],
    intro: [
      "To send quotes faster, collect the job details with a short form, fill a quote template from them, check the price yourself and send it the same day. Then let an automatic follow-up chase if there is no answer. The first business to reply with a clear quote often wins the job.",
      "This guide is for plumbers, electricians, cleaners, landscapers, roofers and other service businesses in the US, UK and Europe. It covers the information to collect, how to build templates, how to keep a person in charge of pricing, and how to follow up without nagging. Examples are hypothetical.",
    ],
    sections: [
      {
        heading: "Why speed matters in quoting",
        paragraphs: [
          "A customer asking for a quote usually contacts several businesses. The one that replies first with something clear is easier to say yes to. Slow quotes lose jobs not because of price but because the customer has moved on.",
          "Our guide at /guides/speed-to-lead covers fast replies in general. Quoting is the next step after the first reply.",
        ],
      },
      {
        heading: "Collect the right details up front",
        paragraphs: [
          "Most delays come from missing information. A short enquiry form that asks the right questions saves back and forth calls. Ask only what you need to price the job.",
        ],
        bullets: [
          "Name, phone, email and the address or postcode or zip code.",
          "Type of job and a short description.",
          "Photos or a short video, which cut site visits.",
          "Size or quantity, such as rooms, square meters or number of fittings.",
          "Preferred timing and any access issues.",
          "How they heard about you, for tracking.",
        ],
      },
      {
        heading: "Build quote templates",
        paragraphs: [
          "Write a template for each of your common jobs. Include what is covered, what is not, the price or price range, how long it takes, payment terms, how long the quote is valid and how to accept.",
          "Plain language wins. List inclusions in bullets. State assumptions clearly, such as access to the property or removal of waste, so the customer knows when the price might change.",
        ],
      },
      {
        heading: "Automate the draft, not the decision",
        paragraphs: [
          "The workflow can create a draft quote from the form: fill in the customer details, pick the template, add standard line items and calculate totals using your price list. It then sends the draft to you or your estimator to check and adjust.",
          "Keep a person approving the price. Special cases, such as difficult access or old wiring, need judgment. A good workflow flags jobs that fall outside your normal range instead of pricing them blindly.",
        ],
      },
      {
        heading: "Make accepting easy",
        paragraphs: [
          "Put an accept button or a simple reply instruction at the top of the quote. Many quoting tools let customers sign online and pay a deposit. When the quote is accepted, the workflow can create the job, add it to the calendar and send an invoice for the deposit.",
        ],
      },
      {
        heading: "Follow up without nagging",
        paragraphs: [
          "Most quotes are not answered the first time. A short, polite follow up after two or three days, another after a week and a last note before the quote expires is normal. Stop when the customer replies or accepts.",
          "Our guide at /guides/lead-follow-up-sequence has wording ideas. Keep each message useful, for example offering to answer questions or adjust the scope.",
        ],
      },
      {
        heading: "Track what happens to quotes",
        paragraphs: [
          "Keep a simple record of quotes sent, accepted, declined and lost, with the value of each. Over a few months you can see your win rate and which job types or sources pay off.",
          "Ask lost customers a one question survey. The answers are often about speed or clarity, which you can fix.",
        ],
      },
      {
        "heading": "A worked example and common mistakes",
        "paragraphs": [
          "Here is a made-up example. A two person landscaping firm in Bristol gets enquiries by phone, Instagram messages and a web form, and sends quotes by hand two or three days later. They decide to fix the process in one weekend. They build a web form that asks for postcode, type of job, rough garden size, photos and preferred start date, and they point the social media bio to it.",
          "Next they write three templates: patio laying, fencing and garden clearance. Each lists what is included, what is not (such as skip hire), a price per square meter or a fixed price, timing, a deposit amount and how long the quote is valid. When a form arrives, an automation creates a draft quote from the right template, fills in the name and address and posts it to the owner on his phone with a summary and the photos. He adjusts the price, taps approve and the quote goes out by email as a PDF with an accept link, usually the same day.",
          "If the customer has not replied after three days, a short message goes out asking if they have questions. A final note goes out the day before the quote expires. When the customer accepts, the job appears in the calendar and a deposit invoice is created.",
          "The owner also keeps a simple sheet of every quote and its result. After a couple of months it shows which job types they win and which they lose. Watch for the mistakes below."
        ],
        "bullets": [
          "Sending a quote with no scope, so the price changes later.",
          "Letting automation set prices on unusual jobs without a person checking.",
          "Making customers print, sign and scan the quote.",
          "No expiry date, so old prices come back months later.",
          "Chasing too often, or sending the same message every time.",
          "Not recording lost quotes, so you never learn why.",
          "Forgetting deposits and payment terms in the template."
        ]
      },
      {
        "heading": "How to decide and what to do this week",
        "paragraphs": [
          "To decide how far to automate quoting, look at the volume and variety of your jobs. These questions help you pick the right level."
        ],
        "bullets": [
          "How many quotes do you send a week?",
          "Do most jobs fall into a handful of types with standard prices?",
          "Can customers send photos or measurements up front?",
          "Who must approve a price before it goes out?",
          "How long does the customer wait today?",
          "What share of quotes are never answered?"
        ]
      },
      {
        heading: "How Moonlab can help",
        paragraphs: [
          "We connect enquiry forms, quote templates, calendars and invoices so a quote goes out quickly and a person still sets the price. See /services/sales-and-leads and /services/operations.",
          "A free 30-minute automation audit at /contact will show where quotes slow down in your business.",
        ],
      },
    ],
    faqs: [
      {
        q: "How can I send quotes faster?",
        a: "Use a form that collects job details and photos, a template per job type, and a draft that you check and send the same day.",
      },
      {
        q: "Should quotes be sent automatically?",
        a: "Drafting can be automatic, but a person should approve the price, especially for unusual jobs.",
      },
      {
        q: "What should a quote include?",
        a: "Scope, exclusions, price, timing, payment terms, validity period and how to accept.",
      },
      {
        q: "How many times should I follow up?",
        a: "Two or three short messages over about a week or two is common, then stop.",
      },
      {
        q: "Do I need special quoting software?",
        a: "Not always. Many trades use a template and a form with a few automations. Dedicated software is worth it as volume grows. Check current pricing.",
      },
    ],
    services: ["sales-and-leads", "operations", "custom-build"],
    category: "Finance & operations",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "reduce-appointment-no-shows",
    title: "How to Reduce Appointment No-Shows in Your Business",
    description:
      "Practical ways to reduce appointment no-shows: confirmations, timed reminders, easy rescheduling, deposits and waitlists, with notes on tone and consent.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "reduce appointment no shows",
      "appointment reminder system",
      "no show policy",
      "sms appointment reminders",
      "booking deposit small business",
    ],
    intro: [
      "To reduce appointment no-shows, confirm every booking at once, send reminders at set times, let people reschedule in one tap and, where it suits your business, take a deposit. Add a waitlist so a cancelled slot gets filled.",
      "This guide is for clinics, salons, trades, consultants and other businesses that sell time. It explains each tactic, how to word reminders, how to set a fair cancellation policy, and how to keep to messaging consent rules in the UK, EU and US. We do not quote no-show rates because they vary by industry. Count your own first.",
    ],
    sections: [
      {
        heading: "Measure your own no-show rate first",
        paragraphs: [
          "Count appointments booked, attended, cancelled and missed for a month. Multiply missed appointments by your average booking value to see what it costs. That number tells you how much effort is worth spending.",
          "Track it by day of week and by how the booking was made. Patterns often show a weak spot, such as bookings made weeks ahead.",
        ],
      },
      {
        heading: "Send a confirmation right away",
        paragraphs: [
          "As soon as someone books, send an email or text with the date, time, address, what to bring, how long it takes and a link to change the booking. It sets expectations and gives them something to find later.",
          "Add the appointment to their calendar with an attached calendar file or link. People rarely miss what is on their calendar.",
        ],
      },
      {
        heading: "Reminders at the right times",
        paragraphs: [
          "One reminder is rarely enough. Two or three, spaced out, work better, and each should ask for a clear action.",
        ],
        bullets: [
          "A few days before: confirm the booking and offer a reschedule link.",
          "The day before: a short reminder with time and address.",
          "A couple of hours before: a text with parking or entry details.",
          "Ask people to reply to confirm, and call those who do not.",
        ],
      },
      {
        heading: "Make rescheduling easier than skipping",
        paragraphs: [
          "Many no-shows are people who meant to cancel and found it a hassle. Put a change or cancel link in every message that works without logging in. Show real available slots so they can pick one on the spot.",
          "A cancelled slot you know about a day ahead can be filled. A no-show cannot.",
        ],
      },
      {
        heading: "Deposits and cancellation policies",
        paragraphs: [
          "A deposit, or a card held on file with a clear late cancellation fee, changes behavior. It suits high value or limited slots. It may put off some customers, so test it on your higher risk bookings first.",
          "State the policy clearly at booking, in the confirmation and on your website. Be fair about emergencies. Consumer law may limit what you can charge, so check the rules where you operate. This is not legal advice.",
        ],
      },
      {
        heading: "Use a waitlist to fill gaps",
        paragraphs: [
          "Offer customers a waitlist for fully booked days. When a slot opens, the system messages the first person on the list, who can claim it with one tap. If they do not reply within a set time, it moves to the next.",
          "This turns cancellations into bookings and shows customers you value their time.",
        ],
      },
      {
        heading: "Messaging consent and tone",
        paragraphs: [
          "Reminders about a booking someone made are service messages, but you should still collect a phone number and consent properly. In the UK and EU, UK GDPR, GDPR and PECR or ePrivacy rules apply, and marketing needs consent. In the US, the TCPA and state rules affect texting. Keep reminders strictly about the appointment and always offer a way to opt out.",
          "Keep the tone friendly and short. Our guide at /guides/missed-call-text-back-and-online-booking shows how booking and texting fit together.",
        ],
      },
      {
        "heading": "A worked example and common mistakes",
        "paragraphs": [
          "Here is a made-up example. A physiotherapy clinic in Dublin books forty sessions a week and loses several to no-shows. The manager counts for a month, finds that most missed visits are first appointments booked more than a week ahead, and decides to target those.",
          "She changes four things. Bookings now send an instant email and text with the address, parking and what to wear. A reminder goes out three days before, with a one tap link to reschedule. A second text goes the evening before asking the patient to reply YES to confirm. Anyone who has not confirmed by the next morning gets a quick phone call from reception. She also turns on a waitlist, so when someone cancels, the first person waiting gets a text offering the slot, and the slot is held for them for thirty minutes.",
          "For new patients only, the clinic asks for a small refundable deposit, with the cancellation terms written in the confirmation. After two months she compares missed appointments with the first month. The result is her own, not a promised figure, but it shows whether the changes are worth keeping.",
          "Here are the mistakes that most often undo this kind of work."
        ],
        "bullets": [
          "Reminders with no way to reschedule, so people ignore them.",
          "Sending texts to numbers without a clear basis for contacting them.",
          "Cancellation fees that are not stated until the person is charged.",
          "Sending reminders so often that people turn them off.",
          "No process for cancelled slots, so the gap stays empty.",
          "Confirming by email only, when your customers read texts.",
          "Never reviewing which bookings fail, so you fix the wrong thing."
        ]
      },
      {
        "heading": "How to decide and what to do this week",
        "paragraphs": [
          "To choose between tactics, look at your own pattern before you spend money. This week, pull the last month of bookings and answer the questions below."
        ],
        "bullets": [
          "Which bookings are missed most: new customers, long lead times or certain days?",
          "Do customers have an easy way to cancel or change, or do they have to call?",
          "Would a deposit suit your service, or would it push away good customers?",
          "Which channel do customers actually read, text, email or WhatsApp?",
          "How many cancelled slots could a waitlist have filled?",
          "Who is responsible for calling people who do not confirm?"
        ]
      },
      {
        heading: "How Moonlab can help",
        paragraphs: [
          "We set up confirmations, reminders, rescheduling links and waitlists on your booking tool, or build one if you have none. See /services/customer-support and /services/voice-and-calls.",
          "A free 30-minute automation audit at /contact will help you estimate what no-shows cost you.",
        ],
      },
    ],
    faqs: [
      {
        q: "How many reminders should I send?",
        a: "Two or three: a few days before, the day before and a couple of hours before. Each should have a clear action.",
      },
      {
        q: "Should I charge a deposit?",
        a: "It can reduce no-shows for high value or limited slots. Test it on those first, and state your policy clearly.",
      },
      {
        q: "Are SMS reminders allowed?",
        a: "Generally yes for bookings people made, but you need a lawful basis and an opt out. Check UK, EU or US rules that apply to you.",
      },
      {
        q: "What is a good no-show rate?",
        a: "It varies by industry. Track your own and aim to lower it over time.",
      },
      {
        q: "How do waitlists help?",
        a: "They fill cancelled slots quickly by offering them to waiting customers automatically.",
      },
    ],
    services: ["customer-support", "voice-and-calls", "operations"],
    category: "Finance & operations",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "small-business-website-cost",
    title: "Small Business Website Cost: What Drives the Price",
    description:
      "What a small business website costs and why: DIY builder, freelancer or agency, plus hosting, domain and upkeep. Rough US and UK ranges, clearly labeled.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "small business website cost",
      "how much does a website cost",
      "website cost for small business uk",
      "freelancer vs agency website",
      "website maintenance cost",
    ],
    intro: [
      "A small business website can cost from almost nothing on a DIY builder to several thousand dollars or pounds from an agency, and the price depends mostly on how many pages, how much custom design and what the site must do. The ranges below are rough and vary a lot by country and provider.",
      "This guide explains what drives the cost, the three main routes (DIY builder, freelancer, agency), the ongoing costs people forget, and how to compare quotes fairly. It is for owners in the US, UK and Europe. We give no exact prices for other companies' products, because they change. Always ask for a written quote. For what we charge at Moonlab, see /pricing.",
    ],
    sections: [
      {
        heading: "The three routes: DIY, freelancer or agency",
        paragraphs: [
          "DIY means using a website builder such as Wix, Squarespace or Shopify, or WordPress with a theme, and doing the work yourself. The cost is the subscription plus your time. It suits a simple brochure site if you have the patience.",
          "A freelancer is one person who designs and builds for you. Quality and price vary widely, and you rely on one person. An agency or studio has several people, such as a designer, a developer and a project manager, and usually costs more but handles bigger or more complex work.",
        ],
        bullets: [
          "DIY: lowest cash cost, highest time cost, limited design freedom.",
          "Freelancer: a middle price, a personal relationship, a single point of failure.",
          "Agency or studio: higher price, a team, process and often ongoing support.",
        ],
      },
      {
        heading: "Rough ranges, with a warning",
        paragraphs: [
          "These ranges are rough guides, not quotes. Prices differ between the US, UK and Europe, between cities and between providers. Treat them as a way to sense whether a quote is wildly high or low.",
          "A DIY site might cost a few hundred dollars or pounds a year in subscriptions and a domain. A simple freelancer built site might run from around a thousand to a few thousand. An agency built site with custom design, content and SEO foundations often starts in the low thousands and can reach well beyond that for larger builds. Online shops and sites with custom features cost more. Ask three providers for written quotes with the same brief.",
        ],
      },
      {
        heading: "What actually drives the cost",
        paragraphs: [
          "Price rises with the amount of work and the amount of risk. Each item below adds hours or skills.",
        ],
        bullets: [
          "Number of pages and how different each layout is.",
          "Custom design versus a template.",
          "Content: who writes the text and takes the photos.",
          "Features: booking, payments, membership, quote forms, multilingual.",
          "Integrations with a CRM, email tool or accounting software.",
          "SEO setup, redirects and tracking.",
          "Accessibility and legal pages, including cookie consent.",
        ],
      },
      {
        heading: "Ongoing costs people forget",
        paragraphs: [
          "A website is not a one time purchase. Plan for a domain name each year, hosting or a builder subscription, an email service if you use your domain for email, and security updates for WordPress or other software.",
          "Add the cost of changes. New pages, new offers and fixes take time. Some providers offer a monthly care plan that covers updates, backups and small edits. Ask what is included and what is billed by the hour.",
        ],
      },
      {
        heading: "Content, photos and copy",
        paragraphs: [
          "Many quotes assume you supply the words and images. If you do not, add the cost of copywriting and photography. Real photos of your team and work usually beat stock images and help trust.",
          "Writing clear service pages is one of the best investments. A fast, good looking site with thin text rarely brings enquiries.",
        ],
      },
      {
        heading: "How to compare quotes fairly",
        paragraphs: [
          "Give every provider the same written brief: pages, features, who supplies content, deadline and what happens after launch. Compare what is included, not only the total.",
        ],
        bullets: [
          "Do you own the site, the domain and the content at the end?",
          "Is hosting and the platform in your own account?",
          "Are mobile design, speed and basic SEO included?",
          "How many rounds of changes are included?",
          "What support do you get after launch, and at what price?",
          "Is the quote fixed or hourly?",
        ],
      },
      {
        heading: "When to spend more, and when not to",
        paragraphs: [
          "Spend more where the site directly makes money: a service page that brings enquiries, a booking flow, a shop checkout. Spend less on features nobody asked for, such as complex animations.",
          "A good first website is clear, fast and easy to contact you from. You can grow it later. For a check on an existing one, use /guides/website-audit-checklist-small-business.",
        ],
      },
      {
        "heading": "A worked example and common mistakes",
        "paragraphs": [
          "Here is a made-up example. A physiotherapy clinic in Seattle needs a site with a home page, five service pages, a team page, a contact page and online booking. The owner collects three kinds of quotes using the same written brief. A DIY builder costs a modest yearly subscription but takes the owner many evenings and offers limited booking features. A freelancer quotes a fixed price and includes mobile design and basic SEO setup, but charges hourly for later changes. A studio quotes more, for custom design, written content, photography direction and a month of support.",
          "The owner compares them on the checklist in this guide: ownership of the domain and code, who writes the content, how many rounds of changes are included, and what support costs after launch. She chooses the freelancer for the build, pays for professional photos separately and takes a small monthly care plan. Her total first year cost is the build plus photos, plus hosting, domain and the care plan, not just the headline quote.",
          "The numbers will differ for your business, but the method is the same. Add every line, including the ones people forget.",
          "Common mistakes include comparing quotes that cover different things, forgetting content and photo costs, not owning the domain, and buying features you will not use."
        ]
      },
      {
        heading: "How Moonlab can help",
        paragraphs: [
          "We build websites for small businesses at a fixed price, in your own accounts. See /services/web-development, /services/ui-ux-design and /pricing.",
          "A free 30-minute automation audit at /contact is also a good moment to ask whether you need a new website at all.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much does a small business website cost?",
        a: "From a few hundred a year for DIY to a few thousand or more for a custom build, depending on pages, features and content. Get written quotes for your own brief.",
      },
      {
        q: "Is a freelancer cheaper than an agency?",
        a: "Often, but not always. Compare what is included, support after launch and who owns the site.",
      },
      {
        q: "What ongoing costs should I expect?",
        a: "Domain, hosting or builder subscription, email, updates, backups and any changes you request.",
      },
      {
        q: "Do I need to pay for content?",
        a: "Either you supply it or you pay for copywriting and photos. Check which one the quote assumes.",
      },
      {
        q: "Can I build my own website?",
        a: "Yes for a simple site. Allow time for design, text and testing on a phone.",
      },
    ],
    services: ["web-development", "ui-ux-design", "seo"],
    category: "Websites & SEO",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "website-speed-core-web-vitals",
    title: "Website Speed and Core Web Vitals: LCP, INP, CLS",
    description:
      "Core Web Vitals in plain English: what LCP, INP and CLS measure, how to test with PageSpeed Insights and Search Console, and the fixes that usually help.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "core web vitals",
      "lcp inp cls explained",
      "improve website speed",
      "pagespeed insights",
      "core web vitals search console",
    ],
    intro: [
      "Core Web Vitals are three measurements Google uses to describe how a page feels to a real visitor: how fast the main content appears (LCP), how quickly the page responds to taps and clicks (INP) and how much it jumps around while loading (CLS). Passing them helps users and is a minor part of Google's page experience signals.",
      "This guide explains each one in plain terms, shows how to test your site with free tools and lists the fixes that most often help small business sites. Google can change the metrics and thresholds, so check web.dev for the current ones. A fast site will not fix weak content, but a slow one loses visitors before they read it.",
    ],
    sections: [
      {
        heading: "What Core Web Vitals are",
        paragraphs: [
          "Core Web Vitals are Google's way of measuring real world user experience on a page. They are collected from real Chrome users, which is why they are called field data. Lab tests simulate a load on a test device and are useful for debugging.",
          "Google has said that page experience is one factor among many in ranking, and that relevant content still matters most. Treat speed as a quality and conversion task first, and an SEO bonus second.",
        ],
      },
      {
        heading: "LCP: Largest Contentful Paint",
        paragraphs: [
          "LCP measures how long it takes for the biggest visible element, usually a hero image or a large heading, to appear. Google's guidance is that a good LCP is 2.5 seconds or less. Check web.dev for the current thresholds.",
          "The usual culprits are large uncompressed images, slow hosting, render blocking scripts and fonts that load late.",
        ],
      },
      {
        heading: "INP: Interaction to Next Paint",
        paragraphs: [
          "INP replaced the older First Input Delay as a Core Web Vital in March 2024. It measures how quickly the page responds visually after a tap, click or key press, across the whole visit. A good INP is generally 200 milliseconds or less.",
          "Poor INP usually comes from too much JavaScript running on the main thread: heavy chat widgets, tracking scripts, page builders and sliders.",
        ],
      },
      {
        heading: "CLS: Cumulative Layout Shift",
        paragraphs: [
          "CLS measures unexpected movement of content as the page loads, such as a button that jumps just as you tap it. A good CLS is 0.1 or less.",
          "It is caused by images and embeds with no set size, ads or banners that push content down, and web fonts that swap in late.",
        ],
      },
      {
        heading: "How to test your site",
        paragraphs: [
          "Start with PageSpeed Insights at pagespeed.web.dev. Enter a URL and read the field data at the top, if it is available, and the lab diagnostics below. Test your home page, a service page and a page that gets most traffic.",
          "In Google Search Console, open the Core Web Vitals report under Experience. It groups pages by status for mobile and desktop and shows which issues affect the most URLs. Field data needs enough visitors, so a small site may show no data. In that case use the lab test and Chrome DevTools.",
        ],
        bullets: [
          "Always test on mobile first.",
          "Test several pages, not only the home page.",
          "Re-test after each change, and give field data time to update.",
        ],
      },
      {
        heading: "Common fixes that work",
        paragraphs: [
          "Start with the cheap wins. Most small business sites gain the most from images and scripts.",
        ],
        bullets: [
          "Compress images and use modern formats such as WebP or AVIF, at the size they are shown.",
          "Set width and height on images and embeds to prevent layout shift.",
          "Do not lazy load the main hero image, and preload it if needed.",
          "Remove plugins, widgets and tracking scripts you do not use.",
          "Load third party scripts after the page, or on interaction.",
          "Use a decent host and a CDN, and turn on caching.",
          "Limit fonts to one or two families and use font display swap.",
        ],
      },
      {
        heading: "Platform tips: WordPress, Shopify, builders",
        paragraphs: [
          "On WordPress, a heavy theme and many plugins are the usual problem. Remove unused plugins and use a caching plugin. On Shopify, apps add scripts, so review them. On builders like Wix or Squarespace you have less control, so focus on image size and removing extras.",
          "If speed work is beyond your time, a developer can often fix the biggest items in a day or two. See /guides/website-audit-checklist-small-business for a wider check.",
        ],
      },
      {
        "heading": "A worked example and common mistakes",
        "paragraphs": [
          "Here is a made-up example. A bakery in Brighton runs a WordPress site with a large hero photo, a chat widget, a social media feed and eleven plugins. PageSpeed Insights on mobile shows a slow LCP, and Search Console lists many pages as needing improvement.",
          "The owner works through the report in order. The hero photo is a 4 MB file shown at a small size, so she resizes it and converts it to WebP, and makes sure it is not lazy loaded. Images lower down get set width and height to stop the layout jumping. She removes four plugins she no longer uses, deletes the social feed, which few people clicked, and sets the chat widget to load only when a visitor clicks it. She turns on caching through the host.",
          "She retests the same pages and compares the numbers. She also taps through the site on her phone. Field data in Search Console will take weeks to catch up, so she does not expect instant change there.",
          "The steps above are usually enough for a small site. These are the common mistakes."
        ],
        "bullets": [
          "Chasing a perfect score instead of fixing the biggest issue.",
          "Testing only the home page on desktop.",
          "Installing a speed plugin on top of a bloated theme.",
          "Lazy loading the main image, which delays LCP.",
          "Adding tracking scripts nobody checks.",
          "Uploading full size camera photos.",
          "Judging field data the day after a change."
        ]
      },
      {
        "heading": "How to decide and what to do this week",
        "paragraphs": [
          "Use this order when you only have a few hours, because the first items usually give the largest gain."
        ],
        "bullets": [
          "Resize and compress the largest image on each key page.",
          "Remove plugins, widgets and scripts you do not use.",
          "Set image dimensions to stop layout shift.",
          "Turn on caching and check your hosting plan.",
          "Defer chat widgets and tracking until after the page loads.",
          "Retest on mobile and write down the before and after scores."
        ]
      },
      {
        heading: "How Moonlab can help",
        paragraphs: [
          "We test and fix speed issues as part of web builds and SEO work. See /services/web-development and /services/seo.",
          "A free 30-minute automation audit at /contact is also open if you want a second pair of eyes.",
        ],
      },
    ],
    faqs: [
      {
        q: "What are Core Web Vitals?",
        a: "Three measurements of user experience: LCP for loading, INP for responsiveness and CLS for visual stability.",
      },
      {
        q: "Do Core Web Vitals affect rankings?",
        a: "They are one of many signals. Google says content relevance matters most, but a poor experience can still cost you visitors.",
      },
      {
        q: "What replaced First Input Delay?",
        a: "INP replaced FID as a Core Web Vital in March 2024.",
      },
      {
        q: "Why does Search Console show no data?",
        a: "Field data needs enough real visits. Use the lab test in PageSpeed Insights instead.",
      },
      {
        q: "What is the fastest fix?",
        a: "Usually compressing and resizing images and removing unused plugins or scripts.",
      },
    ],
    services: ["web-development", "seo", "cloud-and-devops"],
    category: "Websites & SEO",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "local-seo-checklist",
    title: "Local SEO Checklist for US and UK Small Businesses",
    description:
      "A practical local SEO checklist: Google Business Profile, NAP consistency, citations, reviews and local pages, for businesses serving a town or region.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "local seo checklist",
      "local seo for small business",
      "nap consistency",
      "local citations",
      "local seo uk",
    ],
    intro: [
      "Local SEO helps your business show up when people nearby search for what you do. The core tasks are a complete Google Business Profile, consistent name, address and phone details everywhere, genuine reviews, a few quality citations and a website with clear local pages.",
      "This checklist is written for businesses in the US and the UK, and the steps work in most of Europe too. We do not promise rankings, because nobody can. These steps make you easier to find and easier to trust. Work through them in order, and tick off each one.",
    ],
    sections: [
      {
        heading: "1. Claim and complete your Google Business Profile",
        paragraphs: [
          "This is the most important local task. Claim your profile, verify it and fill in every field. Choose the right primary category, add your services, hours, photos and website link.",
          "Our full guide at /guides/google-business-profile-optimization covers each field. Do it before anything else on this list.",
        ],
      },
      {
        heading: "2. Make your name, address and phone consistent",
        paragraphs: [
          "NAP stands for name, address and phone number. Use exactly the same details on your website, Google profile, social pages and directories. Small differences, such as Street and St, or an old phone number, can confuse people and data providers.",
          "Write down your official NAP, with the format you will use, and share it with anyone who creates listings for you. Service area businesses can hide their street address on Google while keeping a clear service area.",
        ],
      },
      {
        heading: "3. Build a few quality citations",
        paragraphs: [
          "A citation is a mention of your business details on another site. Start with the main ones for your country, such as Apple Maps, Bing Places, Yelp and Facebook in the US, and Yell, Bing Places and Apple Maps in the UK, plus industry directories and your local chamber of commerce.",
          "Quality matters more than quantity. Skip anything that looks spammy or charges for dubious links. Check each listing for accuracy.",
        ],
      },
      {
        heading: "4. Earn genuine reviews",
        paragraphs: [
          "Reviews influence both rankings and decisions. Ask every happy customer for a review, with a direct link, soon after the job. Reply to every review, good or bad, in a polite and short way.",
          "Never buy reviews or offer rewards for positive ones, which breaks Google's rules and, in many places, consumer law. Our guide at /guides/get-more-google-reviews shows a safe process.",
        ],
      },
      {
        heading: "5. Create useful local pages on your website",
        paragraphs: [
          "Your website should say clearly what you do and where. Create a page for each main service, and, if you serve several towns, a page for each with real, specific content, not copied text with the town name swapped.",
        ],
        bullets: [
          "Put your NAP in the footer and on the contact page.",
          "Add an embedded map and directions.",
          "Show real photos, reviews and examples from that area.",
          "Use a title like Service in Town, Region.",
          "Add local business structured data, if your developer can.",
        ],
      },
      {
        heading: "6. Get the website basics right",
        paragraphs: [
          "Make sure the site loads quickly on a phone, uses HTTPS and has a clear call to action. Most local searches happen on mobile. Check speed with the steps in /guides/website-speed-core-web-vitals.",
          "Add your service area, opening hours and a click to call button. Track calls and form fills so you know what works.",
        ],
      },
      {
        heading: "7. Keep it up to date",
        paragraphs: [
          "Local SEO is not finished after one afternoon. Post updates on your profile, add new photos, respond to questions and update holiday hours. Review your listings every quarter.",
          "Track your results in Google Business Profile insights and Search Console, and look at calls, direction requests and website clicks.",
        ],
      },
      {
        "heading": "A worked example, timeline and common mistakes",
        "paragraphs": [
          "Here is a made-up example. A carpet cleaning firm in Austin, Texas, with three vans, has a half filled Google profile, a website listing the address as 4th St in one place and Fourth Street in another, and about a dozen reviews. In week one the owner completes the profile: correct primary category, all services, opening hours, a service area, and twenty real photos. In week two the owner fixes the address format everywhere and corrects two old directory listings.",
          "In weeks three and four the owner starts asking every customer for a review, with a short link sent by text the day after the job, and replies to each one. The owner also adds a page for each of the three main services and two pages for the biggest suburbs, each with real examples and photos of local jobs. After two or three months the owner checks Search Console and profile insights for calls, direction requests and searches. Nothing here is guaranteed to rank, but each step makes the business clearer to Google and to customers.",
          "A rough timeline for you: profile and NAP fixes in the first week, reviews and local pages over the first month, and a monthly check after that.",
          "Avoid these common mistakes, which waste the most effort."
        ],
        "bullets": [
          "Paying for dozens of low quality directory listings.",
          "Copying one town page fifty times with the name swapped.",
          "Using a virtual office or PO box as your address.",
          "Letting an old agency or former employee keep control of your profile.",
          "Ignoring negative reviews instead of replying calmly.",
          "Setting a service area much wider than you can actually serve.",
          "Forgetting to update hours for holidays.",
          "Never checking what people actually searched to find you."
        ]
      },
      {
        "heading": "How to decide and what to do this week",
        "paragraphs": [
          "If you only have a few hours, work through this order of priority. Each step builds on the one before, so skipping ahead rarely helps."
        ],
        "bullets": [
          "Verify and complete your Google Business Profile today.",
          "Fix your name, address and phone number on your own website next.",
          "Ask your last ten happy customers for a review this week.",
          "Create or improve one service page with real photos and local detail.",
          "Check the main directories for your country and correct any wrong listing.",
          "Put a monthly reminder in your calendar to review insights and answer reviews."
        ]
      },
      {
        heading: "How Moonlab can help",
        paragraphs: [
          "We help with local SEO setup, local pages and review automation. See /services/seo and /services/marketing.",
          "A free 30-minute automation audit at /contact can include a quick look at your local presence.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is local SEO?",
        a: "It is improving how your business appears in local search results and maps, mainly through your Google Business Profile, reviews, citations and website.",
      },
      {
        q: "What is NAP consistency?",
        a: "Using the same business name, address and phone number everywhere online.",
      },
      {
        q: "How many citations do I need?",
        a: "Quality matters more than number. A handful of accurate, relevant listings is a good start.",
      },
      {
        q: "How long does local SEO take?",
        a: "Often weeks to months. It depends on competition and starting point, and nobody can guarantee a ranking.",
      },
      {
        q: "Do I need a website for local SEO?",
        a: "A profile alone can bring calls, but a good website supports rankings and trust.",
      },
    ],
    services: ["seo", "marketing", "content-and-social"],
    category: "Websites & SEO",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "google-business-profile-optimization",
    title: "Google Business Profile Optimization: A Step Guide",
    description:
      "How to optimize your Google Business Profile: categories, services, photos, posts, hours, reviews and booking links, plus mistakes like keyword-stuffed names.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "google business profile optimization",
      "optimize google business profile",
      "google business profile categories",
      "google my business tips",
      "gbp photos and posts",
    ],
    intro: [
      "To optimize your Google Business Profile, pick the right primary category, fill in every field, add real photos, keep hours accurate, collect and answer reviews and use your real business name. Accuracy and completeness beat tricks.",
      "This guide goes field by field, and ends with the mistakes that can get a profile suspended. Google changes the interface and features from time to time, so some labels may differ. The guidelines are on Google's help pages, and you should read them. It applies in the US, UK and Europe.",
    ],
    sections: [
      {
        heading: "Name, categories and description",
        paragraphs: [
          "Use your real business name, as it appears on your signage and paperwork. Do not add keywords or locations to it. Google's guidelines forbid it, and profiles with stuffed names can be suspended or edited.",
          "The primary category is among the strongest signals. Choose the most specific one that describes your main service, such as Plumber, not Home service. Add secondary categories only if they are true. Write a clear description of what you do and where, in plain language, without links or promotional offers.",
        ],
      },
      {
        heading: "Services and products",
        paragraphs: [
          "Add each service you offer, with a short description, and a price or price range if you can. This helps customers and matches you with more specific searches. Shops can add products with photos.",
          "Keep names plain. Write Boiler repair, not Best cheap boiler repair near me.",
        ],
      },
      {
        heading: "Address, service area and hours",
        paragraphs: [
          "Show an address only if customers visit you. If you travel to customers, hide your address and set a service area, such as the towns or postcodes you cover. Do not list areas you do not serve.",
          "Keep hours correct, including special hours for holidays. Wrong hours lead to bad reviews and lost trust.",
        ],
      },
      {
        heading: "Photos and video",
        paragraphs: [
          "Add real photos of the exterior, interior, team, work and products. Show before and after work if it suits your trade. Avoid stock photos and heavy filters.",
          "Add a few new photos each month. Customers also upload photos, and you can reply to them. Short videos are allowed within Google's limits.",
        ],
        bullets: [
          "A clear logo and cover photo.",
          "Team and premises, so people know who will turn up.",
          "Recent work, with permission where people are visible.",
        ],
      },
      {
        heading: "Posts, updates and Q and A",
        paragraphs: [
          "Posts let you share offers, news and events. Check what your profile currently supports, because Google adjusts these tools. Even if few people read them, fresh posts show the business is active.",
          "Monitor questions asked on the profile and answer them. Add common questions yourself, with clear answers, where the feature is available.",
        ],
      },
      {
        heading: "Reviews",
        paragraphs: [
          "Ask for reviews with a short link after each job, and reply to every one. Thank people, be specific and keep it calm if the review is negative. Offer to fix the problem by phone or email.",
          "Do not offer incentives, review gate by only asking happy customers, or post fake reviews. See /guides/get-more-google-reviews for a safe process.",
        ],
      },
      {
        heading: "Booking links, messaging and tracking",
        paragraphs: [
          "Add your booking or appointment link where it is available, and a website link with simple tracking, so you can see visits in your analytics. If you turn on chat or messaging, you must respond promptly or it hurts you.",
          "Check the insights regularly: searches, calls, direction requests and website clicks. Use them to spot what is working.",
        ],
      },
      {
        heading: "What not to do",
        paragraphs: [
          "Most suspensions come from a small set of mistakes. Avoid them.",
        ],
        bullets: [
          "Keyword stuffing in the business name.",
          "Using a virtual office, PO box or fake address.",
          "Creating multiple profiles for one location.",
          "Listing service areas you do not cover.",
          "Buying reviews or posting fake ones.",
          "Ignoring suspension notices and verification requests.",
        ],
      },
      {
        "heading": "A worked example and common mistakes",
        "paragraphs": [
          "Here is a made-up example. An independent bike shop in Portland, Oregon, has a profile created years ago by a former employee. The name includes the keywords Best Bike Repair Portland, the category is Store, and the hours are wrong on holidays. The owner takes control of the profile through the verification process and fixes it step by step.",
          "She changes the name to the real shop name, because stuffed names break the guidelines. She sets the primary category to Bicycle repair shop and keeps Bicycle store as a secondary one. She adds the services she offers, such as basic tune up, brake adjustment and wheel building, each with a short description. She uploads photos of the shop front, the workshop and the team, and adds special hours for the next holiday. She adds the booking link to the repair booking page and a UTM tag to the website link so visits show in her analytics.",
          "She then asks customers for reviews with a short link, replies to each one, and posts a short update each month about seasonal offers. After some weeks she looks at insights for calls, direction requests and website clicks.",
          "Here are the mistakes that cost people the most."
        ],
        "bullets": [
          "Leaving an old owner or agency with access.",
          "Adding keywords or phone numbers to the name.",
          "Picking a broad category instead of a specific one.",
          "Using stock photos.",
          "Wrong holiday hours.",
          "Ignoring or arguing with reviewers.",
          "Ignoring verification emails or suspension notices."
        ]
      },
      {
        "heading": "How to decide and what to do this week",
        "paragraphs": [
          "Use this short audit to decide what to fix first on your own profile. Open it in a private window to see what customers see, then check each point below."
        ],
        "bullets": [
          "Does the name match your signage exactly?",
          "Is the primary category the most specific one that fits?",
          "Are services listed with plain descriptions?",
          "Are the hours, including holiday hours, correct today?",
          "Are there recent photos of real work and real people?",
          "Have you replied to every review in the last month?"
        ]
      },
      {
        heading: "How Moonlab can help",
        paragraphs: [
          "We help set up and look after profiles and automate review requests. See /services/seo and /services/marketing. Wider checklist: /guides/local-seo-checklist.",
          "A free 30-minute automation audit at /contact can cover your profile too.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can I put keywords in my Google Business Profile name?",
        a: "No. Use your real business name. Keyword stuffing breaks Google's guidelines and can lead to suspension.",
      },
      {
        q: "How do I choose the right category?",
        a: "Pick the most specific category that describes your main service, then add true secondary ones.",
      },
      {
        q: "How often should I post photos and updates?",
        a: "A few photos and an update each month is a good rhythm. Consistency matters more than volume.",
      },
      {
        q: "Should I hide my address?",
        a: "If you serve customers at their location and do not receive visitors, yes, and set a service area instead.",
      },
      {
        q: "What if my profile is suspended?",
        a: "Read the notice, fix the issue, and appeal through Google's process. Keep proof of your business ready.",
      },
    ],
    services: ["seo", "marketing", "content-and-social"],
    category: "Websites & SEO",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "seo-for-trades-and-home-services",
    title: "SEO for Plumbers, Electricians and Home Services",
    description:
      "SEO for trades and home services: service and area pages, Google Business Profile, reviews and a site built to get calls, for plumbers and electricians.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "seo for plumbers",
      "seo for electricians",
      "seo for home services",
      "seo for roofers",
      "seo for cleaning companies",
    ],
    intro: [
      "SEO for trades and home services comes down to three things: a strong Google Business Profile, a website with a page for each service and area you cover, and a steady flow of real reviews. People searching for a plumber or roofer want a phone number fast, so the site must make calling easy.",
      "This guide is for plumbers, electricians, roofers, cleaners, landscapers and similar businesses in the US, UK and Europe. It explains what to put on your site, how to handle service areas, how emergency searches differ, and what to avoid. Nobody can promise a top ranking, so this focuses on what you control.",
    ],
    sections: [
      {
        heading: "How people search for trades",
        paragraphs: [
          "Most searches are local and urgent: plumber near me, emergency electrician in Leeds, roof repair Austin. Many are done on a phone, often with Google Maps results at the top. That is why your Google Business Profile matters as much as your website.",
          "Some searches are planned, such as bathroom fitting or kitchen rewiring. These people compare several businesses and read reviews and photos. Your site should serve both groups.",
        ],
      },
      {
        heading: "Set up your Google Business Profile first",
        paragraphs: [
          "Claim and complete it, with the right category, services, hours and photos of real jobs. Set a service area if you travel to customers. See /guides/google-business-profile-optimization for the full steps.",
          "Keep your name, address and phone number consistent everywhere, as in /guides/local-seo-checklist.",
        ],
      },
      {
        heading: "Build one page per service",
        paragraphs: [
          "A single Services page rarely ranks for anything. Create a separate page for each main service: boiler repair, drain unblocking, fuse board upgrades, roof repair, end of tenancy cleaning.",
          "Each page should explain what you do, who it is for, how the process works, rough timing, any guarantees and a clear call button. Add photos of real work and a few reviews. Write for the customer, not for a search engine.",
        ],
        bullets: [
          "A clear heading with the service and the area.",
          "What is included and what is not.",
          "How to book, and how quickly you can attend.",
          "Common questions and short answers.",
          "Licences, insurance and accreditations you hold.",
        ],
      },
      {
        heading: "Area pages without spam",
        paragraphs: [
          "If you serve several towns, an area page for each main one can help, but only if each has real content. Mention actual jobs done there, local landmarks, response times and local reviews.",
          "Do not create dozens of near identical pages with a town name swapped in. Google considers that low quality. Better to have five good area pages than fifty thin ones.",
        ],
      },
      {
        heading: "Emergency and out of hours",
        paragraphs: [
          "If you offer emergency call outs, say so clearly, with hours, response areas and how to reach you. Put the phone number at the top of every page and make it tap to call on mobile.",
          "Add a missed call text back and online booking so out of hours enquiries are not lost. See /guides/missed-call-text-back-and-online-booking.",
        ],
      },
      {
        heading: "Reviews, photos and proof",
        paragraphs: [
          "Customers choose trades they trust. Ask for a review after every job and show the best ones on your site. Post photos of finished work with permission, and mention registrations such as Gas Safe in the UK or state licensing in the US, only if you hold them.",
          "Do not invent credentials or reviews. Both are against the rules and can create legal problems.",
        ],
      },
      {
        heading: "What to track",
        paragraphs: [
          "Track phone calls, form submissions and direction requests, not only visits. Use call tracking carefully so your phone number stays consistent. Ask every new customer how they found you.",
          "Review Search Console monthly to see which searches show your pages, and add content for ones you are missing.",
        ],
      },
      {
        "heading": "A worked example and common mistakes",
        "paragraphs": [
          "Here is a made-up example. A roofing company in Denver has a five page website: home, about, services, gallery and contact. Calls come mostly from word of mouth. The owner decides to build search visibility.",
          "First he completes the Google Business Profile with the right category, a service area covering the towns he works in and photos of recent jobs. Next he replaces the single services page with separate pages for roof repair, roof replacement, gutter work and storm damage. Each page explains the process, shows a before and after photo set from a real job, lists the materials used, and has a tap to call button at the top. He adds two area pages for the two largest towns he serves, each with real jobs and a local review.",
          "He asks every customer for a review the same day the job is finished, using a text with a direct link. He tracks calls with a note on each lead asking where they found him. After a few months he checks Search Console to see what people searched for, and adds a page about insurance claims after hail, because he sees people searching for it.",
          "Here are the mistakes to avoid."
        ],
        "bullets": [
          "One page for all services.",
          "Dozens of thin town pages written from a template.",
          "No phone number visible on mobile.",
          "Claiming licences or accreditations you do not hold.",
          "Stock photos instead of real jobs.",
          "Not replying to reviews.",
          "Ignoring out of hours enquiries.",
          "Buying cheap links from a vendor who promises first place."
        ]
      },
      {
        "heading": "How to decide and what to do this week",
        "paragraphs": [
          "When time is short, decide where to spend it with these questions. The answers usually point to one clear first task."
        ],
        "bullets": [
          "Does a customer on a phone see a tap to call number within a second?",
          "Is there a separate page for each service that earns you money?",
          "Do you have enough real reviews to compare well with nearby competitors?",
          "Do you have real photos of finished jobs to put on service pages?",
          "Do you cover areas where you could write something genuine?",
          "Can you answer calls or messages quickly, including out of hours?"
        ]
      },
      {
        heading: "How Moonlab can help",
        paragraphs: [
          "We build fast service websites, local SEO and the follow-up automations that turn calls into booked jobs. See /services/seo, /services/web-development and /services/sales-and-leads.",
          "A free 30-minute automation audit at /contact is a good first step.",
        ],
      },
    ],
    faqs: [
      {
        q: "How do plumbers get more calls from Google?",
        a: "Complete your Google Business Profile, build a page for each service and area, collect reviews and make calling easy on your site.",
      },
      {
        q: "Do I need a page for every town?",
        a: "Only for towns you serve and can write something genuine about. Avoid near duplicate pages.",
      },
      {
        q: "Is a website needed if I have a Google profile?",
        a: "A profile helps, but a website supports rankings and trust and gives you somewhere to show services and proof.",
      },
      {
        q: "How long does SEO take for a trades business?",
        a: "Often several months, and it varies by competition. Profile improvements can show results sooner.",
      },
      {
        q: "Should I pay for ads too?",
        a: "Ads can bring calls faster while SEO builds. See /guides/google-ads-for-small-business.",
      },
    ],
    services: ["seo", "web-development", "sales-and-leads"],
    category: "Websites & SEO",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "website-redesign-checklist",
    title: "Website Redesign Checklist: Keep Your Traffic",
    description:
      "A website redesign checklist to protect your search traffic: benchmarks, URL mapping, 301 redirects, content, analytics and the post-launch checks that matter.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "website redesign checklist",
      "website redesign seo",
      "301 redirects website redesign",
      "url mapping",
      "redesign without losing traffic",
    ],
    intro: [
      "To redesign a website without losing traffic, record what you have now, map every old URL to a new one, set up 301 redirects, keep the content that performs and check analytics and Search Console right after launch. Most traffic losses come from broken URLs and removed pages, not from the new design.",
      "This checklist is for owners and managers who are about to hire a designer or rebuild their own site. It gives a step by step order, with what to ask your developer. A redesign can cause a temporary dip even when done well, and we cannot guarantee how Google will respond, so the aim is to reduce risk.",
    ],
    sections: [
      {
        heading: "1. Decide why you are redesigning",
        paragraphs: [
          "Write down the goal: more enquiries, faster mobile pages, a new brand or easier updates. A clear goal helps you decide what to change and what to keep.",
          "If the site already ranks well, change as little of the structure as you can. A redesign is a chance to improve, not to start over.",
        ],
      },
      {
        heading: "2. Benchmark the current site",
        paragraphs: [
          "Before anything changes, save your data. You will need it to measure the result.",
        ],
        bullets: [
          "Export top pages and queries from Google Search Console.",
          "Record visits, enquiries and conversions in Google Analytics.",
          "Crawl the site with a tool to list every URL, title and heading.",
          "Note rankings for your main search terms.",
          "Take backups of the old site and database.",
          "Record page speed scores for key pages.",
        ],
      },
      {
        heading: "3. Map every old URL to a new one",
        paragraphs: [
          "Make a spreadsheet with a column for each old URL and a column for its new address. If the address stays the same, great. If it changes, or the page is gone, decide where visitors should land.",
          "Send old pages to the most relevant new page, not the home page. Send removed pages to a close alternative. Keep URL structures as stable as possible, because every change is a risk.",
        ],
      },
      {
        heading: "4. Set up 301 redirects",
        paragraphs: [
          "A 301 redirect tells browsers and Google that a page has moved permanently. Implement your URL map as redirects on the server or in your platform. Avoid chains of redirects, where one leads to another.",
          "Test every redirect before launch on a staging copy, and again after launch. Check redirects from the http and www versions as well.",
        ],
      },
      {
        heading: "5. Protect your content and on page SEO",
        paragraphs: [
          "Keep titles, headings, text and internal links that bring traffic. If you rewrite, keep the same topics and the same intent. Do not delete pages that get visits or have links from other sites, merge them with care.",
          "Check that images keep alt text, structured data carries over and the canonical tags point to the right place. Make sure the staging site is blocked from search, and that the block is removed at launch.",
        ],
      },
      {
        heading: "6. Check analytics, forms and tracking",
        paragraphs: [
          "Install analytics and any ad or conversion tags on the new site before launch. Test forms, phone clicks, booking links and the thank you pages. Check your cookie consent setup, as in /guides/cookie-consent-uk-eu.",
          "Verify the site in Search Console and submit your sitemap after launch.",
        ],
      },
      {
        heading: "7. Launch and check straight away",
        paragraphs: [
          "Launch at a quiet time. Right after, crawl the new site, check for errors and test the key journeys on a phone. Watch Search Console for crawl errors and coverage issues over the next weeks.",
          "Expect some fluctuation. If traffic drops sharply, look first for missing redirects, blocked pages or changed titles.",
        ],
        bullets: [
          "Check that the robots file allows crawling.",
          "Check every redirect from your map.",
          "Check page speed and mobile layout.",
          "Compare traffic and enquiries with your benchmark weekly for a couple of months.",
        ],
      },
      {
        "heading": "A worked example and common mistakes",
        "paragraphs": [
          "Here is a made-up example. A dental practice in Glasgow has a twelve year old website with about forty pages. Most search visits go to the home page, a page on teeth whitening and a page on emergency appointments. They plan a redesign with a new look and a new platform.",
          "Before starting, they export the top pages from Search Console and crawl the site to list every URL. They discover that the old site uses addresses such as /treatments/whitening.html, while the new platform would use /whitening. In the URL map, each old address is paired with its new one, and the developer sets up a permanent 301 redirect for each. The emergency page keeps its text and heading, because it brings calls, and the whitening page is expanded, not replaced.",
          "On launch day they check the redirects, the sitemap, the tracking on the booking form and that the staging block is off. For the next eight weeks they compare clicks and impressions in Search Console with their benchmark, and fix any 404 errors they find. A small dip in the first weeks is not a cause for panic, but a sharp loss on one page usually points to a missing redirect.",
          "These are the errors that cause the biggest losses."
        ],
        "bullets": [
          "Leaving the staging site blocked from search after launch.",
          "Redirecting every old page to the home page.",
          "Deleting pages that had links from other sites.",
          "Changing titles and headings on pages that already rank.",
          "Forgetting analytics, conversion tracking or cookie consent.",
          "Launching without a backup of the old site.",
          "Not watching Search Console for crawl errors afterwards."
        ]
      },
      {
        "heading": "How to decide and what to do this week",
        "paragraphs": [
          "Before you sign off a redesign, put these questions to the designer or developer. Clear written answers are a good sign."
        ],
        "bullets": [
          "Will every old URL with traffic or links redirect to a relevant new page?",
          "Which pages and text are staying exactly as they are?",
          "How and when will the staging block be removed?",
          "Who tests forms, tracking and cookie consent before launch?",
          "What is the plan if traffic drops after launch?",
          "Do we have a full backup of the old site and a way to restore it?"
        ]
      },
      {
        heading: "How Moonlab can help",
        paragraphs: [
          "We plan redesigns with the redirect map and tracking in place from day one. See /services/web-development, /services/seo and /services/ui-ux-design. For a check of your current site first, see /guides/website-audit-checklist-small-business.",
          "A free 30-minute automation audit at /contact can open the conversation.",
        ],
      },
    ],
    faqs: [
      {
        q: "Will a redesign hurt my SEO?",
        a: "It can if URLs, content or tracking are mishandled. With a URL map, redirects and checks, the risk is much lower, though a temporary dip can still happen.",
      },
      {
        q: "What is a 301 redirect?",
        a: "A permanent redirect that sends visitors and search engines from an old URL to a new one.",
      },
      {
        q: "Should I change my URLs?",
        a: "Only if you have a good reason. Keeping URLs the same is the safest choice.",
      },
      {
        q: "How long until traffic recovers?",
        a: "It varies. Many sites settle within weeks, but there is no fixed time.",
      },
      {
        q: "Do I need a staging site?",
        a: "Yes. Build and test on a private copy, block it from search, and launch when ready.",
      },
    ],
    services: ["web-development", "seo", "ui-ux-design"],
    category: "Websites & SEO",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "landing-page-that-converts",
    title: "Landing Page That Converts: A Service Page Structure",
    description:
      "How to structure a landing page that converts for a service business: headline, proof, offer, form and follow-up, with a section outline you can copy.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "landing page that converts",
      "service landing page",
      "landing page structure",
      "landing page best practices",
      "landing page for small business",
    ],
    intro: [
      "A landing page that converts has one job, one offer and one action. It states what you do and for whom, shows proof, answers the main doubts and gives an easy way to enquire. Remove everything that does not help the visitor decide.",
      "This guide gives a section by section structure for a service landing page, with tips on wording, forms and testing. It suits plumbers, accountants, clinics, agencies and similar service businesses, whether visitors come from search or from ads. We do not quote conversion rates, because they vary widely. Measure your own.",
    ],
    sections: [
      {
        heading: "Start with one goal and one audience",
        paragraphs: [
          "Decide what a visitor should do: call, request a quote or book a slot. Then write for one type of customer. A page that tries to serve everyone convinces nobody.",
          "If your ad or search term is about boiler repair, the page should be about boiler repair, not a list of all your services.",
        ],
      },
      {
        heading: "The headline and first screen",
        paragraphs: [
          "The top of the page must answer three questions in seconds: what is this, is it for me and what do I do next. Use a clear headline that names the service and the benefit, a short supporting line, and one main button.",
          "Put the phone number or call button where thumbs can reach it on mobile. Keep a real photo of your work or team beside the text, not an abstract stock image.",
        ],
      },
      {
        heading: "Show proof early",
        paragraphs: [
          "People trust evidence more than claims. Place review ratings, a couple of short real testimonials, logos of accreditations you hold and photos of finished work near the top.",
          "Use only real reviews and credentials. Do not invent numbers. If you have a figure that is true and you can back it up, such as years in business, use it.",
        ],
      },
      {
        heading: "Explain the offer and the process",
        paragraphs: [
          "Say exactly what the customer gets and how it works in three to five steps, from enquiry to finished job. A simple process reduces fear.",
        ],
        bullets: [
          "What is included and what is not.",
          "How quickly you reply and when you can start.",
          "Price guidance or what the price depends on.",
          "Guarantees and insurance, where true.",
        ],
      },
      {
        heading: "Answer objections with a short FAQ",
        paragraphs: [
          "List the questions customers ask before booking: cost, timing, mess, guarantees, areas covered, payment. Short, direct answers remove reasons to hesitate.",
          "Real questions from your calls and emails are better than invented ones.",
        ],
      },
      {
        heading: "Make the form short and clear",
        paragraphs: [
          "Ask only what you need: name, phone or email and a short description. Every extra field loses some people. Say what happens next, for example that you will call within a business hour.",
          "Reply fast. A good page wasted by a slow response loses the enquiry. See /guides/speed-to-lead for how to reply in minutes.",
        ],
      },
      {
        heading: "Speed, mobile and measurement",
        paragraphs: [
          "Most visits come from phones. Check that the page loads quickly and reads well on a small screen. See /guides/website-speed-core-web-vitals.",
          "Track form submissions and calls as conversions. Change one thing at a time, such as the headline, and let enough visits pass before judging. With low traffic, you may only be able to learn from simple before and after comparisons.",
        ],
      },
      {
        "heading": "A worked example and common mistakes",
        "paragraphs": [
          "Here is a made-up example. Say a boiler repair company in Manchester gets most of its leads from a Google ad, and the ad sends people to the home page. Visitors see a menu with eight links, a slider and a paragraph about the company history. Few of them call. The owner builds one landing page just for boiler repair instead.",
          "The new page opens with the headline Boiler repair in Manchester, usually same day, a one line promise, a tap to call button and a photo of the engineer in a branded van. Directly below come the Google rating and two short real reviews. Then a four step process (call or send the form, get a quote, an engineer attends, you pay after the work), a short list of what the visit includes, and five questions about price and guarantees. The form asks for name, phone and a one line description of the problem.",
          "The owner changes the ad link, watches calls and form fills for a few weeks and compares them with the old page. With low traffic the result is a rough guide, not proof, but the direction is usually clear. Nothing about this needs clever tricks. It needs a page that answers the question the visitor arrived with.",
          "Use this checklist before you publish. Each item below is a common reason landing pages fail."
        ],
        "bullets": [
          "The ad or search term and the headline say different things.",
          "Several competing buttons, so visitors do not know what to do.",
          "Proof is hidden at the bottom of a long page.",
          "Stock photos of smiling strangers instead of real work.",
          "A form with ten fields, or a form that needs an account.",
          "No phone number on mobile, or a number that is not tappable.",
          "Slow loading from large images, which loses visitors before they read.",
          "No tracking, so you cannot tell which page version works."
        ]
      },
      {
        "heading": "How to decide and what to do this week",
        "paragraphs": [
          "Before you send any money or traffic to a landing page, run through these quick tests. They take about fifteen minutes and catch most obvious problems."
        ],
        "bullets": [
          "Ask someone who has never seen it what the page offers after five seconds.",
          "Check that the headline matches the ad or search the visitor came from.",
          "Load it on a mid range phone over mobile data and see how long it takes.",
          "Tap every button and submit the form yourself, and check the notification arrives.",
          "Check that the thank you page fires your conversion tracking.",
          "Read it aloud and cut every sentence that does not help a decision."
        ]
      },
      {
        heading: "How Moonlab can help",
        paragraphs: [
          "We design and build landing pages with tracking and instant follow-up. See /services/web-development, /services/paid-ads and /services/ui-ux-design.",
          "A free 30-minute automation audit at /contact can include a look at your current page.",
        ],
      },
    ],
    faqs: [
      {
        q: "What makes a landing page convert?",
        a: "A clear offer, proof, a simple process, answers to doubts and one easy action, on a page that loads quickly on mobile.",
      },
      {
        q: "How long should a landing page be?",
        a: "As long as it needs to answer the visitor's questions. Higher priced or riskier services usually need more explanation.",
      },
      {
        q: "Should I remove the menu?",
        a: "For ad landing pages, a simpler header with fewer links often helps focus. Test it.",
      },
      {
        q: "How many form fields should I use?",
        a: "As few as you can. Name, contact details and a short message is often enough.",
      },
      {
        q: "How do I test a landing page?",
        a: "Change one element at a time, track enquiries and compare over enough visits. Avoid conclusions from a handful of visitors.",
      },
    ],
    services: ["web-development", "paid-ads", "ui-ux-design"],
    category: "Websites & SEO",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "cookie-consent-uk-eu",
    title: "Cookie Consent for UK and EU Websites: The Basics",
    description:
      "Cookie consent basics for UK and EU websites: PECR, ePrivacy and GDPR, consent before non-essential cookies, and Google Consent Mode v2. Not legal advice.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "cookie consent uk eu",
      "cookie banner requirements",
      "pecr cookies",
      "google consent mode v2",
      "gdpr cookie consent",
    ],
    intro: [
      "If your website serves visitors in the UK or EU and uses cookies or similar technologies that are not strictly necessary, such as analytics or advertising tags, you generally need to get consent before they are set. A banner that says by using this site you agree is not enough.",
      "This guide explains the basics in plain terms: the rules, what counts as essential, what a compliant banner looks like and what Google Consent Mode v2 is. This is not legal advice. Rules vary by country and are interpreted by regulators, so check with a qualified adviser, and read your national regulator's guidance, such as the ICO in the UK.",
    ],
    sections: [
      {
        heading: "The rules in short",
        paragraphs: [
          "In the UK, the Privacy and Electronic Communications Regulations (PECR) govern cookies and similar technologies, alongside UK GDPR for personal data. In the EU, the ePrivacy Directive, implemented in each country, works with the GDPR.",
          "The common principle is that you need consent for storing or accessing information on a visitor's device, unless it is strictly necessary for a service the user asked for. Consent must meet the GDPR standard: freely given, specific, informed and an unambiguous action.",
        ],
      },
      {
        heading: "What needs consent and what does not",
        paragraphs: [
          "Strictly necessary cookies, such as ones that remember items in a basket or keep a login secure, do not need consent, although you should still mention them in your policy. Most others do.",
        ],
        bullets: [
          "Usually needs consent: advertising and retargeting tags, social media pixels, most analytics cookies.",
          "May not need consent: security, load balancing, basket contents, remembering a consent choice.",
          "Regulators differ on some analytics. Some allow limited, privacy friendly analytics without consent. Check your regulator's guidance.",
        ],
      },
      {
        heading: "What a compliant banner looks like",
        paragraphs: [
          "Non essential cookies must not run until the visitor opts in. The banner should explain in plain words what the cookies are for, name categories and let people accept or reject as easily as each other.",
          "Avoid pre ticked boxes, hiding reject behind extra clicks and nudging with colors in a misleading way. Let people change their mind later through a link in the footer. Keep a record of choices.",
        ],
        bullets: [
          "Accept and reject buttons with equal prominence.",
          "Granular choices by category.",
          "A link to your cookie and privacy policy.",
          "A way to withdraw consent at any time.",
        ],
      },
      {
        heading: "Your cookie and privacy policy",
        paragraphs: [
          "List the cookies and similar technologies you use, who sets them, what they do and how long they last. A scan tool in your consent platform can help build this list.",
          "Update the list when you add a new tool. Many sites fail because a plugin quietly adds a tracker.",
        ],
      },
      {
        heading: "Google Consent Mode v2, in general terms",
        paragraphs: [
          "Google Consent Mode lets your site tell Google tags whether a visitor has agreed to analytics and advertising storage. The tags then adjust their behavior. Version 2 added signals for ad user data and ad personalization, and Google has said it is needed to use some features with audiences in the European Economic Area.",
          "Consent Mode does not replace a consent banner. You still need a properly set up consent management platform that sends the choice to Google. Check Google's current documentation for the exact requirements, because they change.",
        ],
      },
      {
        heading: "Setting it up on your site",
        paragraphs: [
          "Choose a consent management platform that suits your site, such as one built into your website builder or a dedicated service. Check its pricing and whether it supports Consent Mode v2 and your country's rules.",
          "Then test. Open your site in a private window, decline cookies and use browser developer tools to check that no analytics or ad cookies are set. Test again after any change to your tags.",
        ],
      },
      {
        heading: "What about the US?",
        paragraphs: [
          "The US has no single cookie consent law. Some states have privacy laws that give residents opt out rights for targeted advertising and the sale of data, and California's rules are a well known example. If you serve US visitors, check which state laws apply and offer clear opt out options. Ask a professional.",
        ],
      },
      {
        "heading": "A worked example and common mistakes",
        "paragraphs": [
          "Here is a made-up example. A furniture shop in Lyon sells across the EU and the UK, and uses Google Analytics, a Meta pixel and a live chat widget. Its banner currently says that by continuing you accept cookies, and the tags fire as soon as the page loads.",
          "The owner replaces it with a consent platform. The banner now has Accept all, Reject all and Choose buttons of equal weight, and groups cookies into necessary, analytics and marketing. The tags are set up through a tag manager so analytics and the Meta pixel only fire after consent for their category. Consent Mode v2 is enabled so Google tags receive the visitor's choice. The chat widget is moved behind the functional or marketing category, depending on what it stores.",
          "She tests in a private window, rejects all, and uses the browser developer tools to confirm that no analytics or marketing cookies are set. She then accepts and confirms they load. She adds a footer link to reopen settings, updates the cookie policy with the list of cookies, and schedules a quarterly check for new trackers.",
          "A professional can confirm the setup for her markets. Here are the mistakes to avoid."
        ],
        "bullets": [
          "Loading tags before consent.",
          "Making Reject harder to find than Accept.",
          "Pre ticked boxes.",
          "Copying a policy that lists cookies you do not use.",
          "Forgetting trackers added by plugins or embedded videos.",
          "No way to change your mind later.",
          "Assuming a banner alone makes Consent Mode work."
        ]
      },
      {
        "heading": "How to decide and what to do this week",
        "paragraphs": [
          "A short self check helps you see where you stand before you speak to a professional. Go through each point on your live site."
        ],
        "bullets": [
          "Open the site in a private window and decline everything. Are any analytics or marketing cookies set?",
          "Does the banner give Accept and Reject equal prominence?",
          "Is there a footer link to change your choice?",
          "Does your cookie policy list what the site really uses?",
          "Do you know which plugins and embeds add trackers?",
          "Is Consent Mode set up, if you run Google ads or analytics for EU visitors?"
        ]
      },
      {
        heading: "How Moonlab can help",
        paragraphs: [
          "We set up consent tools, tag management and tracking in a way that respects choices. See /services/web-development and /services/data-and-analytics. For AI and data questions, see /guides/gdpr-ai-automation.",
          "A free 30-minute automation audit at /contact can cover your tracking setup.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do I need a cookie banner?",
        a: "If you use non-essential cookies or trackers for visitors in the UK or EU, you generally need consent first. Strictly necessary cookies do not.",
      },
      {
        q: "Is Google Analytics subject to consent?",
        a: "In most cases yes in the UK and EU, though regulators differ on some setups. Check current guidance.",
      },
      {
        q: "What is Google Consent Mode v2?",
        a: "A way to pass visitors' consent choices to Google tags so they adjust behavior. It works alongside a consent banner, not instead of one.",
      },
      {
        q: "Can I use implied consent?",
        a: "Generally not. Consent should be a clear, active choice.",
      },
      {
        q: "Does this apply to a small site?",
        a: "Yes. The rules apply based on what the site does and who visits, not on its size.",
      },
    ],
    services: ["web-development", "data-and-analytics", "seo"],
    category: "Websites & SEO",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "website-accessibility-small-business",
    title: "Website Accessibility for Small Business: WCAG Basics",
    description:
      "Website accessibility for small business: WCAG basics, quick checks anyone can do, the European Accessibility Act and ADA in general terms. Not legal advice.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "website accessibility",
      "wcag basics",
      "european accessibility act",
      "ada website compliance",
      "accessible website checklist",
    ],
    intro: [
      "An accessible website can be used by people with disabilities, such as someone using a screen reader, a keyboard only or who has low vision. The standard most often used is WCAG, the Web Content Accessibility Guidelines. Good accessibility also helps everyone, including people on phones and in bright sun.",
      "This guide covers WCAG basics, quick checks you can do today and what the European Accessibility Act and the ADA in the US mean in general terms. This is not legal advice. Whether a law applies to you depends on your business, your products and your country, so check with a qualified professional.",
    ],
    sections: [
      {
        heading: "What WCAG is",
        paragraphs: [
          "WCAG is a set of guidelines published by the W3C. It is organized around four ideas: content must be perceivable, operable, understandable and robust. Each guideline has success criteria at levels A, AA and AAA. Level AA is the usual target.",
          "WCAG 2.1 and 2.2 are the versions in common use. The European standard EN 301 549, used for the European Accessibility Act, refers to WCAG. Check which version your market expects.",
        ],
      },
      {
        heading: "Quick checks you can do today",
        paragraphs: [
          "You do not need to be a developer to find the most common problems. Try these on your home page and your key service pages.",
        ],
        bullets: [
          "Tab through the page with only your keyboard. Can you reach and use every link, button and form? Is the focus visible?",
          "Zoom the page to 200 percent. Does it still work without sideways scrolling?",
          "Check text contrast. Light grey text on white is a common failure.",
          "Check that all meaningful images have alt text.",
          "Check that forms have labels, not only placeholder text.",
          "Check headings are in order and links say where they go, not click here.",
          "Play any video with captions on.",
        ],
      },
      {
        heading: "Free tools",
        paragraphs: [
          "Automated tools such as WAVE, Lighthouse in Chrome and axe browser extensions find many issues. They catch only a portion of problems, so use them as a start. Try a screen reader such as NVDA on Windows or VoiceOver on Mac and iPhone on one key page.",
          "Manual testing with real assistive technology and, ideally, disabled users gives the best picture.",
        ],
      },
      {
        heading: "The European Accessibility Act",
        paragraphs: [
          "The European Accessibility Act (EAA) is an EU directive. Its requirements apply from 28 June 2025 to certain products and services, including e-commerce services, consumer banking, e-books, and passenger transport services. Each EU country has its own national law, and enforcement differs.",
          "Microenterprises providing services are exempt, with a microenterprise generally defined as fewer than 10 staff and turnover or balance sheet under 2 million euros. The exemption is for services, not for products. If you sell into the EU, check whether you are in scope and whether the exemption applies. Ask a professional.",
        ],
      },
      {
        heading: "ADA and the US",
        paragraphs: [
          "In the US, the Americans with Disabilities Act is used in lawsuits over inaccessible websites, and courts have taken different views on its reach. There is no single technical standard written into the law for private websites, but WCAG 2.1 AA is widely used as the benchmark. Public sector sites have specific rules.",
          "Demand letters and lawsuits against small businesses do occur. Reducing risk comes from actually making the site accessible and keeping a record of your efforts. Talk to an attorney if you receive a claim.",
        ],
      },
      {
        heading: "UK position",
        paragraphs: [
          "In the UK, the Equality Act 2010 requires service providers to make reasonable adjustments for disabled people, which can include websites. Public sector bodies have specific accessibility regulations. There is no equivalent of the EAA in UK law, though UK businesses selling into the EU may be affected.",
        ],
      },
      {
        heading: "A practical plan for a small business",
        paragraphs: [
          "Fix the basics first, because they help the most people and are cheap. Pick the pages that matter, such as your home, contact, booking and checkout pages.",
          "Write an accessibility statement saying what you have done and how to get help. Add a contact route for users with problems. Ask your web provider to build to WCAG 2.2 AA, and add checks to your launch list. See /guides/website-audit-checklist-small-business.",
        ],
      },
      {
        "heading": "A worked example and common mistakes",
        "paragraphs": [
          "Here is a made-up example. A small online homeware shop in Cork sells to Ireland, the UK and other EU countries, and wants to know where it stands. The owner starts with a one hour test of the home page, a product page and the checkout.",
          "She tabs through each page with the keyboard and finds that the menu cannot be opened without a mouse and the focus outline is hidden. She zooms to 200 percent and finds the checkout button runs off the screen. A contrast check shows grey product prices on white are hard to read. She runs WAVE and finds missing alt text on product images and unlabeled form fields. A short test with a screen reader shows the Add to basket buttons are all announced as button.",
          "She sends the list to her developer, ordered by how many people each problem affects: keyboard menu and focus first, then form labels, button names, contrast and alt text. She asks for a fix of the checkout before the others. After the fixes she repeats the tests, writes a short accessibility statement with a contact email, and adds the checks to her launch list for new pages. She asks an adviser whether the European Accessibility Act applies to her shop.",
          "Avoid these mistakes."
        ],
        "bullets": [
          "Relying on an overlay widget to fix everything.",
          "Testing only with automated tools.",
          "Using color alone to show errors.",
          "Placeholder text instead of form labels.",
          "Videos with no captions.",
          "Links that say click here.",
          "Treating accessibility as a one time project."
        ]
      },
      {
        "heading": "How to decide and what to do this week",
        "paragraphs": [
          "To decide what to fix first, rank problems by how many people they stop and how cheap they are to repair. Use this order as a starting point."
        ],
        "bullets": [
          "Keyboard access and visible focus on menus, forms and checkout.",
          "Form labels and clear error messages.",
          "Color contrast of text and buttons.",
          "Alt text for meaningful images and names for icon buttons.",
          "Captions for video and a transcript for audio.",
          "A page structure with headings in a sensible order."
        ]
      },
      {
        heading: "How Moonlab can help",
        paragraphs: [
          "We build with accessibility in mind and can review an existing site. See /services/web-development and /services/ui-ux-design.",
          "A free 30-minute automation audit at /contact can include a quick accessibility check of your key pages.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is WCAG?",
        a: "The Web Content Accessibility Guidelines, an international standard for making web content accessible. Level AA is the common target.",
      },
      {
        q: "Does the European Accessibility Act apply to me?",
        a: "It applies from 28 June 2025 to certain products and services, including e-commerce, with an exemption for microenterprise services. Check with a professional.",
      },
      {
        q: "Can I be sued under the ADA over my website?",
        a: "It happens in the US. WCAG 2.1 AA is a common benchmark. Seek legal advice if you receive a claim.",
      },
      {
        q: "Are accessibility overlays enough?",
        a: "Overlays alone generally do not fix the underlying problems and are criticized by many accessibility experts. Fix the code and content.",
      },
      {
        q: "Where should I start?",
        a: "Keyboard use, contrast, alt text, form labels and headings on your key pages.",
      },
    ],
    services: ["web-development", "ui-ux-design", "seo"],
    category: "Websites & SEO",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "mobile-app-development-cost",
    title: "Mobile App Development Cost: What Drives the Price",
    description:
      "What drives mobile app development cost: features, platforms, Flutter or React Native vs native, backend and upkeep. Rough ranges, clearly labeled.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "mobile app development cost",
      "how much does an app cost",
      "flutter vs react native cost",
      "app development cost for small business",
      "app maintenance cost",
    ],
    intro: [
      "Mobile app development cost depends on what the app does, how many platforms it supports, whether it needs a backend and who builds it. A simple app can cost a few thousand dollars or pounds. A complex one with payments, maps and live features can run to many tens of thousands or more. These are rough ranges and vary widely.",
      "This guide explains the main cost drivers, native versus cross-platform choices such as Flutter and React Native, the backend and ongoing costs that people forget and how to get quotes you can compare. It is for owners in the US, UK and Europe. Prices differ by country and provider, so always get written quotes for your own brief.",
    ],
    sections: [
      {
        heading: "Features are the biggest driver",
        paragraphs: [
          "Every feature takes design, build, testing and fixing time. A simple app that shows information and takes a booking is much cheaper than one with accounts, payments, chat and live tracking.",
          "Write a list of features and sort it into must have, should have and later. Most first versions should contain only the must haves. See /guides/mvp-development-guide for how to scope one.",
        ],
        bullets: [
          "Low effort: static content, simple forms, push notifications.",
          "Medium effort: user accounts, bookings, in app purchases, dashboards.",
          "High effort: real time features, maps and tracking, video, complex roles and permissions, offline sync.",
        ],
      },
      {
        heading: "Platforms: iOS, Android or both",
        paragraphs: [
          "Building for iPhone and Android separately, with native code, usually costs more than building once with a cross-platform tool. Many small businesses start with one platform that most customers use, or a web app that works on both.",
          "Check your own customers. A business in the UK or US may have a mix, so look at what your website analytics says about phones.",
        ],
      },
      {
        heading: "Native vs cross-platform: Flutter and React Native",
        paragraphs: [
          "Native apps use Swift for iOS and Kotlin for Android. They give the best access to device features, but you build two apps. Flutter and React Native let one team build for both from a mostly shared codebase, which usually cuts cost and time.",
          "For most business apps, cross-platform tools are good enough. Native can be a better choice for graphics heavy or hardware heavy apps. A progressive web app or a responsive web app is another option, and it avoids app store rules. See /services/web-apps-and-saas.",
        ],
      },
      {
        heading: "Design and user experience",
        paragraphs: [
          "Good design saves money later because it finds problems before anything is built. A custom visual design costs more than using standard components. Plan for design of the main screens and a simple clickable prototype before development begins. See /services/ui-ux-design.",
        ],
      },
      {
        heading: "Backend, hosting and integrations",
        paragraphs: [
          "Most apps need a backend: a server and database that store accounts and data. It also handles payments, emails and links to other systems such as your CRM or accounting tool. Integrations with third party services add time and can bring monthly fees.",
          "Hosting and cloud costs scale with use. Check the pricing pages of the services you pick, and ask your developer for an estimate at your expected user numbers.",
        ],
      },
      {
        heading: "Ongoing costs: upkeep, stores and updates",
        paragraphs: [
          "An app needs maintenance. New iOS and Android versions change what apps must do, libraries need updates and bugs appear. Many teams budget a share of the build cost each year for maintenance, and your developer can suggest a figure.",
          "Add the Apple Developer Program and Google Play developer fees, which are set by Apple and Google, so check their sites. Plan for support, analytics and store listing updates too.",
        ],
        bullets: [
          "Developer accounts for the app stores.",
          "Hosting, database and third party service fees.",
          "Updates for new operating system versions.",
          "Bug fixes and small changes.",
          "Support for users.",
        ],
      },
      {
        heading: "Who builds it: freelancer, studio or in house",
        paragraphs: [
          "A freelancer can be economical for a small app. A studio brings design, development and testing together. In house is for products at the center of your business.",
          "Rates vary widely by country and experience, and the cheapest quote is not the cheapest outcome. See /guides/outsourcing-software-development for how to choose safely.",
        ],
      },
      {
        "heading": "A worked example and common mistakes",
        "paragraphs": [
          "Here is a made-up example showing how scope changes cost, without quoting prices. A gym wants an app. Version A shows the class timetable, lets members book a class and sends a reminder. Version B adds member accounts with payment, workout tracking, a leaderboard, in app chat and an admin panel for staff.",
          "Version A needs a simple backend, a booking connection and notifications, and can be built once with Flutter or React Native for both iPhone and Android. Version B needs a full backend with payments, security reviews, many more screens, more testing and a larger design effort. The cost difference is large because every added feature multiplies the work for design, build and testing, and the maintenance that follows.",
          "The sensible route is to start with version A, or even a responsive web page for booking, and watch which extra features members ask for. Ask each studio to price version A as a fixed first phase, and to give a separate estimate for later phases. Ask what yearly maintenance would look like.",
          "Here are the mistakes that inflate cost."
        ],
        "bullets": [
          "Starting with every feature on the wish list.",
          "Building two separate native apps without a reason.",
          "Choosing a studio on the lowest quote alone.",
          "Leaving out the cost of maintenance and store accounts.",
          "No clear scope, so every change is extra.",
          "Skipping a prototype and finding design problems late.",
          "Not checking whether a website would do."
        ]
      },
      {
        "heading": "How to decide and what to do this week",
        "paragraphs": [
          "Use these criteria to decide what to build first and how to keep cost under control. Each one removes a cost driver."
        ],
        "bullets": [
          "Choose one platform or a web app for the first version.",
          "Pick a cross-platform tool unless you need heavy device features.",
          "Cut every feature that is not part of the core journey.",
          "Ask for a fixed price for phase one and a separate estimate for phase two.",
          "Set aside a yearly maintenance budget from day one.",
          "Keep the code and developer accounts in your own name."
        ]
      },
      {
        heading: "How to get quotes you can compare",
        paragraphs: [
          "Write a brief: the problem, users, must have features, platforms, integrations and a target date. Ask for a fixed price for a first version with a clear scope, and a separate price for later phases.",
          "Ask who owns the code, whether it lives in your accounts, what testing is included and what support costs after launch.",
          "If you are not sure an app is needed, a free 30-minute audit at /contact can help decide, and we also build /services/app-development.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much does a mobile app cost?",
        a: "From a few thousand to many tens of thousands, depending on features, platforms and backend. Get written quotes against your own brief.",
      },
      {
        q: "Is Flutter or React Native cheaper than native?",
        a: "Often, because one team builds for iOS and Android together. Native may still be better for some apps.",
      },
      {
        q: "Do I need a backend?",
        a: "If the app stores user data, accounts or content that changes, yes.",
      },
      {
        q: "What does an app cost to maintain?",
        a: "Plan for ongoing yearly costs for updates, hosting and fixes. Ask your developer to estimate it.",
      },
      {
        q: "Could a website do the job instead?",
        a: "Often yes. A responsive web app can avoid store fees and build twice. Consider it first.",
      },
    ],
    services: ["app-development", "web-apps-and-saas", "ui-ux-design"],
    category: "Apps, data & cloud",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "mvp-development-guide",
    title: "MVP Development Guide: Scope, Build, Test, Learn",
    description:
      "How to build an MVP: scope the smallest useful version, decide what to cut, plan a realistic timeline and test with real users before you invest further.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "mvp development",
      "minimum viable product guide",
      "how to build an mvp",
      "mvp scope",
      "mvp for small business",
    ],
    intro: [
      "An MVP, or minimum viable product, is the smallest version of a product that solves one real problem for real users, so you can learn whether it is worth building more. It is not a rough prototype or a broken app. It is a small product that works.",
      "This guide shows how to scope an MVP, what to cut, how long it tends to take and how to test it with users. It is for owners and founders in the US, UK and Europe who want to build an app or web tool without overspending. Timelines depend on scope and team, so treat ours as general guidance.",
    ],
    sections: [
      {
        heading: "Start with one problem and one user",
        paragraphs: [
          "Write one sentence: who has the problem, what the problem is and how your product helps. If you cannot say it simply, the idea is not ready to build.",
          "Talk to at least a handful of potential users before building. Ask how they solve the problem now, what it costs them and what they have tried. Their answers tell you more than a feature list.",
        ],
      },
      {
        heading: "Check whether you need to build anything yet",
        paragraphs: [
          "Often you can test the idea with something cheaper: a landing page, a form and a spreadsheet, or no code tools and manual work behind the scenes. If people will not sign up for that, they may not use an app.",
          "Automation tools can stand in for a backend in early tests. See /guides/build-ai-agent-without-code and /guides/business-process-automation-guide for ideas.",
        ],
      },
      {
        heading: "Scope: the one core journey",
        paragraphs: [
          "Map the single journey that delivers value from start to finish. For a booking tool, that might be: pick a time, confirm, get a reminder. Build only that.",
        ],
        bullets: [
          "List every feature you can imagine.",
          "Mark what the core journey cannot work without.",
          "Move everything else to a later list.",
          "Write what done looks like for each remaining feature.",
        ],
      },
      {
        heading: "What to cut",
        paragraphs: [
          "Cut anything that does not help test your main assumption. Common cuts for a first version are listed below.",
        ],
        bullets: [
          "Several user roles, until one is proven.",
          "Native apps on every platform: pick one, or use a responsive web app.",
          "Custom admin panels: use the database's own interface.",
          "Social features, chat and ratings.",
          "Advanced reporting and settings.",
          "Perfect design polish, while keeping the product clear and usable.",
        ],
      },
      {
        heading: "Timeline and team",
        paragraphs: [
          "A tightly scoped MVP is often measured in weeks to a few months, not a year. The time depends on features, integrations and how fast you give feedback and decisions. Delays usually come from changing scope, not from coding.",
          "Work in short cycles, with something to look at every week or two. Agree who makes decisions. A small team of a designer, a developer and you as product owner can be enough.",
        ],
      },
      {
        heading: "Test with real users",
        paragraphs: [
          "Put the product in front of real people early, even before it is finished. Watch them use it, without helping, and note where they get stuck. Five to ten sessions usually show the biggest problems.",
          "Decide in advance what success looks like, such as how many users complete the main journey or come back. Choose measures that show real behavior, not just compliments.",
        ],
      },
      {
        heading: "Decide what happens next",
        paragraphs: [
          "After the test, choose one of three paths: improve and continue, change direction or stop. Stopping early is a good outcome if the evidence says so, because it saves money.",
          "Plan for the basics even in an MVP: secure logins, backups, privacy compliance and error alerts. Keep the code in your own accounts, as in /guides/outsourcing-software-development.",
        ],
      },
      {
        "heading": "A worked example and common mistakes",
        "paragraphs": [
          "Here is a made-up example. A founder wants an app for local cleaners to find customers. His full idea has profiles, reviews, in app chat, payments, a calendar, a rating system and a mobile app for both sides. Built in full, it would take many months.",
          "He applies the one core journey rule. The core is that a customer describes a job and a cleaner accepts it. For the first version he builds a simple web form for customers, a spreadsheet that receives requests, and a messaging group where a handful of cleaners claim jobs. He does the matching by hand. There is no payment feature and no chat; cleaners and customers talk by phone.",
          "He runs this for four weeks with twenty customers in one town and tracks how many requests turn into completed jobs and how many customers book again. Only then does he decide what to build next. If completed jobs are low, he talks to customers to learn why before writing any code. If they are strong, the manual steps that hurt most, such as matching and reminders, become the first features.",
          "A realistic plan after that is a small web app for requests and a simple cleaner dashboard, built in weeks, with payments added only when people ask for them. Avoid the mistakes below."
        ],
        "bullets": [
          "Building for every user type at the start.",
          "Adding features because a competitor has them.",
          "Polishing design before checking anyone wants the product.",
          "No success measure, so any result looks like a win.",
          "Asking friends who are too polite to be honest.",
          "Skipping basics like backups and secure logins.",
          "Letting the developer own the code and hosting."
        ]
      },
      {
        "heading": "How to decide and what to do this week",
        "paragraphs": [
          "Use these tests to decide whether a feature belongs in the first version. If the answer to the first question is no, the feature waits."
        ],
        "bullets": [
          "Can the core journey work without it?",
          "Could it be done by hand for the first users?",
          "Would the first ten users notice if it were missing?",
          "Does it help test your biggest assumption?",
          "Does it add a new user type, platform or integration?",
          "Can you describe what done looks like in one sentence?"
        ]
      },
      {
        heading: "How Moonlab can help",
        paragraphs: [
          "We help scope and build MVPs, from simple automations to web apps. See /services/web-apps-and-saas, /services/app-development and /services/custom-build.",
          "A free 30-minute automation audit at /contact is a good place to talk through your idea.",
        ],
      },
    ],
    faqs: [
      {
        q: "What does MVP stand for?",
        a: "Minimum viable product: the smallest version that solves one real problem for real users.",
      },
      {
        q: "How long does it take to build an MVP?",
        a: "Often weeks to a few months for a tight scope, depending on features and integrations.",
      },
      {
        q: "How much should an MVP cost?",
        a: "It depends on scope. Keep scope small and ask for a fixed price for the first version.",
      },
      {
        q: "Should an MVP be a mobile app?",
        a: "Not always. A responsive web app is often faster and cheaper to test.",
      },
      {
        q: "How do I know the MVP worked?",
        a: "Set measures beforehand, such as completed journeys or repeat use, and compare with real results.",
      },
    ],
    services: ["web-apps-and-saas", "app-development", "custom-build"],
    category: "Apps, data & cloud",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "spreadsheet-to-database",
    title: "Spreadsheet to Database: When and How to Move",
    description:
      "Signs you have outgrown spreadsheets, your options (Airtable, Postgres, Supabase) and a step by step way to migrate to a database without losing data.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "spreadsheet to database",
      "outgrown excel",
      "airtable vs postgres",
      "supabase for small business",
      "migrate google sheets to database",
    ],
    intro: [
      "You have outgrown a spreadsheet when several people edit the same data and overwrite each other, formulas break, files are slow or you need rules about who sees what. At that point a database gives you structure, safety and the ability to build tools on top.",
      "This guide lists the signs, compares options such as Airtable, Postgres and Supabase in plain terms and gives a step by step plan to migrate without losing data. It is for owners using Excel or Google Sheets as their main system in the US, UK and Europe. Check each vendor's pricing page, because plans change.",
    ],
    sections: [
      {
        heading: "Signs you have outgrown your spreadsheet",
        paragraphs: [
          "A spreadsheet is a fine tool until it becomes the system the business runs on. Watch for these signs.",
        ],
        bullets: [
          "Two people edit at once and changes get lost or duplicated.",
          "The file is slow, large or crashes.",
          "You copy data between several sheets by hand.",
          "Nobody trusts the numbers, or only one person understands the formulas.",
          "You need to limit who sees certain columns or rows.",
          "You want a form, app, portal or automation to read and write the data.",
          "You need history: who changed what and when.",
        ],
      },
      {
        heading: "What a database gives you",
        paragraphs: [
          "A database stores data in related tables with rules. A customer is stored once and linked to many orders. Fields have types, so a date is always a date. Multiple users can work at once safely, with permissions and an audit trail.",
          "It also lets other tools connect. A website, an automation or a report can read the same data, instead of someone exporting a file.",
        ],
      },
      {
        heading: "Option 1: Airtable and similar tools",
        paragraphs: [
          "Airtable and similar no-code databases look like spreadsheets but add linked records, forms, views and simple automations. They suit teams who want a database without code. Limits on records, automations and users depend on the plan, so check the current pricing.",
          "They can become costly or constrained as data and users grow, and your data lives in a vendor's platform. Make sure you can export it.",
        ],
      },
      {
        heading: "Option 2: Postgres and Supabase",
        paragraphs: [
          "PostgreSQL is a mature, free, open source database used widely. It needs hosting and someone to manage it. Supabase offers hosted Postgres with an interface, logins and an API, so a small team can use it without running servers. Check its pricing and limits.",
          "This route suits custom apps, portals and systems that must scale. It needs a developer, but it gives you control and avoids lock in, since Postgres can be moved. Related: /services/database-management and /services/cloud-and-devops.",
        ],
      },
      {
        heading: "How to choose",
        paragraphs: [
          "Choose by who will use it and what comes next. If staff want to click around and build views, start with a no-code database. If you plan a customer portal, an app or heavy integrations, start with Postgres or Supabase.",
          "You can also move in stages: Airtable first, Postgres later. Plan the structure properly either way, because moving a messy structure just moves the mess.",
        ],
      },
      {
        heading: "Migration steps",
        paragraphs: [
          "Treat a migration like a small project. Do not delete the spreadsheet until the new system is proven.",
        ],
        bullets: [
          "Back up the spreadsheet and freeze a copy.",
          "List the things your data describes, such as customers, jobs and invoices, and how they relate.",
          "Design the tables and fields, with a unique ID for each record.",
          "Clean the data: remove duplicates, fix dates and standardize names.",
          "Import a sample, check it and fix issues, then import everything.",
          "Rebuild the reports and forms people need.",
          "Run both in parallel for a short time, then switch and make the old sheet read only.",
        ],
      },
      {
        heading: "Security, backups and privacy",
        paragraphs: [
          "Set user roles, turn on two step login and take regular backups. If you hold personal data about people in the UK or EU, GDPR applies, so limit what you store and who can access it. Pick a hosting region that suits your customers. See /guides/cloud-backups-small-business.",
        ],
      },
      {
        "heading": "A worked example and common mistakes",
        "paragraphs": [
          "Here is a made-up example. A small events company tracks clients, events and suppliers in one big Google Sheet with forty columns. Two coordinators edit it at once, and last week a supplier was double booked because one overwrote the other. The owner decides to move to a proper database.",
          "First they list what the data describes: clients, events, suppliers and bookings. A client can have many events, an event can have many suppliers, so these become separate tables linked by IDs. They clean the sheet: merge duplicate clients, fix date formats and agree names for event types. They choose a no code database for the first version because the coordinators want to build their own views, and they plan to export data regularly.",
          "They import a sample of fifty rows, check it, fix the import settings and then bring in everything. They set a form for new enquiries, a calendar view for events and a rule that stops one supplier being booked twice on the same date. For two weeks the old sheet stays open but read only, and any difference is checked. After that, the sheet is archived.",
          "If the company later needs a client portal, the same structure can move to Postgres, because the tables and relationships were designed properly. Avoid the mistakes below."
        ],
        "bullets": [
          "Copying the sheet layout into the database unchanged.",
          "Skipping data cleaning before import.",
          "No unique ID for each record.",
          "Deleting the old sheet before the new system is proven.",
          "Giving everyone full edit access.",
          "No backups or export plan.",
          "Choosing a tool for features you do not need yet."
        ]
      },
      {
        "heading": "How to decide and what to do this week",
        "paragraphs": [
          "Use this decision guide to pick between staying put, a no code database and Postgres or Supabase. Answer honestly, and choose the simplest option that fits."
        ],
        "bullets": [
          "Fewer than a few thousand rows and one or two editors: a tidier spreadsheet may do.",
          "Several editors, linked data and staff who want to build views: a no code database.",
          "A customer portal, an app or heavy integrations: Postgres or Supabase with a developer.",
          "Strict privacy or access rules: choose a tool with proper roles and audit history.",
          "No one to look after a server: pick a hosted option.",
          "Fear of lock in: confirm you can export everything in a standard format."
        ]
      },
      {
        heading: "How Moonlab can help",
        paragraphs: [
          "We design and migrate databases and build the forms, portals and automations on top. See /services/database-management and /services/web-apps-and-saas.",
          "A free 30-minute automation audit at /contact is a good first step.",
        ],
      },
    ],
    faqs: [
      {
        q: "When should I move from Excel to a database?",
        a: "When several people edit the data, formulas break, you need permissions or you want other tools to use the data.",
      },
      {
        q: "Is Airtable a real database?",
        a: "It is a database with a spreadsheet style interface. It suits many small teams, with plan limits to check.",
      },
      {
        q: "What is Supabase?",
        a: "A hosted service built around Postgres that adds logins, APIs and an admin interface.",
      },
      {
        q: "Will I lose my data in a migration?",
        a: "Not if you back up, test with a sample and run both systems in parallel before switching.",
      },
      {
        q: "Do I need a developer?",
        a: "For no-code tools, often not. For Postgres and custom apps, yes.",
      },
    ],
    services: ["database-management", "web-apps-and-saas", "custom-build"],
    category: "Apps, data & cloud",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "small-business-dashboard",
    title: "Small Business Dashboard in Looker Studio: A Guide",
    description:
      "How to build a small business dashboard in Looker Studio: which numbers to track, connecting your data, layout tips and keeping it accurate and easy to read.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "small business dashboard",
      "looker studio dashboard",
      "kpi dashboard for small business",
      "google looker studio tutorial",
      "business dashboard examples",
    ],
    intro: [
      "A small business dashboard is one page that shows the handful of numbers you check to run the business: sales, enquiries, cash owed, website traffic and reviews. Looker Studio, Google's free reporting tool, can build one from your spreadsheets, analytics and ad accounts.",
      "This guide covers which numbers to track, how to connect data, how to lay out the page and how to avoid the mistakes that make dashboards ignored. It is for owners and managers in the US, UK and Europe. Features and connectors change, so check Google's current Looker Studio documentation. If you prefer a message to a page, see /guides/automated-business-reports.",
    ],
    sections: [
      {
        heading: "Start with the questions, not the charts",
        paragraphs: [
          "Write down the five questions you ask most often. Are we on track this month? Where are enquiries coming from? Who owes us money? Each question becomes one or two numbers on the page.",
          "If nobody will act on a number, leave it out. A dashboard with fifteen charts is a wall of noise.",
        ],
      },
      {
        heading: "Which numbers to track",
        paragraphs: [
          "Pick leading numbers, such as enquiries, and lagging ones, such as revenue. Use the same definitions every time.",
        ],
        bullets: [
          "Revenue and gross margin, by month.",
          "New leads by source, and the share you answered within a day.",
          "Quotes sent, quotes won and win rate.",
          "Overdue invoices and the total owed.",
          "Website visits, top pages and enquiries from the site.",
          "Google Business Profile calls and direction requests.",
          "Review count and average rating.",
          "Ad spend and cost per enquiry, if you run ads.",
        ],
      },
      {
        heading: "Connect your data",
        paragraphs: [
          "Looker Studio connects directly to Google Sheets, Google Analytics, Search Console, Google Ads and many others. For tools without a direct connector, such as your CRM or accounting software, you can send data to a Google Sheet or a database using an automation or a third party connector, and point Looker Studio at that.",
          "Third party connectors may charge a fee, so check the pricing. A tidy Google Sheet that is updated automatically is often the simplest bridge.",
        ],
      },
      {
        heading: "Design a page people can read",
        paragraphs: [
          "Put the most important numbers at the top as large scorecards with a comparison to last month. Group related charts. Use one or two colors and clear labels. Add a date range control and a title that states what the page shows.",
          "Check the dashboard on a phone. Many owners look at it on the move.",
        ],
        bullets: [
          "Scorecards for headline numbers.",
          "Line charts for trends over time.",
          "Bar charts to compare sources or products.",
          "Tables only for detail people need to read.",
          "No 3D charts or decoration.",
        ],
      },
      {
        heading: "Keep it accurate",
        paragraphs: [
          "Write definitions on the page or in a note: what counts as a lead, whether revenue includes tax. Check the numbers against the source tool when you first build it and again after changes. Treat odd spikes and zeros as possible data errors.",
          "Looker Studio shows what is in the source, so the quality of the source decides the quality of the dashboard.",
        ],
      },
      {
        heading: "Sharing and privacy",
        paragraphs: [
          "Share with named people, not with a public link, if the data is sensitive. Limit access to financial and customer data. If a report includes personal data about people in the UK or EU, remember GDPR applies. Do not include more personal data than you need.",
        ],
      },
      {
        heading: "Make it a habit",
        paragraphs: [
          "Review the dashboard at a set time each week, for ten minutes. Decide one action. Remove numbers that never lead to action, and add ones you keep asking about. If a bigger system is needed later, see /guides/power-bi-vs-looker-studio.",
        ],
      },
      {
        "heading": "A worked example and common mistakes",
        "paragraphs": [
          "Here is a made-up example. An electrician in Leeds wants to see, on one page, how many enquiries came in, how many quotes were sent and won, and how much was invoiced. He keeps enquiries in a Google Sheet that a web form fills automatically, and invoices in an accounting tool that exports a monthly summary to the same workbook through an automation.",
          "In Looker Studio he creates a new report and adds the Google Sheet as a data source, checking that the date column is recognized as a date. At the top he adds four scorecards: enquiries this month, quotes sent, quotes won and invoiced total, each compared with the previous period. Below he adds a line chart of enquiries by week, a bar chart of enquiries by source (website, Google profile, referrals) and a table of unpaid invoices. A date range control at the top lets him change the period.",
          "He then shares the report with his office manager by email address, not with a public link. Every Monday he spends ten minutes on it and writes down one action, such as following up quotes older than a week. After a month he removes a chart nobody used and adds average job value.",
          "Look out for these mistakes when you build yours."
        ],
        "bullets": [
          "Too many charts, so the key numbers are buried.",
          "Different definitions in different charts, such as lead and enquiry.",
          "Not checking the dates and number formats in the source sheet.",
          "Sharing a public link to financial or customer data.",
          "Never checking the numbers against the source tool.",
          "No owner, so nobody fixes it when a connection breaks.",
          "Using decorative charts that are hard to read."
        ]
      },
      {
        "heading": "How to decide and what to do this week",
        "paragraphs": [
          "Here is a simple routine to get your first dashboard live in a week, without letting it grow out of control."
        ],
        "bullets": [
          "Day one: write down five questions and the number that answers each.",
          "Day two: put the source data in one Google Sheet or connect it directly.",
          "Day three: build four scorecards and two charts only.",
          "Day four: check every number against the source tool.",
          "Day five: share it with named people and ask what is missing.",
          "The next Monday: review it for ten minutes and note one action."
        ]
      },
      {
        heading: "How Moonlab can help",
        paragraphs: [
          "We build dashboards and the data pipes behind them. See /services/data-and-analytics and /services/database-management.",
          "A free 30-minute automation audit at /contact can help you decide which numbers matter.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is Looker Studio free?",
        a: "Looker Studio itself is free from Google, with a paid Pro tier for teams. Some third party connectors cost extra. Check current pricing.",
      },
      {
        q: "What should be on a small business dashboard?",
        a: "Revenue, leads, quotes and win rate, overdue invoices, website visits and reviews are a good start.",
      },
      {
        q: "Can Looker Studio connect to QuickBooks or Xero?",
        a: "Not directly, but you can send data to Google Sheets or a database and connect that. Third party connectors exist.",
      },
      {
        q: "How often does the data update?",
        a: "It depends on the source and settings. Sheets and analytics refresh regularly, and cached data can lag.",
      },
      {
        q: "Dashboard or weekly email report?",
        a: "Many small teams use both: a short email for the habit and a dashboard for detail.",
      },
    ],
    services: ["data-and-analytics", "database-management", "operations"],
    category: "Apps, data & cloud",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "power-bi-vs-looker-studio",
    title: "Power BI vs Looker Studio for Small Businesses",
    description:
      "Power BI vs Looker Studio compared for small businesses: data sources, ease of use, licensing in general terms and which fits a Google or Microsoft 365 team.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "power bi vs looker studio",
      "looker studio vs power bi",
      "power bi for small business",
      "best bi tool for small business",
      "free dashboard tools",
    ],
    intro: [
      "Choose Looker Studio if you work mostly in Google tools and want free, quick dashboards. Choose Power BI if you use Microsoft 365, need heavier data modelling or want to analyze larger data. Both can do the job for most small businesses, so the choice often comes down to the tools you already use.",
      "This comparison covers what each does well, data connections, learning curve and licensing in general terms. Licensing and prices change, so check Google's and Microsoft's own pages. We do not quote prices here. Also see /guides/small-business-dashboard for how to build a first dashboard.",
    ],
    sections: [
      {
        heading: "What each tool is",
        paragraphs: [
          "Looker Studio is Google's web based reporting tool, previously called Data Studio. You build reports in a browser and share them by link. It is closely tied to Google products.",
          "Power BI is Microsoft's business intelligence platform. It has a free desktop app for building reports, a cloud service for sharing and a strong data modelling engine. It fits naturally with Excel, Microsoft 365 and Azure.",
        ],
      },
      {
        heading: "Ease of use",
        paragraphs: [
          "Looker Studio is simple to start with. Connect a source, drag in charts and share. It suits people who are comfortable with Google Sheets.",
          "Power BI has a steeper learning curve. You clean and model data first, and use a formula language called DAX for calculations. The extra power is useful, but it takes time to learn.",
        ],
      },
      {
        heading: "Data sources",
        paragraphs: [
          "Looker Studio connects natively to Google Analytics, Search Console, Google Ads, Sheets and BigQuery, plus a wide range of partner connectors, some paid. Power BI connects to a very wide range of sources, including Excel, SQL databases, SharePoint and many online services.",
          "For other tools, a common approach in both is to load data into a spreadsheet or database first. See /services/database-management.",
        ],
      },
      {
        heading: "Data modelling and size",
        paragraphs: [
          "Power BI can combine many tables, define relationships and handle larger data sets. Looker Studio is lighter and works best with data that is already tidy, or blended in a limited way.",
          "If your reports need complex calculations across tables, Power BI is the stronger choice. If you mainly show traffic, ads and a few sheets, Looker Studio is enough.",
        ],
      },
      {
        heading: "Licensing, in general terms",
        paragraphs: [
          "Looker Studio is free to use, with a paid Pro tier that adds team management features. Some third party data connectors have their own fees.",
          "Power BI Desktop is free to build reports. Sharing and collaborating in the cloud typically requires paid per user licenses or capacity options, and the details have changed over time and depend on your Microsoft plan. Check Microsoft's current licensing page, or ask your Microsoft partner, before you plan around it.",
        ],
      },
      {
        heading: "Sharing, security and privacy",
        paragraphs: [
          "Both have access controls. Power BI offers row level security and governance suited to larger organizations. Looker Studio sharing follows Google account permissions.",
          "If your data includes personal data about people in the UK or EU, GDPR applies whichever tool you use. Check where data is stored and who can see it.",
        ],
      },
      {
        heading: "A simple way to choose",
        paragraphs: [
          "Look at your existing tools first. The best dashboard tool is the one your team will actually open.",
        ],
        bullets: [
          "Mostly Google Workspace, Analytics and Ads: Looker Studio.",
          "Mostly Microsoft 365, Excel and SQL Server: Power BI.",
          "Tight budget and simple needs: Looker Studio.",
          "Complex data models, large data sets or governance needs: Power BI.",
          "No dedicated analyst: start with the simpler tool.",
        ],
      },
      {
        "heading": "A worked example and common mistakes",
        "paragraphs": [
          "Here is a made-up example. A design studio with eight people uses Google Workspace, Google Analytics, Google Ads and a Google Sheet where the owner logs projects and invoices. They want one page showing website visits, enquiries, ad spend and monthly invoiced revenue. Looker Studio fits this well. Every source is a native connector or a sheet, the tool is free to start, and a team member who knows Sheets can build it in an afternoon.",
          "Now say a different firm, a regional distributor with twenty five staff, runs on Microsoft 365, keeps sales data in a SQL database and wants reports that join orders, stock and customers, with managers seeing only their own region. Power BI suits that better. It can model related tables, supports row level security and lives next to Excel and SharePoint. The firm should budget time to learn it and check Microsoft's licensing for the number of viewers.",
          "If you are somewhere in between, run a small trial. Pick one real report, build it in the tool you are leaning towards, and give it to the people who will use it for two weeks. If they open it without being asked, you have your answer.",
          "Watch for these mistakes when choosing and building."
        ],
        "bullets": [
          "Choosing on a feature list instead of the tools your team already uses.",
          "Paying for a bigger tool before you have a simple dashboard that gets used.",
          "Not checking licensing for viewers as well as builders.",
          "Building reports on messy source data, so every number is argued about.",
          "No owner for the dashboard, so it goes stale when the builder leaves.",
          "Putting personal data in a report shared too widely.",
          "Forgetting that connectors for non-Google or non-Microsoft tools may cost extra."
        ]
      },
      {
        "heading": "How to decide and what to do this week",
        "paragraphs": [
          "To make the final call, score each tool against your own situation. The one that wins most of these is usually the right choice. If it is close, start with the free option and a single report, and move later if you outgrow it."
        ],
        "bullets": [
          "Which suite do most staff already sign in to every day?",
          "Where does most of your data live, and does a native connector exist?",
          "Do you need relationships across many tables or large data volumes?",
          "Who will build and maintain the reports, and what are their skills?",
          "How many people need to view reports, and what would licensing cost for them?",
          "Do you need to restrict what different people can see?"
        ]
      },
      {
        heading: "How Moonlab can help",
        paragraphs: [
          "We build dashboards in either tool and the data feeds behind them. See /services/data-and-analytics and /services/cloud-and-devops.",
          "A free 30-minute automation audit at /contact can help you choose.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is Power BI better than Looker Studio?",
        a: "Not in general. Power BI is stronger for complex data, Looker Studio is simpler and free for most use.",
      },
      {
        q: "Is Looker Studio really free?",
        a: "The core tool is free. A Pro tier and some connectors cost extra. Check Google's page.",
      },
      {
        q: "Do I need Power BI Pro to share reports?",
        a: "Sharing in the cloud generally needs paid licensing, and the rules change. Check Microsoft's current licensing.",
      },
      {
        q: "Can I use both?",
        a: "Yes, for example Looker Studio for marketing data and Power BI for finance. Keep definitions consistent.",
      },
      {
        q: "Which is easier for a beginner?",
        a: "Looker Studio is usually quicker to start with.",
      },
    ],
    services: ["data-and-analytics", "database-management", "cloud-and-devops"],
    category: "Apps, data & cloud",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "outsourcing-software-development",
    title: "Outsourcing Software Development: How to Do It Safely",
    description:
      "How to outsource software development safely: write a clear scope, agree contracts and IP ownership, keep code in your own accounts and spot red flags early.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "outsourcing software development",
      "hire a software development agency",
      "ip ownership software contract",
      "offshore development risks",
      "outsource app development",
    ],
    intro: [
      "To outsource software development safely, write a clear scope, agree who owns the code in a contract, keep the code and servers in your own accounts from day one, pay in stages against working deliverables and check references. Most horror stories come from vague scope and no access to the code.",
      "This guide is for owners hiring a freelancer, studio or overseas team. It covers scoping, contracts and IP, working across time zones and the red flags to watch for. This is not legal advice, so have a solicitor or attorney review any contract of real size.",
    ],
    sections: [
      {
        heading: "Write a clear scope first",
        paragraphs: [
          "A good brief reduces most risk. Describe the problem, the users, the must have features, integrations, platforms and any deadlines. Add examples, sketches and links to systems you use.",
          "Split the work into phases. Ask for a fixed price for a first phase with defined deliverables, instead of an open ended time and materials arrangement for the entire project. See /guides/mvp-development-guide.",
        ],
      },
      {
        heading: "Contracts and IP ownership",
        paragraphs: [
          "Put it in writing. A contract should say what is delivered and when, how and when you pay, how changes are handled and what happens if either side stops.",
          "Intellectual property rules differ by country. In many places, by default the creator, not the client, may own the copyright in custom software unless a written agreement assigns it. Make sure the contract states that you own the code and deliverables on payment, and that the developer has the right to give them to you. Check any open source licenses used. A professional should review this.",
        ],
        bullets: [
          "Ownership or assignment of code, designs and documents.",
          "Confidentiality and data protection terms.",
          "Payment schedule linked to milestones.",
          "Acceptance testing and a warranty period for bugs.",
          "Termination and handover terms.",
          "A data processing agreement if personal data is handled.",
        ],
      },
      {
        heading: "Keep everything in your own accounts",
        paragraphs: [
          "Create the accounts yourself: the code repository (such as GitHub), cloud hosting, domain, app store developer accounts, analytics and any third party services. Invite the developer as a collaborator. Never let the code or hosting live only in the developer's accounts.",
          "This is the single best protection. If the relationship ends, you keep the work. Ask for regular access to the repository so you can see progress as it happens.",
        ],
      },
      {
        heading: "Payment and milestones",
        paragraphs: [
          "Pay in stages tied to delivered, working pieces that you can test. Avoid paying everything up front. A modest deposit is normal. Keep a final payment until handover is complete.",
          "Ask for a demo at each milestone, and test it yourself before you pay.",
        ],
      },
      {
        heading: "Time zones and communication",
        paragraphs: [
          "Working across time zones can work well with some planning. Agree overlap hours, a main contact, a weekly call and a shared task board. Written updates and short videos help.",
          "Clarify language expectations, working hours and holidays. Communication quality matters as much as coding skill.",
        ],
      },
      {
        heading: "Security and data protection",
        paragraphs: [
          "Give the minimum access needed and use separate accounts, not shared passwords. Ask how they handle secrets and customer data. If the developer handles personal data of UK or EU people, GDPR requires a proper agreement and care about where data goes.",
          "Ask for the use of test data, not live customer data, during development.",
        ],
      },
      {
        heading: "Red flags to watch for",
        paragraphs: [
          "Be cautious if you see any of these during the sales process.",
        ],
        bullets: [
          "A very low price with a vague scope.",
          "Reluctance to put things in writing or sign a contract.",
          "No portfolio or references you can contact.",
          "Pressure to pay a large amount up front.",
          "The code or hosting only in their accounts.",
          "No testing or no plan for support after launch.",
          "Promises that sound too good, such as everything in a week.",
        ],
      },
      {
        "heading": "A worked example and common mistakes",
        "paragraphs": [
          "Here is a made-up example. A recruitment agency in Birmingham wants a candidate portal. They get three quotes, one very cheap, one mid range and one expensive. The brief was one page, so the quotes differ because each team assumed different features. The owner rewrites the brief with user stories, screens and an integration list, and asks all three to quote again.",
          "The mid range studio provides a fixed price for phase one, a milestone plan, a sample contract that assigns the code to the agency on payment, and two references. The owner phones one reference. She creates the GitHub organization and cloud account herself and adds the studio as collaborators. She pays a deposit, then a payment at each milestone after a demo and her own test.",
          "The team works in a different time zone, so they agree a daily written update and a weekly video call at an hour that suits both. Test data is used, not real candidate data. At the end she receives the repository, setup notes and a recorded walkthrough, and asks a freelance developer to do a one hour check that the code runs from her accounts.",
          "These are the errors that cause trouble later."
        ],
        "bullets": [
          "Choosing on price alone.",
          "A one page brief that leaves scope open.",
          "No written assignment of intellectual property.",
          "Hosting and repository in the vendor's name.",
          "Paying most of the fee before seeing working software.",
          "Real customer data used for testing.",
          "No handover documentation.",
          "Ignoring the time zone gap until it causes delays."
        ]
      },
      {
        "heading": "How to decide and what to do this week",
        "paragraphs": [
          "Before you sign, check each of these items. If any answer is unclear, ask for it in writing and give it time before you pay a deposit."
        ],
        "bullets": [
          "Does the contract assign ownership of the code to you on payment?",
          "Are the repository, hosting and domain in your accounts?",
          "Is the first phase fixed price with clear deliverables?",
          "Have you spoken to at least one past client?",
          "Is there a warranty period for bugs after delivery?",
          "Is there a handover plan and documentation in the price?"
        ]
      },
      {
        heading: "How Moonlab can help",
        paragraphs: [
          "Moonlab builds in your own accounts with a fixed price and handover. See /services/custom-build, /services/app-development and /guides/mobile-app-development-cost.",
          "A free 30-minute automation audit at /contact is a low risk way to see how we work.",
        ],
      },
    ],
    faqs: [
      {
        q: "Who owns the code when I outsource?",
        a: "It depends on the contract and local law. Make sure the contract clearly assigns ownership to you. Get legal advice.",
      },
      {
        q: "Should I hire a freelancer or an agency?",
        a: "A freelancer can suit a small, well defined task. An agency suits larger work needing several skills. Check references either way.",
      },
      {
        q: "Is offshore outsourcing risky?",
        a: "It can work well, but the same rules apply: clear scope, contract, own accounts and staged payments.",
      },
      {
        q: "How should I pay?",
        a: "In stages against working deliverables, with a final payment at handover.",
      },
      {
        q: "What should I ask for at the end?",
        a: "Repository access, documentation, credentials in your accounts and a walkthrough.",
      },
    ],
    services: ["custom-build", "app-development", "web-apps-and-saas"],
    category: "Apps, data & cloud",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "cloud-backups-small-business",
    title: "Cloud Backups for Small Business: The 3-2-1 Rule",
    description:
      "Cloud backups for a small business: the 3-2-1 rule, what to back up in Google Workspace, Microsoft 365, your website and databases, and how to test a restore.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "cloud backups for small business",
      "3-2-1 backup rule",
      "google workspace backup",
      "microsoft 365 backup",
      "website backup",
    ],
    intro: [
      "A good backup plan follows the 3-2-1 rule: keep three copies of your data, on two different types of storage, with one copy off site. Then test that you can restore it. A backup you have never restored is only a hope.",
      "This guide explains the rule in plain terms, what a small business should back up, why Google Workspace and Microsoft 365 need their own backups, how to back up a website and databases and how to test restores. It suits owners and managers in the US, UK and Europe. Vendor features and prices change, so check each provider's current details.",
    ],
    sections: [
      {
        heading: "The 3-2-1 rule explained",
        paragraphs: [
          "Three copies means your live data plus two backups. Two types of storage means not both on the same kind of device, such as a laptop disk and a cloud service. One off site means at least one copy is somewhere else, so a fire, theft or ransomware at your office cannot take everything.",
          "Many people now add a fourth idea: keep one copy that cannot be changed or deleted for a set time, which protects against ransomware and mistakes.",
        ],
      },
      {
        heading: "What to back up",
        paragraphs: [
          "List where your business data lives, because that is your backup list. People often forget cloud tools.",
        ],
        bullets: [
          "Email, files and calendars in Google Workspace or Microsoft 365.",
          "Your website files and database.",
          "Accounting data (export regularly from QuickBooks, Xero or similar).",
          "CRM and customer data.",
          "Business databases and spreadsheets.",
          "Laptops with local files.",
          "Automation workflows, scripts and configuration.",
        ],
      },
      {
        heading: "Google Workspace and Microsoft 365 are not a backup",
        paragraphs: [
          "Cloud suites keep your data available, but they are not designed as full backups. Deleted items stay recoverable for a limited time, and a hacked account, a rogue employee or a sync mistake can destroy data. Both providers describe this as shared responsibility, and say so in their documentation.",
          "Third party backup services copy Workspace or Microsoft 365 data to separate storage, and keep versions. Compare options, check pricing per user and confirm what is included, such as mail, drive, calendar and shared drives.",
        ],
      },
      {
        heading: "Backing up your website",
        paragraphs: [
          "A website backup needs the files and the database. WordPress sites should have daily backups stored outside the web server. Many hosts offer backups, but check how long they keep them and how to restore, and do not rely on them alone.",
          "Back up before every major update. Keep at least one copy somewhere other than your host. Website builders such as Wix and Squarespace handle hosting, but export your content periodically where possible.",
        ],
      },
      {
        heading: "Databases and apps",
        paragraphs: [
          "If you run a custom app or a database, use automated, scheduled backups with point in time recovery where the platform allows it. Store them in a separate account or region. Know how long backups are kept.",
          "Our guide at /guides/spreadsheet-to-database covers moving to a proper database. Keep the code in a repository you control, as in /guides/outsourcing-software-development.",
        ],
      },
      {
        heading: "Test your restores",
        paragraphs: [
          "Restore a file, a mailbox and your website to a test location every few months. Time how long it takes and write down the steps. Check that the data opens and is complete.",
          "Decide how much loss is acceptable and how long you can be down. These two numbers, how far back you can go and how fast you must recover, set how often you back up and which tools you need.",
        ],
      },
      {
        heading: "Security and privacy of backups",
        paragraphs: [
          "Encrypt backups and protect access with two step login. Keep credentials safe. Backups contain personal data, so GDPR and UK GDPR apply to them too. Choose where they are stored with that in mind, and delete old ones on a schedule.",
        ],
      },
      {
        "heading": "A worked example and common mistakes",
        "paragraphs": [
          "Here is a made-up example. A ten person accounting office uses Google Workspace, a WordPress website and a cloud accounting tool. They have no formal backups. The office manager spends one afternoon making a plan.",
          "She lists what must survive: client files in Drive, email, the website, and monthly exports from the accounting tool. For Workspace she signs up for a third party backup service that copies mail, Drive and calendars daily to separate storage, after comparing a few options and their per user pricing. For the website she turns on daily backups that go to storage outside the host, and keeps copies for a month. For accounting, she sets a monthly reminder to export reports and data, and saves them to a folder that is also backed up.",
          "Every three months she runs a test. She restores a deleted folder from the Workspace backup, restores the website to a test address, and times each task. She writes down the steps on one page so anyone can follow them. This satisfies the rule: three copies, two kinds of storage and one off site.",
          "Here are the mistakes she was glad to avoid."
        ],
        "bullets": [
          "Assuming the cloud suite is a backup.",
          "Keeping backups in the same account as the original data.",
          "Never testing a restore.",
          "Backing up only the website files, not the database.",
          "No two step login on the backup account.",
          "Keeping backups forever, including personal data.",
          "Not knowing who is responsible, so nobody checks."
        ]
      },
      {
        "heading": "How to decide and what to do this week",
        "paragraphs": [
          "Here is a short order of work for a business with no backup plan today, so you can make real progress in a single week."
        ],
        "bullets": [
          "Day one: list every system that holds business data and who owns it.",
          "Day two: turn on two step login on every admin account.",
          "Day three: set up backups for Workspace or Microsoft 365 and the website.",
          "Day four: schedule exports from accounting and CRM tools.",
          "Day five: restore one file and one page to a test location and time it.",
          "Then: put a quarterly restore test in the calendar."
        ]
      },
      {
        heading: "How Moonlab can help",
        paragraphs: [
          "We set up backups, monitoring and recovery plans for websites, apps and cloud accounts. See /services/cloud-and-devops and /services/database-management.",
          "A free 30-minute automation audit at /contact can include a quick check of what is and is not backed up.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the 3-2-1 backup rule?",
        a: "Three copies of your data, on two types of storage, with one copy off site.",
      },
      {
        q: "Do I need to back up Google Workspace or Microsoft 365?",
        a: "Yes, for full protection. They keep data available but are not a complete backup.",
      },
      {
        q: "How often should I back up?",
        a: "As often as you can afford to lose work. Daily is common, and more often for busy systems.",
      },
      {
        q: "How do I test a restore?",
        a: "Restore a sample to a test location, check it opens and complete, and time the process.",
      },
      {
        q: "Is my hosting company's backup enough?",
        a: "Not alone. Keep a separate copy elsewhere and know how to restore.",
      },
    ],
    services: ["cloud-and-devops", "database-management", "operations"],
    category: "Apps, data & cloud",
  },
];
