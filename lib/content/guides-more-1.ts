import type { Guide } from "./guides";

export const moreGuides1: Guide[] = [
  // ---------------------------------------------------------------------------
  {
    slug: "ai-receptionist-small-business",
    title: "AI Receptionist for Small Business: How It Works",
    description:
      "What an AI receptionist for a small business does, how it handles calls, booking and handoff to staff, the costs to weigh, and when it is a good fit.",
    published: "2026-11-18",
    readMinutes: 6,
    keywords: [
      "ai receptionist",
      "ai receptionist for small business",
      "ai phone answering",
      "virtual receptionist ai",
      "ai call answering service",
    ],
    intro: [
      "An AI receptionist is a voice assistant that answers your business phone, talks to the caller in normal speech, and handles routine requests such as opening hours, quotes and bookings. It does not replace your team. It covers the calls nobody has time to pick up and passes the tricky ones to a person.",
      "This guide explains how an AI receptionist for a small business works, what happens during a call, how booking and handoff are set up, what costs to look at, and when it is not a good idea. Examples are hypothetical, and tool prices change, so check each vendor's current pricing.",
    ],
    sections: [
      {
        heading: "What an AI receptionist does",
        paragraphs: [
          "When a call comes in, the assistant answers with a greeting you have approved, listens to what the caller wants, and responds in a natural voice. It can answer questions from information you give it, take a message, collect contact details, book an appointment in your calendar, and send you a summary afterwards.",
          "It is built from three parts: speech recognition that turns the caller's words into text, a language model that decides what to say, and a voice that speaks the reply. Behind those sits a set of rules and connections to your calendar, CRM and phone system. The quality of the result depends far more on those rules and connections than on the voice.",
        ],
      },
      {
        heading: "How calls, booking and handoff work",
        paragraphs: [
          "A well-built assistant follows a clear path for each type of call. Think of it as a flowchart with a conversation on top. The same call types come up again and again, so most of the work is deciding what should happen for each one.",
        ],
        bullets: [
          "Questions. Opening hours, service areas, parking, what you charge for a standard job. The assistant answers only from the information you provide, and says it will pass the question on when it does not know.",
          "Booking. It checks your real calendar for free slots, offers two or three times, confirms the choice and sends a text or email confirmation.",
          "Messages. It takes a name, number and reason for the call, and sends the details to the right person by text or email.",
          "Urgent calls. Words like emergency, flooding or no heating can trigger a transfer to your mobile straight away.",
          "Handoff. The call is transferred to a person, or a callback is booked, whenever the caller asks for a human or the assistant is unsure.",
        ],
      },
      {
        heading: "AI phone answering compared with voicemail and a human receptionist",
        paragraphs: [
          "Voicemail is free but many callers hang up without leaving a message, and a message left at 6 pm may not be read until the next afternoon. A human receptionist is excellent but works fixed hours, can only take one call at a time and costs a salary.",
          "AI phone answering sits between the two. It answers every call straight away, at any hour, several at once, and writes everything down. It cannot read a caller's mood the way a good person can, and it can misunderstand accents, bad lines or unusual names. For a deeper look at the human side of this choice, see /guides/ai-answering-service-vs-call-center.",
        ],
      },
      {
        heading: "What to set up before you switch it on",
        paragraphs: [
          "Most failed rollouts come from skipping preparation. Spend an afternoon on the following and the assistant will sound far more competent.",
        ],
        bullets: [
          "A one-page fact sheet: services, areas covered, hours, prices you are happy to quote, and answers to the ten questions callers ask most.",
          "A list of things it must never do, such as promising a price for a custom job, giving medical or legal advice, or taking card numbers by voice.",
          "Your real calendar connected, with buffers and holidays set, so it cannot double-book.",
          "Clear transfer rules: who gets urgent calls, what happens if they do not answer, and where messages go.",
          "A greeting that tells callers it is an automated assistant. In some places this is expected and in others required, so check your local rules.",
        ],
      },
      {
        heading: "Costs to consider",
        paragraphs: [
          "There are usually four cost lines: the voice platform or phone number subscription, usage fees per minute of conversation, any AI model usage, and the one-off setup of the call flow. Some vendors bundle these into a monthly plan with a minutes allowance, and others charge per minute. Prices vary a lot and change often, so ask each vendor for a current quote based on your expected call volume.",
          "A simple way to judge value is to count your missed calls for two weeks and note what a typical new customer is worth. Say a plumbing firm in Manchester misses six calls a week, and one in three would have turned into a job. Even a modest job value makes the sum worth doing before you compare vendors.",
          "Remember the cost of getting it wrong too. A badly set up assistant that annoys callers costs more than a missed call. Pay for testing, not just for launch. Our general cost overview is in /guides/business-automation-cost.",
        ],
      },
      {
        heading: "When an AI receptionist is a good fit, and when it is not",
        paragraphs: [
          "It fits businesses with many routine calls, calls outside office hours, or a small team that is often on the job, such as trades, clinics, salons, cleaners and local professional firms. It also helps when calls arrive in bursts that one person cannot handle.",
          "It fits less well when most calls are emotional or complex, such as sensitive legal, medical or bereavement matters, where a calm human voice is part of the service. It also fits poorly if your business details change daily and nobody will keep the fact sheet current. In those cases, consider a human answering service or a missed-call text back instead, covered in /guides/missed-call-text-back-and-online-booking.",
        ],
      },
      {
        heading: "Privacy and consent basics",
        paragraphs: [
          "A call assistant handles personal data: voices, names, phone numbers and sometimes health or financial details. If you record or transcribe calls, tell callers at the start. Recording and consent rules differ by country and by US state, and GDPR and UK GDPR apply to callers in Europe and the UK. This is not legal advice, so check your obligations with a professional.",
          "Ask any vendor where call data is stored, how long it is kept, and whether it is used to train models. Choose a retention period that fits your needs and delete what you do not need. Our GDPR checklist is at /guides/gdpr-ai-automation.",
          "If you want to see whether an AI receptionist suits your call patterns, the free automation audit at /contact is a low-pressure place to start.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is an AI receptionist?",
        a: "It is software that answers your business phone with a natural-sounding voice, handles routine requests like questions and bookings, and passes complex or urgent calls to a person. It runs all day and can take several calls at once.",
      },
      {
        q: "Can an AI receptionist book appointments?",
        a: "Yes, if it is connected to your calendar. It checks real availability, offers times to the caller, confirms the slot and sends a confirmation. Test it with odd requests before going live to be sure it cannot double-book.",
      },
      {
        q: "Will callers know they are talking to an AI?",
        a: "Many will, and some places expect you to say so. The best practice is to be upfront in the greeting. Callers are usually fine with it when it solves their problem quickly and offers a human option.",
      },
      {
        q: "What happens when the AI cannot answer?",
        a: "A good setup takes a message, books a callback or transfers to a person. You decide the rules in advance, and the assistant should never guess on prices, legal or medical questions.",
      },
      {
        q: "Is an AI receptionist cheaper than a human one?",
        a: "Usually the running cost is lower, but it covers a narrower set of tasks. Compare the cost with the value of calls you currently miss, and check vendors' current pricing.",
      },
    ],
    services: ["voice-and-calls", "customer-support", "sales-and-leads"],
    category: "Automation & AI",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "ai-answering-service-vs-call-center",
    title: "AI Answering Service vs Call Center: Which to Pick",
    description:
      "Compare an AI answering service with a human call center or answering service: strengths, limits, cost factors and how a hybrid setup works best.",
    published: "2026-11-18",
    readMinutes: 6,
    keywords: [
      "ai answering service",
      "ai answering service vs call center",
      "answering service for small business",
      "virtual receptionist vs ai",
      "after hours call answering",
    ],
    intro: [
      "The short answer: an AI answering service is better for routine, high-volume calls and after-hours cover, while a human answering service or call center is better for sensitive, complex or emotional calls. Many small businesses do best with a hybrid of the two.",
      "This guide compares them on the things that matter in practice: caller experience, accuracy, cost structure, hours, scaling and risk. It ends with a simple way to decide. Prices change, so we describe cost factors rather than numbers. Check each provider's current pricing.",
    ],
    sections: [
      {
        heading: "What each option actually is",
        paragraphs: [
          "A human answering service uses trained agents, often shared across many client businesses, who answer in your company's name using a script. A call center is the larger version: more agents, more channels and often outbound calling as well. Both are staffed by people working shifts.",
          "An AI answering service uses a voice assistant that answers automatically. It follows rules you set, pulls answers from your information and connects to tools such as your calendar. If you want to see how one works in detail, read /guides/ai-receptionist-small-business.",
        ],
      },
      {
        heading: "Where an AI answering service is stronger",
        paragraphs: [
          "AI is strongest on volume, hours and consistency. It never has a bad day, forgets a script or goes on break.",
        ],
        bullets: [
          "Answers instantly, at any hour, including holidays and weekends.",
          "Takes many calls at once, so a burst after an advert or storm does not create a queue.",
          "Gives the same answer every time and records every call as text.",
          "Connects directly to calendars and CRMs, so bookings and messages land in the right place without retyping.",
          "Cost usually scales with usage and is often lower for simple calls, though this depends on the vendor.",
        ],
      },
      {
        heading: "Where a human answering service is stronger",
        paragraphs: [
          "People are better at nuance. A trained agent can hear distress, calm an angry caller, handle an unusual accent or a bad line, and improvise when the call does not fit the script.",
          "That matters most in sensitive fields such as healthcare, law, funeral services, and any business where callers are often worried or upset. It also matters when your offer is complex and each call needs judgment, such as a custom quote with many variables. Humans can also handle outbound relationship calls where trust is the point.",
        ],
      },
      {
        heading: "The weak spots to watch on both sides",
        paragraphs: [
          "Neither option is perfect. Know the failure modes before you choose.",
        ],
        bullets: [
          "AI can mishear names, numbers and addresses, or answer confidently from outdated information. Mitigate this with readbacks (repeating details to the caller) and a short, accurate fact sheet.",
          "AI can feel impersonal to some callers. Always offer a route to a human.",
          "Human services can have staff turnover, a shared pool that does not know your business well, and per-minute or per-call charges that rise when you are busy.",
          "Human agents work from scripts too, and scripts go stale. Review call recordings regularly with either option.",
        ],
      },
      {
        heading: "Cost factors to compare",
        paragraphs: [
          "Do not compare headline prices alone. Ask each provider how they bill and then run your own call numbers through it.",
          "Human services often charge a monthly base with a bundle of minutes or calls, plus fees for overage, extra features or out-of-hours rates. AI services often charge a platform fee plus usage per minute, and sometimes extra for AI model costs, phone numbers and integrations. Look for setup fees, minimum terms, and what happens when you exceed your allowance.",
          "Estimate your monthly call count and average call length first. A business with 300 short routine calls behaves very differently from one with 40 long consultative calls. More on typical project costs is in /guides/business-automation-cost.",
        ],
      },
      {
        heading: "The hybrid approach",
        paragraphs: [
          "A hybrid setup uses AI as the first responder and people as the backstop. The AI handles routine calls, books appointments and takes messages. Anything urgent, emotional or outside its rules is transferred to a person, either your own team or a human answering service.",
          "This keeps costs sensible because the human service only handles the calls that truly need it. It also reduces risk, because the assistant has a defined list of things it will not do. A small dental practice, for example, might let the AI handle booking and opening-hours questions, while any caller mentioning pain or a post-treatment problem goes straight to a nurse or on-call dentist.",
        ],
      },
      {
        "heading": "A worked example and common mistakes",
        "paragraphs": [
          "Say a small physiotherapy clinic in Glasgow gets about 40 calls a week. Reading a week of voicemail and call logs, the owner sorts them: most are booking and rescheduling requests, some are opening-hours and parking questions, and a handful are patients in pain asking whether they should come in sooner. The first two groups are routine. The third needs a clinician.",
          "The decision follows from that sort. The clinic lets an AI answering service handle booking, rescheduling and general questions, and sets a rule that any caller who mentions pain, a fall, a post-surgery issue or the word urgent is transferred to the duty physio, with a text alert sent at the same time. Nothing is left to chance for the sensitive group, and the routine group no longer waits for reception to be free."
        ],
        "bullets": [
          "Mistake: judging on price alone. Compare cost per handled call and the cost of calls that still need a person afterwards.",
          "Mistake: no escalation rules. Write down which words and situations must reach a human, and test them with real calls.",
          "Mistake: skipping a trial. Run a two to four week pilot with a clear review date and listen to the recordings.",
          "Mistake: forgetting after-hours. Decide who gets urgent calls at 9 pm on a Sunday before you go live.",
          "Mistake: never updating the script or fact sheet. Review it monthly, and whenever prices or hours change.",
          "Decision rule: if more than half your calls are routine, start with AI. If most are sensitive, start with humans."
        ]
      },
      {
        heading: "How to decide",
        paragraphs: [
          "Listen to a week of your own calls, or read your voicemail log, and sort them into routine, sensitive and complex. If most calls are routine, start with AI. If most are sensitive, start with humans and add AI for after-hours or overflow. If it is mixed, go hybrid.",
          "Run a trial before committing, with a firm review date. Ask for call recordings and transcripts, and check what callers actually experienced. A free automation audit at /contact can help you map your call types, and /services/voice-and-calls describes how we build voice setups.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the difference between an AI answering service and a call center?",
        a: "An AI answering service uses software to answer calls automatically, while a call center uses human agents working in shifts. AI is available around the clock and handles many calls at once, and humans handle nuance and sensitive conversations better.",
      },
      {
        q: "Is an AI answering service cheaper than a human one?",
        a: "Often it is for routine calls, because costs scale with usage rather than staff time. But pricing models vary, so compare using your own call volume and check each provider's current pricing.",
      },
      {
        q: "Can an AI answering service replace my receptionist?",
        a: "It can take over routine calls and after-hours cover, but most businesses keep a person for complex, sensitive or in-person work. Treat it as extra capacity rather than a full replacement.",
      },
      {
        q: "What is a hybrid answering setup?",
        a: "AI answers first and handles routine calls, then transfers urgent or complicated ones to a person. The person can be your staff or a human answering service on call.",
      },
      {
        q: "Are AI answering services safe for customer data?",
        a: "They can be if you choose a provider carefully. Ask where data is stored, how long recordings are kept and whether it is used for training, and follow GDPR or local rules on call recording. This is not legal advice.",
      },
    ],
    services: ["voice-and-calls", "customer-support"],
    category: "Automation & AI",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "chatgpt-for-small-business",
    title: "ChatGPT for Small Business: Practical Uses and Limits",
    description:
      "Practical ways to use ChatGPT and similar AI tools in a small business, from drafting emails to summarising notes, plus limits and data care to keep in mind.",
    published: "2026-11-18",
    readMinutes: 6,
    keywords: [
      "chatgpt for small business",
      "how to use chatgpt for business",
      "ai tools for small business",
      "chatgpt business use cases",
      "is chatgpt safe for business",
    ],
    intro: [
      "ChatGPT and similar AI assistants can save a small business real time on writing, summarising, planning and sorting, if you know what to ask and what to check. They can also produce confident mistakes and are a risk if you paste in the wrong data.",
      "This guide covers practical uses of ChatGPT for small business, how to write better requests, the limits to respect, and how to handle data with care. We use ChatGPT as the example, but the advice applies to other assistants such as Claude and Gemini.",
    ],
    sections: [
      {
        heading: "What ChatGPT is good at in a small business",
        paragraphs: [
          "These tools are strongest at working with language. They are good at drafting, rewriting, summarising, explaining and structuring text, and at turning messy notes into something clean. They are weaker at facts you have not given them, exact arithmetic, and anything that needs current information they may not have.",
          "A useful mindset is that it is a fast, well-read assistant that sometimes makes things up. Give it the material, ask for a first draft, then check and edit. You remain responsible for what goes out under your name.",
        ],
      },
      {
        heading: "Practical use cases you can try this week",
        paragraphs: [
          "These are everyday jobs where ChatGPT business use tends to pay off. Start with one or two.",
        ],
        bullets: [
          "Email drafts. Paste a customer message and your key points, and ask for a short, polite reply in your tone.",
          "Meeting and call notes. Paste a transcript or rough notes and ask for decisions, action items and owners.",
          "Quotes and proposals. Turn a bullet list of scope into a clear proposal, then adjust the numbers yourself.",
          "Job descriptions and policies. Get a first version of a job advert or staff handbook section to edit.",
          "Product and service descriptions. Rewrite your own descriptions for different audiences or lengths.",
          "Spreadsheet help. Ask for a formula, or for an explanation of an unfamiliar one.",
          "Customer FAQs. Turn a pile of past questions into a clear FAQ page.",
          "Brainstorming. Ask for ten ideas for a campaign, a newsletter topic or a name, then pick and refine.",
        ],
      },
      {
        heading: "How to write requests that give useful answers",
        paragraphs: [
          "Vague requests give generic answers. A good request has four parts: the task, the context, the format and any limits.",
          "For example: \"You are helping a small dental clinic in Bristol. Write a friendly reminder text for patients with an appointment tomorrow. Under 300 characters. Include the clinic name and a way to reschedule. Do not give medical advice.\" Then follow up: shorten it, change the tone, try three versions. Keep a note of requests that work well and reuse them. If you do the same task weekly, that is a sign it could be automated, as covered in /guides/workflow-automation-examples.",
        ],
      },
      {
        heading: "The limits you need to respect",
        paragraphs: [
          "AI assistants can state wrong things in a convincing way. This is often called hallucination. It is more likely when you ask about specific facts, laws, prices, citations or recent events.",
        ],
        bullets: [
          "Check facts, figures, names and links before you publish or send anything.",
          "Do not rely on it for legal, tax, medical or financial advice. Use it to prepare questions for a professional instead.",
          "Do not let it make promises, discounts or commitments on your behalf without a person reading them.",
          "Expect a generic voice. Edit so the text sounds like you and includes details only your business knows.",
          "Tell it what you want left out. It tends to pad with filler.",
        ],
      },
      {
        heading: "Data care: what not to paste in",
        paragraphs: [
          "Treat anything you type into an AI tool as data you are sharing with a third party. Before you paste, ask whether you would be comfortable if that data left your control.",
          "Avoid pasting health information, payment card numbers, passwords, government ID numbers, and customer lists with personal details unless you have checked the tool's terms and have a lawful basis. Replace names and details with placeholders where you can. Read the provider's settings on whether your content can be used to train models, and whether a business or team plan changes that. Plan names and terms change, so check the vendor's current documentation. If you handle European or UK customer data, see /guides/gdpr-ai-automation. This is not legal advice.",
        ],
      },
      {
        heading: "Free accounts, team plans and company rules",
        paragraphs: [
          "Many small teams start with personal accounts. This quickly becomes untidy: work content sits in staff members' private histories, and nobody controls the settings. Business or team plans from the main providers generally add shared admin controls and different data-handling terms, but features and terms vary, so read the current details before choosing.",
          "Write a one-page rule for staff: what tools are allowed, what data must never be pasted, who checks AI-written content before it goes to a customer, and where to ask questions. Short and clear beats long and ignored.",
        ],
      },
      {
        "heading": "A worked example: turning notes into a customer reply",
        "paragraphs": [
          "Say you run a small bathroom fitting firm in Bristol, and a customer emails asking why their quote is higher than a friend's. You do not want to sound defensive, and you have ten minutes between jobs. You paste the customer's email into the assistant with this request: \"Draft a polite, short reply from a bathroom fitter. Explain that our quote includes removing the old suite, waterproofing and a 5 year workmanship guarantee. Do not mention other companies. Do not promise a discount. Offer a call to talk it through.\" Replace any real names or addresses with placeholders first.",
          "The assistant returns a draft in seconds. You check it against what you actually include, delete a sentence that overstates something, add the customer's first name and send it. The tool saved the blank-page effort and you kept the decisions. That is the pattern that works: you supply facts and limits, it supplies wording, you approve."
        ],
        "bullets": [
          "Mistake: pasting customer lists or sensitive details. Use placeholders and keep personal data out where you can.",
          "Mistake: copying the first answer. Ask for two or three versions and then edit.",
          "Mistake: trusting figures and legal claims. Check every number, date and rule against a reliable source.",
          "Mistake: letting everyone use their own account. Agree one set of approved tools and rules.",
          "Mistake: expecting it to know your business. Paste in the relevant price list, policy or notes each time.",
          "Decision rule: if a wrong answer would cost money, safety or trust, a person checks it before it is used."
        ]
      },
      {
        heading: "From chat to automation",
        paragraphs: [
          "Chatting with an assistant is manual: someone has to open it, paste, and copy the result back. When the same task repeats, such as sorting incoming email or drafting replies, the same AI can run inside an automation that does the pasting for you and hands the output to a person to approve. Start with chat to learn what works, then automate the tasks that prove their value.",
          "If you are not sure which tasks are worth automating, the free audit at /contact can help you pick. Our overview of the wider picture is in /guides/ai-automation-for-small-business.",
        ],
      },
    ],
    faqs: [
      {
        q: "How can a small business use ChatGPT?",
        a: "Common uses are drafting emails and replies, summarising meetings, writing job adverts and product descriptions, preparing proposals, getting spreadsheet help and brainstorming ideas. Always read and edit the output before it goes out.",
      },
      {
        q: "Is ChatGPT safe to use with customer data?",
        a: "Only with care. Avoid pasting sensitive or personal data unless you have checked the provider's terms, your settings and your legal basis. Where you can, anonymise the data first. Check with a professional if you are unsure.",
      },
      {
        q: "Can ChatGPT replace my staff?",
        a: "No. It speeds up drafting and sorting, but it makes mistakes and has no judgment about your customers or business. Think of it as a helper that a person supervises.",
      },
      {
        q: "Should I pay for a business or team plan?",
        a: "If several people use it for work, a business or team plan is worth looking at for shared controls and clearer data terms. Plans and terms change, so check the provider's current pages.",
      },
      {
        q: "What is a hallucination in AI?",
        a: "It is when an AI states something false as if it were true, such as an invented fact or source. Reduce the risk by supplying the facts yourself and checking anything important.",
      },
    ],
    services: ["operations", "customer-support", "marketing"],
    category: "Automation & AI",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "ai-agents-for-small-business",
    title: "AI Agents for Small Business: What Works Today",
    description:
      "What AI agents for small business can and cannot do reliably today, with practical examples, the guardrails to set and how to start without risking customers.",
    published: "2026-11-18",
    readMinutes: 6,
    keywords: [
      "ai agents for small business",
      "what is an ai agent",
      "ai agent examples",
      "business ai agents",
      "can ai agents replace employees",
    ],
    intro: [
      "An AI agent is software that uses an AI model to decide what to do next and then uses tools to do it, such as reading an inbox, searching a calendar or updating a CRM. Today they work well on narrow, well-defined jobs with checks, and badly on open-ended ones with no supervision.",
      "This guide explains what AI agents for small business can do reliably now, what they cannot, a few hypothetical examples, the guardrails that matter, and how to start safely. The field moves fast, so treat any claim about capabilities, including ours, as a snapshot and test on your own tasks.",
    ],
    sections: [
      {
        heading: "What an AI agent is, in plain terms",
        paragraphs: [
          "A normal automation follows fixed steps: when X happens, do A, then B, then C. An AI agent is given a goal and a set of tools, and the model chooses which tool to use and in what order. If the first attempt does not work, it can try another way.",
          "That flexibility is the appeal and the risk. The more freedom the agent has, the more ways it can go wrong. For the difference between agentic and ordinary generative AI, see /guides/agentic-ai-vs-generative-ai.",
        ],
      },
      {
        heading: "What agents can do reliably today",
        paragraphs: [
          "Agents are dependable when the task is narrow, the tools are few, the inputs are predictable and a mistake is easy to catch. In that setting they save real time.",
        ],
        bullets: [
          "Triage. Read an incoming email or form, classify it, and route it to the right person or folder.",
          "Research and summaries. Gather information from a set list of sources and produce a short brief for a person to review.",
          "Drafting. Write a first reply or follow-up using context from your CRM, to be approved before sending.",
          "Data extraction. Pull fields from documents and put them into a spreadsheet or system, with checks.",
          "Scheduling. Propose meeting times by checking calendars and sending an invite after approval.",
        ],
      },
      {
        heading: "What they cannot do reliably yet",
        paragraphs: [
          "Be honest about the limits. Agents can lose track in long multi-step jobs, misread an ambiguous instruction, or follow the wrong instruction hidden inside a document or web page (known as prompt injection). They do not understand your business the way a trained employee does.",
        ],
        bullets: [
          "Long, open-ended projects with many dependencies and no checkpoints.",
          "Decisions with legal, financial or safety consequences.",
          "Anything where a wrong action cannot be undone, such as sending money or deleting records.",
          "Handling untrusted content with broad permissions, for example reading any inbound email and acting on it freely.",
          "Judging tone and relationships in delicate customer situations.",
        ],
      },
      {
        heading: "Hypothetical examples for a small business",
        paragraphs: [
          "Say a landscaping company receives quote requests through a web form. An agent reads each request, checks the postcode against the service area, looks up the next free survey slot, drafts a reply offering two times, and puts the draft in front of the owner. The owner approves with one click. The agent does the legwork and a person keeps the decision.",
          "Or say an accountancy practice has a shared inbox. An agent labels each email, pulls out any client name, finds the matching record, and drafts an acknowledgement. Anything unclear is labelled for a person. More ideas of this kind are in /guides/small-business-automation-ideas.",
        ],
      },
      {
        heading: "Guardrails that make agents safe to use",
        paragraphs: [
          "Treat guardrails as part of the build, not an extra. Most of the reliability of an agent comes from what it is not allowed to do.",
        ],
        bullets: [
          "Least privilege. Give it access only to the tools and data it needs, with read-only access where possible.",
          "Human approval. Anything that sends, spends or deletes waits for a person.",
          "Clear limits. List what it may say and do, and what it must hand to a human.",
          "Logging. Record every action and tool call so you can see what happened and why.",
          "Testing. Run it on real past examples, including odd ones, before it touches live work.",
          "Spend and rate limits. Cap model usage and the number of actions per hour.",
        ],
      },
      {
        heading: "Workflow or agent: which do you need?",
        paragraphs: [
          "Many tasks that people call agent work are better built as a plain workflow with one AI step. If you can write the steps down in advance, a fixed workflow is cheaper, faster and easier to test. Use a true agent only when the path really varies from case to case and the cost of a wrong turn is low.",
          "A good rule: start with the simplest thing that works, add AI only where text must be read or written, and add agent-style decision making last. Our tool comparison is in /guides/zapier-vs-make-vs-n8n.",
        ],
      },
      {
        "heading": "A worked example: a quote request agent with approval",
        "paragraphs": [
          "Say a small removals firm in Birmingham gets quote requests by web form and email. Today the owner reads each one, checks the diary, estimates the job and replies, usually in the evening. An agent could cover the legwork. It reads the new request, pulls out the pickup and delivery postcodes, the date and the size of the home, checks the diary for that date, and drafts a reply with two available slots and a request for a few missing details.",
          "The draft is posted to the owner's phone with Approve and Edit buttons. The agent is not allowed to send a price, because the owner prices each job, and it cannot accept bookings. If the request is for an unusual item such as a piano, or is outside the service area, it flags the request as needs human and stops. Every action is logged. After two weeks of shadow running, the owner compares the agent's drafts with the replies sent by hand and decides what to tighten."
        ],
        "bullets": [
          "Mistake: giving one agent access to everything. Give each agent only the tools its task needs.",
          "Mistake: letting it send before it has earned trust. Start with drafts and approvals.",
          "Mistake: no cap on usage or actions per hour. A loop can run up AI costs quickly, so set limits.",
          "Mistake: treating all inbound text as safe. Email and web content can contain instructions meant to mislead an agent.",
          "Mistake: judging by one good demo. Test with at least twenty real, messy past cases.",
          "Decision rule: use an agent only when the steps vary and a wrong step is cheap to undo. Otherwise use a fixed workflow."
        ]
      },
      {
        heading: "How to start",
        paragraphs: [
          "Pick one task that is frequent, low risk and easy to check. Write the steps and the exceptions. Build it with approval before any outward action, run it in shadow mode for two weeks where a person does the real work and compares, then switch to approve-and-send. Track mistakes and fix the rules, not just the prompts.",
          "If you would like a second opinion on which task to pick, the free automation audit at /contact is a good starting point.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is an AI agent for a small business?",
        a: "It is software that uses an AI model to decide the next step toward a goal and uses tools such as email, calendars or a CRM to carry it out. It works best on narrow tasks with checks and human approval.",
      },
      {
        q: "Can AI agents replace employees?",
        a: "Not reliably. They can take on parts of a role, like triage or drafting, but they lack judgment and make mistakes. Most small businesses use them to give staff time back, not to replace people.",
      },
      {
        q: "Are AI agents safe to give access to my email or CRM?",
        a: "Only with limits. Give minimum access, require approval for outward actions, keep logs, and be careful with untrusted content like inbound email that could contain hidden instructions.",
      },
      {
        q: "What is the difference between an agent and an automation?",
        a: "An automation follows fixed steps you define. An agent chooses its own steps using tools. Fixed automations are more predictable, and agents are more flexible but riskier.",
      },
      {
        q: "How much do AI agents cost to run?",
        a: "Costs come from AI model usage, the platform and the build effort, and they vary widely. Check current vendor pricing and cap usage so a loop cannot run up a bill.",
      },
    ],
    services: ["operations", "custom-build", "sales-and-leads"],
    category: "Automation & AI",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "build-ai-agent-without-code",
    title: "Build an AI Agent Without Code: Step by Step",
    description:
      "How to build a simple AI agent without code using n8n, Make or Zapier: choose a task, connect tools, add the AI step, set guardrails, test and go live safely.",
    published: "2026-11-18",
    readMinutes: 6,
    keywords: [
      "build ai agent without code",
      "no code ai agent",
      "how to build an ai agent",
      "n8n ai agent",
      "make ai agent",
      "zapier ai agent",
    ],
    intro: [
      "You can build a simple AI agent without writing code using a visual automation tool such as n8n, Make or Zapier. The pattern is the same in each: a trigger starts it, an AI step reads or decides, tool steps act, and a person approves anything risky.",
      "This guide walks through the steps with a hypothetical example: an agent that reads new enquiries, drafts a reply and logs the lead. Tool features and pricing change often, so use this as a method and check each tool's current documentation for exact menus and limits.",
    ],
    sections: [
      {
        heading: "Step 1: choose a small, safe task",
        paragraphs: [
          "Pick a job that happens often, follows a pattern and is easy to check. Good first choices are sorting enquiries, drafting replies, summarising meetings or extracting details from emails. Avoid anything that moves money or makes promises.",
          "Write the task as a sentence: \"When a new enquiry arrives, classify it, draft a reply from our price list and service area, and save it to the CRM for approval.\" If you cannot write it like that, narrow it down.",
        ],
      },
      {
        heading: "Step 2: pick the tool",
        paragraphs: [
          "All three tools can do this. The choice depends on your team and data.",
        ],
        bullets: [
          "Zapier is the simplest for short linear flows and works well if no technical person will maintain it.",
          "Make has a visual canvas that handles branches and data reshaping well.",
          "n8n offers more control, code steps and the option to self-host, with a steeper learning curve.",
        ],
      },
      {
        heading: "Step 3: set the trigger and gather the data",
        paragraphs: [
          "Choose what starts the agent: a new form entry, a new email in a label, a new row in a sheet. Then collect everything the AI will need in one place: the message, the customer's history from your CRM, and your reference information such as services, areas and prices.",
          "The more relevant context the AI step gets, the better the output. Do not paste your whole knowledge base into every call. Fetch only what is relevant, for example the three most relevant FAQ entries.",
        ],
      },
      {
        heading: "Step 4: add the AI step with clear instructions",
        paragraphs: [
          "Add the AI model step and write instructions that cover the role, the task, the rules and the output format. Ask for a structured output such as a category, a confidence level and a draft reply, so later steps can read it reliably.",
        ],
        bullets: [
          "Role: \"You write replies for a small cleaning company.\"",
          "Rules: use only the information provided, never quote prices not in the list, and say a team member will confirm if unsure.",
          "Format: return the category, a one-line summary and the draft text in separate fields.",
          "Fallback: if the request does not fit any category, return \"needs human\".",
        ],
      },
      {
        heading: "Step 5: add tools and branches",
        paragraphs: [
          "Next, connect the steps that act: look up the contact in the CRM, create a record if none exists, save the draft, and notify the right person. Use a branch on the AI's category field. Enquiries labelled \"quote\" go one way, \"complaint\" another, \"needs human\" straight to a person.",
          "Keep the number of tools small. Each extra capability adds ways to fail. For a deeper look at what agents can reliably do, see /guides/ai-agents-for-small-business.",
        ],
      },
      {
        heading: "Step 6: add guardrails and a human check",
        paragraphs: [
          "Before the agent sends anything to a customer, add an approval step: a message to you or your team with the draft and Approve and Edit buttons or links. Add an error path that alerts a named person when a run fails. Set usage limits in your AI provider account so a bug cannot create a surprise bill.",
          "Never put passwords or card data into prompts. Mask personal details you do not need. If you handle EU or UK data, read /guides/gdpr-ai-automation first.",
        ],
      },
      {
        "heading": "A worked example: an enquiry reply agent in n8n, Make or Zapier",
        "paragraphs": [
          "Say you run a small cleaning company and want new website enquiries handled faster. In the tool of your choice, the workflow has six blocks. A trigger fires when the website form is submitted. A lookup step searches your CRM or sheet for the email address. An AI step receives the message, your price guide and your service area, and returns three fields: category, a confidence note and a draft reply. A branch sends anything labelled complaint or needs human to the owner directly. Everything else goes to an approval message in chat with the draft. When approved, the email is sent and the lead is saved with a status.",
          "Build it one block at a time and test after each block, using the tool's built-in run history to see what each step received and returned. Look at where data goes missing. Most first-time problems are an empty field passed into the AI step, a trigger that fires twice, or an AI answer that comes back in the wrong format. Fix the instruction text first, for example by asking for plain labelled fields only."
        ],
        "bullets": [
          "Mistake: starting with a big, ambitious agent. Build the smallest useful version first.",
          "Mistake: putting your API keys in a shared screenshot or workflow notes. Use the tool's credential store.",
          "Mistake: no error path. Add a step that messages a named person when a run fails.",
          "Mistake: testing only with clean examples. Include spam, short messages and other languages.",
          "Mistake: building in a personal account. Use accounts the business owns so the workflow survives staff changes.",
          "Decision rule: if a plain rule can do the step, use a rule and keep the AI for reading or writing text."
        ]
      },
      {
        heading: "Step 7: test, then go live in stages",
        paragraphs: [
          "Test with at least twenty real past enquiries, including strange ones: very short, in another language, angry, spam. Check each draft. Fix the instructions and rules, not just single outputs.",
          "Then run in shadow mode for a week or two: the agent drafts, but your team still replies the usual way and compares. When the drafts are reliably good, switch to approve-and-send. Review a sample of runs every week and keep a log of changes. Once the basic version is stable, you can extend it, for example with the follow-ups in /guides/lead-follow-up-sequence.",
          "If you would rather have someone build and monitor it, our free audit at /contact is a good place to start.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can I really build an AI agent without coding?",
        a: "Yes, for simple, well-defined tasks. Visual tools like n8n, Make and Zapier let you connect an AI model to your apps. More complex or high-volume agents may still need custom code.",
      },
      {
        q: "Which no-code tool is best for AI agents?",
        a: "It depends. Zapier suits simple flows, Make suits branching flows on a hosted canvas, and n8n suits teams wanting more control or self-hosting. Test your actual task in a free trial and check current pricing.",
      },
      {
        q: "How do I stop the agent making mistakes?",
        a: "Limit what it can do, give it clear rules and structured output, add a human approval step and test on real examples. Review a sample of runs regularly and fix the rules when you find errors.",
      },
      {
        q: "How much does it cost to run a no-code AI agent?",
        a: "You pay for the automation platform and for AI model usage, which depend on how many runs you have. Check each vendor's current pricing and set usage limits in your AI account.",
      },
      {
        q: "What should I automate first?",
        a: "Start with a frequent, low-risk task that is easy to check, such as drafting replies to enquiries for approval. Avoid money movement and promises until you trust the setup.",
      },
    ],
    services: ["operations", "custom-build", "customer-support"],
    category: "Automation & AI",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "agentic-ai-vs-generative-ai",
    title: "Agentic AI vs Generative AI: The Plain Difference",
    description:
      "Agentic AI vs generative AI explained in plain English: what each does, how they differ, with business examples and when a small business needs one or both.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "agentic ai vs generative ai",
      "what is agentic ai",
      "what is generative ai",
      "difference between agentic ai and generative ai",
      "agentic ai examples",
    ],
    intro: [
      "Generative AI creates content such as text, images or summaries when you ask. Agentic AI uses that ability to pursue a goal by taking actions with tools, such as checking a calendar, updating a record or sending a message. One produces, the other acts.",
      "This guide explains the difference in plain words with business examples, shows how they fit together, and helps you decide what a small business actually needs. The terms are used loosely in marketing, so we define them as we go.",
    ],
    sections: [
      {
        heading: "Generative AI in one paragraph",
        paragraphs: [
          "Generative AI models, such as the ones behind ChatGPT, Claude and Gemini, produce new content in response to a prompt. You give an input and get an output: a drafted email, a summary of a long document, a product description, a translated paragraph, a picture.",
          "It is reactive. It does nothing until you ask, and it stops once it has answered. A person decides what to do with the result. Our practical guide to this kind of use is /guides/chatgpt-for-small-business.",
        ],
      },
      {
        heading: "Agentic AI in one paragraph",
        paragraphs: [
          "Agentic AI is given a goal and a set of tools, then plans and carries out steps toward that goal, checking results along the way. The language model is the brain, and the tools are the hands. It can read an inbox, look up a customer, book a slot, update a spreadsheet and report back.",
          "It is proactive within limits. It can run multiple steps without being prompted each time, and it can change course if a step fails. That autonomy is what makes it useful and also what requires guardrails. More on this in /guides/ai-agents-for-small-business.",
        ],
      },
      {
        heading: "The key differences",
        paragraphs: [
          "The distinction is less about the underlying model and more about how it is used.",
        ],
        bullets: [
          "Output vs action. Generative AI gives you content. Agentic AI performs tasks.",
          "Single step vs multi-step. Generative AI answers a prompt. Agentic AI plans and runs a sequence.",
          "Human in the loop. With generative AI you review each output. With agentic AI you review at checkpoints, so you need to design them.",
          "Tools. Generative AI often needs none. Agentic AI depends on connections to your systems.",
          "Risk. A bad generative answer is a bad draft. A bad agentic action can change real records or send a real message.",
        ],
      },
      {
        heading: "Business examples side by side",
        paragraphs: [
          "Take a customer enquiry. With generative AI, a staff member pastes the message into a chat tool and asks for a draft reply, then copies the result into their email. With agentic AI, the system reads the new enquiry, looks up the customer, checks availability, drafts the reply and puts it in an approval queue.",
          "Take monthly reporting. Generative AI can summarise a report you paste in. An agent can pull the figures from your accounting tool and sales system, build the summary and email it to you on the first of the month.",
          "Take invoices. Generative AI can explain an invoice. An agentic workflow can read supplier invoices from an inbox, check them against a purchase order, file them and flag mismatches, as in /guides/invoice-automation-small-business.",
        ],
      },
      {
        heading: "How they work together",
        paragraphs: [
          "Agentic systems are built on generative models. The model reads, reasons and writes, and the surrounding system adds tools, memory, rules and checks. In practice, the most reliable setups are not pure agents. They are fixed workflows with one or two AI steps, where the AI handles the language and the rules handle the actions.",
          "That is often the better answer for a small business: predictable steps, AI only where needed, a person approving risky actions.",
        ],
      },
      {
        "heading": "A worked example and the questions to ask a vendor",
        "paragraphs": [
          "Say a small accountancy practice receives client documents by email each month. With generative AI alone, a staff member opens each email, pastes the text into a chat tool and asks for a summary of what was sent and what is missing. It is helpful and takes minutes per client, but the person still does all the clicking, filing and chasing.",
          "With an agentic setup, the system watches the inbox, identifies the client from the sender, saves each attachment into the right folder, compares what arrived with a checklist of expected documents and drafts a chaser email listing what is still missing. A person approves the chaser. The language model does the reading and writing in both cases. The difference is that the second setup also takes the surrounding actions, which is where the time savings, and the risks, come from.",
          "When a vendor says its product is agentic, these questions cut through the label."
        ],
        "bullets": [
          "What actions can it take in my systems, and can I restrict them?",
          "What does it do when it is unsure, and who gets told?",
          "Can I see a log of every action and decision?",
          "Which steps need a person to approve before they happen?",
          "What happens to my data, and is it used to train models?",
          "What does it cost per run or per month, and can I set a cap?",
          "Can I switch it off quickly if it starts misbehaving?"
        ]
      },
      {
        heading: "Which does a small business need?",
        paragraphs: [
          "Start with generative AI. It needs no setup beyond an account and some practice, and it shows you where AI helps and where it falls short. Use it for drafting, summarising and brainstorming.",
          "Move to automation when you notice yourself repeating the same prompt and copy-paste routine. Add agentic behaviour only when the path varies from case to case and a wrong step is low-cost and reversible. If you want help judging that, the free automation audit at /contact is a low-pressure way to find out.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the main difference between agentic AI and generative AI?",
        a: "Generative AI produces content when asked. Agentic AI pursues a goal by choosing and taking actions with tools. Agentic systems usually use a generative model inside them.",
      },
      {
        q: "Is ChatGPT agentic AI?",
        a: "A plain chat is generative AI. Some tools built on the same models can also take actions with connected apps, which makes them agentic in behaviour. The label depends on what the product does, not on the brand.",
      },
      {
        q: "Is agentic AI better than generative AI?",
        a: "Not better, just different. Agentic AI can save more time because it completes tasks, but it carries more risk and needs more setup and supervision.",
      },
      {
        q: "Do I need agentic AI for my small business?",
        a: "Often a simple automation with one AI step is enough. Consider agentic AI only for tasks whose steps vary and where mistakes are cheap to reverse.",
      },
    ],
    services: ["operations", "customer-support"],
    category: "Automation & AI",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "ai-chatbot-for-website",
    title: "AI Chatbot for Website: Setup, Training and Pitfalls",
    description:
      "How to add an AI chatbot to your website: what to set up, how to train it on your own content, how handoff to a person works, and the pitfalls to avoid.",
    published: "2026-11-18",
    readMinutes: 6,
    keywords: [
      "ai chatbot for website",
      "add chatbot to website",
      "ai chatbot for small business",
      "train chatbot on my website",
      "website live chat ai",
    ],
    intro: [
      "An AI chatbot for your website answers visitors' questions using your own content, captures leads and passes complex conversations to a person. Done well it saves repetitive replies. Done badly it frustrates visitors and makes things up.",
      "This guide covers how to add an AI chatbot to a website: deciding what it should do, setting it up, training it on your content, building a clean handoff, and the pitfalls that catch most small businesses. Chatbot products and pricing change often, so check each vendor's current details.",
    ],
    sections: [
      {
        heading: "Decide what the chatbot is for",
        paragraphs: [
          "Start with the job. A chatbot that tries to do everything does most things poorly. Pick one to three purposes and write them down.",
        ],
        bullets: [
          "Answer common questions about services, hours, areas, delivery and returns.",
          "Capture leads by asking for name, contact details and what the visitor needs.",
          "Book appointments or calls through a link to your calendar.",
          "Help visitors find the right page or product.",
          "Route support requests to the right person.",
        ],
      },
      {
        heading: "How the setup works",
        paragraphs: [
          "Most website chatbots follow the same pattern. You sign up with a chatbot platform or build one in a tool such as n8n, connect your content, set instructions, style the chat widget, and paste a small code snippet or install a plugin on your site. WordPress, Shopify, Wix and Squarespace all support this in some way, though the steps vary.",
          "Before you go live, decide where the widget appears. Putting it on every page can distract from your main call to action. Often it suits pricing, contact and product pages best.",
        ],
      },
      {
        heading: "Training it on your content",
        paragraphs: [
          "The common method is retrieval: the chatbot searches your content for passages relevant to the question and writes an answer from them. It is not retraining a model. That means the quality of the answers depends on the quality of your content.",
          "Gather your service pages, FAQs, policies, price list and any documents customers ask about. Remove outdated material. Fill gaps by writing short answers to the twenty questions you hear most. Tell the chatbot to answer only from this material and to say it does not know when the answer is missing. Re-sync whenever your content changes, because a chatbot quoting last year's prices is a liability.",
        ],
      },
      {
        heading: "Handoff to a human",
        paragraphs: [
          "A chatbot should know when to stop. Define triggers: the visitor asks for a person, expresses frustration, mentions a complaint or a refund, asks about something outside its content, or the bot has failed to help twice.",
          "At handoff, offer a clear route: a live chat with your team during hours, or a form that sends the full conversation to your inbox with a promise of a reply time. Do not make visitors repeat themselves. Pass the transcript along. If you also run phones, the same principle is covered in /guides/ai-receptionist-small-business.",
        ],
      },
      {
        heading: "Pitfalls to avoid",
        paragraphs: [
          "Most chatbot problems are predictable.",
        ],
        bullets: [
          "Made-up answers. Without strict instructions the bot may invent policies or prices. Limit it to your content and test with trick questions.",
          "No way out. Always provide a visible option to contact a person.",
          "Pretending to be human. Say clearly that it is an automated assistant.",
          "Stale content. Assign someone to update the sources monthly.",
          "Pop-ups that block the page. Keep it unobtrusive, especially on mobile.",
          "Ignoring conversations. Read a sample of chats each week to find gaps and fix them.",
        ],
      },
      {
        heading: "Privacy and consent",
        paragraphs: [
          "A chatbot collects personal data: names, emails, and whatever visitors type. Tell visitors what is collected and why, link to your privacy policy, and avoid asking for sensitive information. If you serve EU or UK visitors, GDPR rules apply, and your cookie and consent setup may need to cover the chat widget. This is not legal advice, so check with a professional.",
          "Ask the vendor where chats are stored, how long they are kept, and whether they are used to train models. See /guides/gdpr-ai-automation and /guides/cookie-consent-uk-eu for more.",
        ],
      },
      {
        "heading": "A worked example: a chatbot for a small dental practice",
        "paragraphs": [
          "Say a dental practice in Leeds wants a chatbot that handles the questions reception hears daily, without giving clinical advice. The owner collects the content: treatment pages, opening hours, new patient information, price ranges the practice is happy to publish, and the cancellation policy. She writes a short list of twenty questions patients ask most and a clear answer for each.",
          "The instructions say: answer only from the supplied content, never give medical advice or diagnoses, and if someone mentions pain, swelling or bleeding, show the emergency contact details and offer a callback. For booking, the bot links to the online booking page. For anything else it collects a name, phone number and reason, and emails the reception team. She tests thirty tricky questions, including ones about treatments the practice does not offer, and fixes the answers that were wrong. Only then does the widget go live, on the contact and treatment pages."
        ],
        "bullets": [
          "Mistake: letting the bot answer outside your content. Tell it to say it does not know and offer a person.",
          "Mistake: giving advice in regulated areas such as health, law or finance. Add hard rules and test them.",
          "Mistake: no monitoring. Read a sample of conversations weekly for the first month.",
          "Mistake: forgetting mobile. Check the widget does not cover buttons or forms on a phone.",
          "Mistake: leaving old pricing in the sources. Re-sync after every change.",
          "Decision rule: if you cannot staff the handoff, offer a callback form rather than live chat."
        ]
      },
      {
        heading: "How to know if it is working",
        paragraphs: [
          "Pick measures that match your goal: number of leads captured, questions answered without a human, handoffs that were needed, and visitor ratings if you ask for them. Keep them modest and honest. A chatbot that answers half the routine questions correctly and hands off the rest cleanly is a success.",
          "If you want a second pair of eyes on your setup, the free audit at /contact is a good starting point, and our web work is described at /services/web-development.",
        ],
      },
    ],
    faqs: [
      {
        q: "How do I add an AI chatbot to my website?",
        a: "Choose a chatbot platform or build one in an automation tool, connect your content, set clear instructions, then add the widget through a code snippet or plugin. Test it thoroughly before showing it to visitors.",
      },
      {
        q: "Can I train a chatbot on my own website content?",
        a: "Yes. Most platforms can read your pages and documents and answer from them. Keep the content accurate and up to date, and tell the bot to say it does not know when the answer is missing.",
      },
      {
        q: "Will an AI chatbot give wrong answers?",
        a: "It can. Reduce the risk by limiting it to your own content, testing with tricky questions, reviewing real chats and offering a clear route to a person.",
      },
      {
        q: "Is an AI chatbot GDPR compliant?",
        a: "It depends on how it is set up and used. You need a lawful basis, a clear privacy notice, a suitable agreement with the vendor and sensible retention. This is not legal advice.",
      },
      {
        q: "How much does a website chatbot cost?",
        a: "Costs vary by vendor and usage, from basic plans to custom builds. Check current pricing and ask about message limits and extra fees.",
      },
    ],
    services: ["customer-support", "web-development", "sales-and-leads"],
    category: "Automation & AI",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "workflow-automation-examples",
    title: "20 Workflow Automation Examples for Small Teams",
    description:
      "Twenty workflow automation examples for small teams, grouped by sales, marketing, support, finance, HR and operations, with how each works and what to check.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "workflow automation examples",
      "business automation examples",
      "automation ideas for small business",
      "examples of workflow automation",
      "automate repetitive tasks",
    ],
    intro: [
      "Here are 20 workflow automation examples that small teams can build with tools such as Zapier, Make or n8n, grouped by department. Each is a pattern you can copy: a trigger, a few steps and a place where a person checks.",
      "All examples are hypothetical and described in general terms. Pick the one or two that match a task your team does every week. If you want more ideas after this, see /guides/small-business-automation-ideas.",
    ],
    sections: [
      {
        heading: "How to read these examples",
        paragraphs: [
          "Every workflow below has the same shape. Something happens (the trigger), the system does a few steps, and a person is told or asked when judgment is needed. The best candidates happen often, look similar each time and are easy to check.",
          "Do not build all twenty. Choose the one that costs your team the most time, and build it well. The method for doing that is in /guides/business-process-automation-guide.",
        ],
      },
      {
        heading: "Sales and lead workflows",
        paragraphs: [
          "These keep new enquiries from slipping through gaps.",
        ],
        bullets: [
          "1. New lead to CRM. A web form entry creates a contact and a deal, and alerts the owner.",
          "2. Instant first reply. A new lead gets a short acknowledgement within minutes, covered in /guides/speed-to-lead.",
          "3. Quote follow-up. If a quote gets no reply after three days, a polite nudge goes out, then a task is created for a call.",
          "4. Won deal handover. Marking a deal as won creates a project, sends a welcome message and assigns an onboarding checklist.",
        ],
      },
      {
        heading: "Marketing and content workflows",
        paragraphs: [
          "These keep your marketing consistent without constant manual work.",
        ],
        bullets: [
          "5. Newsletter signup. A subscriber is added to your email list with the right tags and receives a welcome email.",
          "6. Review requests. After a completed job, the customer gets a message asking for a review, see /guides/get-more-google-reviews.",
          "7. Content scheduling. Approved posts in a spreadsheet are published to social channels at set times.",
          "8. Lead source reporting. New leads are tagged with their source, and a weekly summary shows what brought them in.",
        ],
      },
      {
        heading: "Customer support workflows",
        paragraphs: [
          "These reduce the time customers wait for a first response.",
        ],
        bullets: [
          "9. Email triage. Incoming support emails are labelled by type and urgency and sent to the right person.",
          "10. Draft replies. Common questions get an AI-drafted answer from your knowledge base, held for approval.",
          "11. Missed call text back. A missed call triggers a text with a booking link, as in /guides/missed-call-text-back-and-online-booking.",
          "12. Ticket escalation. A ticket open for more than two days with no reply alerts a manager.",
        ],
      },
      {
        heading: "Finance workflows",
        paragraphs: [
          "These cut repeated typing and chasing.",
        ],
        bullets: [
          "13. Invoice creation. A finished job creates an invoice in your accounting tool, see /guides/invoice-automation-small-business.",
          "14. Payment reminders. Overdue invoices trigger a polite reminder, checking payment status before each send.",
          "15. Supplier bill capture. Bills arriving by email are read, checked and filed as drafts for approval.",
        ],
      },
      {
        heading: "HR and operations workflows",
        paragraphs: [
          "These keep the internal side of the business moving.",
        ],
        bullets: [
          "16. New starter checklist. A new hire entry creates accounts requests, a welcome email and a first-week schedule.",
          "17. Holiday requests. A request form notifies the manager and updates the shared calendar once approved.",
          "18. Low stock alert. When an item falls below a set level in your stock sheet, the owner is messaged and a reorder is drafted.",
          "19. Weekly summary. Numbers from your sales, bookings and support tools are pulled into one email every Monday.",
          "20. Data backup check. A scheduled workflow confirms that backups ran and alerts you when one is missing.",
        ],
      },
      {
        "heading": "A worked example: choosing and sizing one workflow",
        "paragraphs": [
          "Say a four person electrical contractor in Dublin wants to pick one workflow from the list. The team lists what eats time each week. Replying to new enquiries takes about two hours, chasing unpaid invoices about one hour and compiling a Monday summary about 45 minutes. They score each one on frequency, clarity of rules and risk. Enquiry replies score highest: they happen daily, the first reply is nearly always the same, and an acknowledgement is low risk.",
          "They build workflow 2, the instant first reply, with a task for the owner to call within the working day. The sum is simple: roughly two hours a week spent on first replies, of which most can be replaced by an automatic acknowledgement and a pre-filled task, leaving a few minutes of checking. They record the numbers before the build so they can compare a month later. Only after that works do they add invoice reminders."
        ],
        "bullets": [
          "Mistake: building several workflows at once. You cannot tell which one caused a problem.",
          "Mistake: skipping the owner. Every workflow needs a named person who checks the alerts.",
          "Mistake: no duplicate protection. Check for an existing record before creating a new one.",
          "Mistake: ignoring edge cases such as spam and test entries. Filter them early.",
          "Mistake: sending messages to customers without a test run. Send to yourself first.",
          "Decision rule: pick the workflow with the most frequent, most repetitive and least risky work."
        ]
      },
      {
        heading: "Checks every workflow should have",
        paragraphs: [
          "Whatever you build, add four things. First, an error alert that tells a named person when a run fails. Second, a log of what happened. Third, an approval step before anything goes to a customer or moves money. Fourth, a note saying who owns the workflow and what it does.",
          "Start small, run it with a person checking for a couple of weeks, and only then let it run alone. If you would like help choosing and building the first one, our free audit at /contact is a good way in, and /services/operations explains how we work.",
        ],
      },
    ],
    faqs: [
      {
        q: "What are some examples of workflow automation?",
        a: "Common ones include sending a new lead to your CRM, replying instantly to enquiries, chasing overdue invoices, labelling support emails, requesting reviews after a job and sending a weekly summary of key numbers.",
      },
      {
        q: "Which workflow should a small business automate first?",
        a: "Pick a task that happens many times a week, follows clear rules and is easy to check, such as lead capture and first reply or invoice reminders.",
      },
      {
        q: "Do I need special software for workflow automation?",
        a: "Usually an automation platform such as Zapier, Make or n8n is enough, connected to the tools you already use. Check each vendor's current pricing.",
      },
      {
        q: "Can workflow automation go wrong?",
        a: "Yes, for example by sending duplicates or acting on wrong data. Add error alerts, logs, checks for duplicates and human approval for risky steps.",
      },
    ],
    services: ["operations", "sales-and-leads", "finance-and-hr"],
    category: "Automation & AI",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "business-process-automation-guide",
    title: "Business Process Automation: Map, Pick, Build, Test",
    description:
      "A step-by-step guide to business process automation for small teams: map your process, pick what to automate, build it, test it properly and measure the result.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "business process automation",
      "how to automate business processes",
      "process automation steps",
      "business process mapping",
      "automate repetitive tasks",
    ],
    intro: [
      "Business process automation works in five steps: map how the work happens today, pick the steps worth automating, build a small version, test it on real cases, and measure the result. Most projects that fail skipped the first or the fourth step.",
      "This guide walks through each step in plain terms, with a hypothetical example of a small removals company handling quote requests. You do not need special software to follow it. A pen and a spreadsheet are enough for the first three steps.",
    ],
    sections: [
      {
        heading: "Step 1: map the process as it really runs",
        paragraphs: [
          "Write down what actually happens from the first trigger to the final result, not what should happen. Ask the person who does the work to walk you through it. Note each step, who does it, which tool they use, how long it takes and what goes wrong.",
          "For the removals company: a quote request arrives by email or form, someone reads it, checks the date in a diary, works out a price from a rate card, types a reply, sends it, and follows up if there is no answer. Seven steps, three tools, and some steps depend on one person's memory.",
        ],
      },
      {
        heading: "Step 2: pick what to automate",
        paragraphs: [
          "Not every step should be automated. Score each one on a few questions.",
        ],
        bullets: [
          "How often does it happen? More often means more time saved.",
          "How similar is each case? Repetitive steps are easier to automate.",
          "Are the rules clear? You should be able to explain them to a new starter.",
          "What happens if it goes wrong? Low-risk, reversible steps first.",
          "Does it touch customers or money? Keep a person in the loop there.",
        ],
      },
      {
        heading: "Step 3: design the future process on paper",
        paragraphs: [
          "Redraw the process with the automation in it. Mark which steps are automatic, which need approval and what happens to exceptions. Often you find a step you can remove altogether, which is better than automating it.",
          "In the example: the form captures all details upfront, the system checks the diary and applies the rate card to draft a price, the draft is sent to the owner for a one-click approval, and a follow-up goes out after three days if there is no reply. Anything with unusual items goes to the owner directly.",
        ],
      },
      {
        heading: "Step 4: build a small version",
        paragraphs: [
          "Build the simplest working version in the tools you already have, using a platform like Zapier, Make or n8n (compared in /guides/zapier-vs-make-vs-n8n). Use your own accounts, name the workflow clearly and set up an error alert from day one.",
          "Resist adding extras. A first version that handles the common case and passes the rest to a person is better than a complex one that tries everything.",
        ],
      },
      {
        heading: "Step 5: test on real cases",
        paragraphs: [
          "Run the workflow on at least twenty real past examples, including strange ones. Check every output. Then run it in parallel with the manual process for a week or two, so a person still does the work and you compare the results.",
        ],
        bullets: [
          "Missing information in the input.",
          "Duplicates, such as the same form sent twice.",
          "Unusual values, such as a very large order.",
          "Another language or odd formatting.",
          "A tool being down or a login expired.",
        ],
      },
      {
        heading: "Step 6: measure and improve",
        paragraphs: [
          "Decide your measures before launch: time per task, response time, errors caught, number needing a person. Compare with your notes from step 1. If you saved three hours a week and it costs a small monthly fee, you have a clear answer. Our payback method is in /guides/business-automation-cost.",
          "Review the logs every week for the first month, then monthly. Fix the rules, update documents and note changes. Automations drift as your business changes, so assign an owner.",
        ],
      },
      {
        "heading": "A worked example in numbers, and when not to automate",
        "paragraphs": [
          "Continue the removals example. Say the firm receives about 25 quote requests a week and each takes roughly 12 minutes to read, check the diary, work out a price and reply. That is 25 x 12 = 300 minutes, or 5 hours a week. After mapping, they decide to automate three steps: capturing details in a structured form, checking the diary and drafting the reply. The owner still approves each price with a one minute check.",
          "If the new process takes about 3 minutes per request, that is 25 x 3 = 75 minutes, so around 3.75 hours a week is saved. If the owner's time is worth a certain amount per hour, multiply and compare with the build and running costs. Use your own numbers, and be honest about the time spent on checking and fixing exceptions, because that is where hopeful estimates fall apart.",
          "Some processes should stay manual for now. Rare tasks, processes that change every week, work that depends on personal judgment or relationships, and anything where the rules are not agreed yet are poor candidates."
        ],
        "bullets": [
          "Process not agreed: settle the rules first, then automate.",
          "Fewer than a handful of runs a month: the build rarely pays back.",
          "High stakes and no way to undo: keep a person doing it, with software helping.",
          "Data is poor or scattered: clean it up first, or the automation spreads the mess.",
          "Nobody will own it afterwards: it will break and be ignored."
        ]
      },
      {
        heading: "Common mistakes",
        paragraphs: [
          "Automating a broken process just makes the mistakes faster, so fix the process first. Skipping exception handling leaves cases stuck without anyone knowing. Building in one person's personal account means the workflow disappears when they leave. And launching without a person checking early output is the quickest route to a customer-facing error.",
          "If you want help mapping and picking, the free automation audit at /contact covers exactly these steps, and /services/operations describes our process work.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is business process automation?",
        a: "It is using software to carry out repetitive steps in a business process, such as sending replies, moving data between tools or creating invoices, with people handling exceptions and decisions.",
      },
      {
        q: "How do I decide which process to automate?",
        a: "Choose one that is frequent, repetitive, rule-based and low risk if it goes wrong. Map it first, and fix or remove unnecessary steps before automating.",
      },
      {
        q: "How long does it take to automate a process?",
        a: "Simple workflows can be built in days, while more complex ones take weeks, mostly because of mapping, testing and handling exceptions rather than building.",
      },
      {
        q: "How do I measure the result of automation?",
        a: "Compare time per task, response times and error counts before and after, and weigh the saving against build and running costs.",
      },
    ],
    services: ["operations", "custom-build", "data-and-analytics"],
    category: "Automation & AI",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "data-entry-automation",
    title: "Data Entry Automation: Emails, PDFs and Forms",
    description:
      "How data entry automation works for emails, PDFs and web forms: capture, extract with AI or rules, validate, store, and keep a person checking the exceptions.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "data entry automation",
      "automate data entry",
      "pdf data extraction",
      "email to spreadsheet automation",
      "ocr and ai data extraction",
    ],
    intro: [
      "Data entry automation reads information from emails, PDFs and forms and puts it into the right system, such as a spreadsheet, CRM or accounting tool, without anyone retyping it. The reliable version always checks the data before saving and sends doubtful cases to a person.",
      "This guide covers the common sources, how extraction works, the checks that matter, and how to start with one document type. Accuracy depends on your documents, so test on your own samples and expect to tune the setup.",
    ],
    sections: [
      {
        heading: "Why manual data entry goes wrong",
        paragraphs: [
          "Retyping is slow, boring and error-prone. A transposed digit in an invoice number or a misspelled email address can cause problems that appear weeks later. People also skip fields when busy, so records end up incomplete.",
          "Automation does not remove errors by magic, but it makes them consistent and checkable. A rule that always rejects a missing postcode is better than a tired person who sometimes does.",
        ],
      },
      {
        heading: "Where the data comes from",
        paragraphs: [
          "Each source needs a slightly different approach.",
        ],
        bullets: [
          "Web forms. Already structured. Send them directly to your system through a connection, with no extraction needed.",
          "Emails. Semi-structured. Details are in the body or attachments. An AI step can pull out named fields from free text.",
          "PDFs and scans. Text-based PDFs can be read directly. Scans and photos need OCR (optical character recognition) first, and quality of the image matters.",
          "Spreadsheets. Often messy. Rules can clean and match columns before import.",
        ],
      },
      {
        heading: "How extraction works",
        paragraphs: [
          "There are three approaches, and many setups combine them. Rules and templates work when the layout never changes, such as a fixed export from one system. OCR turns images into text. AI models can read variable layouts, such as invoices from many suppliers, and return the fields you asked for as structured data.",
          "AI extraction is flexible but not perfect, so treat its output as a proposal. Ask for specific fields in a fixed format, and ask it to leave a field empty rather than guess.",
        ],
      },
      {
        heading: "Validation checks that catch errors",
        paragraphs: [
          "Checks are what make data entry automation trustworthy. Run them before anything is saved.",
        ],
        bullets: [
          "Required fields are present.",
          "Formats are valid: dates, emails, phone numbers, postcodes or zip codes.",
          "Totals add up: line items match the total, tax is plausible.",
          "No duplicates: the same invoice number or customer is not already stored.",
          "Values are in a sensible range, such as an amount far above normal.",
          "Matches known lists: supplier, product code or customer exists in your records.",
        ],
      },
      {
        heading: "Where the data goes and how people review it",
        paragraphs: [
          "Decide the destination first: a spreadsheet, a CRM, a database or your accounting tool. Map each extracted field to a destination field. Keep the original document attached to the record so anyone can check.",
          "Build a review queue for failures. When a check fails, the item goes to a list with the reason shown, for example total does not match line items. A person fixes it with the document beside them, and the corrected record is saved. This keeps humans on the unusual cases instead of every case. See /guides/invoice-automation-small-business for a worked finance example.",
        ],
      },
      {
        heading: "Privacy and security",
        paragraphs: [
          "Documents often contain personal or financial data. Send only what is needed to the extraction step, mask what you can, and check where your AI or OCR vendor processes and stores data. If you serve UK or EU customers, GDPR applies. This is not legal advice, so consult a professional. Our checklist is in /guides/gdpr-ai-automation.",
        ],
      },
      {
        "heading": "A worked example and common mistakes",
        "paragraphs": [
          "Say a small building supplies firm receives about 40 supplier delivery notes a week as PDFs by email. Today a staff member opens each one and types the supplier, date, reference and quantities into a stock sheet. The workflow replaces the typing. Emails to a dedicated address are picked up, the attachment is saved, and an AI step extracts the supplier, date, reference and line items as structured fields.",
          "Checks then run. Is the supplier in the known list? Is the reference new? Do the line quantities match a purchase order where one exists? Records that pass are added to the stock sheet with a link to the original PDF. Records that fail land in a review queue with the reason, such as reference already recorded, and a person fixes them in a minute or two. For the first month the firm also keeps entering a sample by hand and compares, to learn the real error rate before trusting the workflow.",
          "A short checklist for building your own version, in order:"
        ],
        "bullets": [
          "Collect 30 real samples, including the ugliest ones.",
          "List the exact fields you need and the format of each.",
          "Test extraction and record how often each field is wrong.",
          "Write one validation rule per kind of error you saw.",
          "Build the review queue before the happy path.",
          "Run in parallel with manual entry, then reduce checks gradually.",
          "Mistake to avoid: saving first and checking later, which leaves bad records in your system.",
          "Mistake to avoid: no link back to the source document, so nobody can verify a value."
        ]
      },
      {
        heading: "How to start",
        paragraphs: [
          "Pick one document type that you handle often, collect twenty to fifty samples, and test extraction on them. Record how many are right, how many need fixing and why. If accuracy is good enough with checks, build the workflow with a review queue and run it alongside manual entry for a few weeks.",
          "Add the next document type only when the first is stable. Related patterns are in /guides/email-inbox-automation, and if you want help with a first build, the free audit at /contact is a place to start.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is data entry automation?",
        a: "It is using software to capture data from sources like emails, PDFs and forms and enter it into your systems automatically, with checks and a person reviewing exceptions.",
      },
      {
        q: "How accurate is AI data extraction?",
        a: "It varies with document quality and layout. Test on your own samples, add validation checks and keep a review queue rather than assuming it is always right.",
      },
      {
        q: "Can I automate data entry from PDF invoices?",
        a: "Yes. Text PDFs can be read directly and scans need OCR. An AI step can extract supplier, date, number and totals, which you then check against your records.",
      },
      {
        q: "Do I still need a person to check the data?",
        a: "Yes, for exceptions. Routine matches can be saved automatically, while failed checks and unreadable documents should go to a person.",
      },
      {
        q: "Is it safe to send documents to an AI tool?",
        a: "It depends on the vendor and the data. Check where data is processed, how long it is kept and whether it trains models, and avoid sending more than you need.",
      },
    ],
    services: ["operations", "finance-and-hr", "data-and-analytics"],
    category: "Automation & AI",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "email-inbox-automation",
    title: "Email Inbox Automation for a Shared Business Inbox",
    description:
      "How to automate a shared business inbox: sort and label emails, draft replies for approval, route to the right person and send follow-ups with control.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "email inbox automation",
      "shared inbox automation",
      "automate email replies",
      "email triage ai",
      "ai email assistant for business",
    ],
    intro: [
      "Email inbox automation sorts incoming messages, labels them, routes them to the right person, drafts replies for approval and sends follow-ups on time. It will not clear your inbox on its own, but it removes the sorting and chasing that eat the day.",
      "This guide is for teams that share an inbox such as info@ or support@. It covers the building blocks, a sensible order to add them, the rules that keep it safe, and what to measure. Examples are hypothetical.",
    ],
    sections: [
      {
        heading: "What goes wrong in a shared inbox",
        paragraphs: [
          "In a shared inbox, everyone assumes someone else has replied. Urgent messages sit under newsletters. Two people answer the same email. Follow-ups are forgotten because nothing reminds anyone.",
          "Automation helps because the problems are mechanical: sorting, assigning and reminding. These are tasks a rule can do consistently. Writing the actual reply, especially when the situation is delicate, is where people stay involved.",
        ],
      },
      {
        heading: "Building block 1: sort and label",
        paragraphs: [
          "Start by classifying each incoming email. Simple rules cover obvious cases, such as sender domain, keywords or form notifications. An AI step can read free text and decide the type: new enquiry, existing customer question, invoice, complaint, supplier, spam.",
          "Apply a label or folder and, if useful, a priority. Keep the list of categories short, five to eight. If the AI is unsure, it should choose a label like needs review rather than guess.",
        ],
      },
      {
        heading: "Building block 2: route and assign",
        paragraphs: [
          "Once labelled, send each email to the right person or queue. Quote requests go to sales, invoices to finance, complaints to the manager.",
        ],
        bullets: [
          "Use a rotation so work is spread evenly.",
          "Add a notification by chat or text for urgent categories.",
          "Record the assignee in a shared sheet or helpdesk so nobody replies twice.",
          "Escalate to a manager if a message has no reply within your target time.",
        ],
      },
      {
        heading: "Building block 3: draft replies for approval",
        paragraphs: [
          "For common questions, an AI step can draft a reply using your FAQ, price list and the customer's history. The draft is saved in the email tool's drafts folder or posted to an approval channel. A person reads it, edits it if needed and sends.",
          "Keep this as approval-first. Do not let the system send replies on its own until you have reviewed a few hundred drafts and are confident. Tell the AI what it must not do: quote unlisted prices, promise dates or give legal advice. Our guidance on tool limits is in /guides/chatgpt-for-small-business.",
        ],
      },
      {
        heading: "Building block 4: follow-ups and reminders",
        paragraphs: [
          "Many sales and support messages need a nudge. A workflow can check threads where you sent the last message and the customer has not replied after a set number of days, then draft or send a short follow-up and create a task. It should stop when the customer replies or the deal is closed.",
          "Check the status right before each send so a customer who has just replied does not get a nudge. Timing and wording examples are in /guides/lead-follow-up-sequence.",
        ],
      },
      {
        heading: "Safety rules",
        paragraphs: [
          "Inboxes receive untrusted content, so set limits. Treat the text of every email as data, never as instructions to the AI. Give the automation the minimum access it needs. Avoid sending sensitive details, like card numbers or health information, to an AI step. Keep a log of what each email was labelled and what was done.",
          "If you handle EU or UK data, review /guides/gdpr-ai-automation. This is not legal advice.",
        ],
      },
      {
        "heading": "A worked example, step by step",
        "paragraphs": [
          "Say a four person physiotherapy and wellness clinic shares one info@ inbox. Messages are new patient enquiries, appointment changes, invoice questions, supplier mail and a lot of marketing. Reception checks it between patients, so replies are slow and sometimes duplicated.",
          "Here is a build that suits that clinic, in the order to do it. First, create five labels: new enquiry, appointment change, billing, supplier, other. Second, add simple rules for the obvious ones, such as known supplier domains and messages from the booking system. Third, add an AI step that reads the remaining messages and picks one label, or needs review if unsure. Fourth, route each label: new enquiries to the practice manager with a chat alert, appointment changes to reception, billing to the finance contact. Fifth, for new enquiries, draft a reply with opening hours, treatment information and a booking link, and save it as a draft rather than sending it.",
          "Sixth, add a reminder: if an email labelled new enquiry has no reply after four working hours, alert a second person. Seventh, review a sample of twenty labelled emails after the first week, and adjust the label rules. Eighth, only after two or three weeks of good drafts, consider auto-sending a simple acknowledgement."
        ],
        "bullets": [
          "Mistake: too many labels. Five to eight is plenty, and each should lead to a different action.",
          "Mistake: letting the AI archive or delete mail. Labelling is safe. Deleting is not.",
          "Mistake: no named owner for the automation, so failures are never noticed.",
          "Mistake: sending drafts that quote prices or dates the AI cannot know.",
          "Mistake: ignoring replies that arrive on old threads, so follow-ups fire at people who already answered.",
          "Decision rule: automate sorting and reminders first, drafting second, sending last."
        ]
      },
      {
        heading: "Measuring and improving",
        paragraphs: [
          "Track average first-response time, how many emails were mislabelled, how many drafts were sent unchanged, and how many were rewritten. Review a sample of labelled emails weekly at first and adjust categories and rules.",
          "If you want help setting this up, our free audit at /contact is a good starting point, and /services/customer-support covers support work.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can I automate my business email?",
        a: "Yes. You can automate sorting, labelling, routing, reminders and follow-ups, and use AI to draft replies that a person approves before sending.",
      },
      {
        q: "Should AI send email replies automatically?",
        a: "Start with approval-first drafts. Consider automatic replies only for simple, low-risk acknowledgements after careful testing.",
      },
      {
        q: "How do I stop two people replying to the same email?",
        a: "Assign each message to one person when it arrives and record that in a shared view, or use a helpdesk tool that shows ownership.",
      },
      {
        q: "Is it safe to let AI read my inbox?",
        a: "It can be, with limited access, approval for outward actions and logs. Treat email content as untrusted, and check the vendor's data handling terms.",
      },
      {
        q: "Which tools can automate a shared inbox?",
        a: "Your email provider's rules, a helpdesk, or an automation platform like Zapier, Make or n8n can all do parts of it. Check each tool's current features.",
      },
    ],
    services: ["customer-support", "operations", "sales-and-leads"],
    category: "Automation & AI",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "gdpr-ai-automation",
    title: "GDPR Checklist for AI and Automation Tools",
    description:
      "A plain GDPR and UK GDPR checklist for using AI and automation tools: lawful basis, processor agreements, data minimisation, data location and retention.",
    published: "2026-11-18",
    readMinutes: 6,
    keywords: [
      "gdpr ai automation",
      "gdpr checklist for ai tools",
      "uk gdpr ai",
      "is chatgpt gdpr compliant",
      "data processing agreement ai",
    ],
    intro: [
      "If you use AI or automation tools with personal data about people in the UK or EU, GDPR or UK GDPR applies to you. The practical checklist is short: have a lawful basis, sign a data processing agreement with each vendor, collect only what you need, know where data goes, and delete it on a schedule.",
      "This guide is a general checklist, not legal advice. Rules differ by country and situation, and regulators publish guidance that changes. Check with a qualified professional and the official regulator pages, such as the ICO in the UK, before relying on anything here.",
    ],
    sections: [
      {
        heading: "Why GDPR matters for automation and AI",
        paragraphs: [
          "An automation that moves customer details between tools, or an AI step that reads an email, is processing personal data. The law cares about what you do with that data, not how clever the tool is. Your business is usually the controller, and the tool vendor is a processor acting on your instructions.",
          "Small businesses are not exempt. The good news is that a few habits cover most of the risk. Treat the points below as a checklist to work through before each new tool or workflow goes live.",
        ],
      },
      {
        heading: "1. Know what personal data you use",
        paragraphs: [
          "List what the workflow touches: names, emails, phone numbers, addresses, order history, messages. Mark anything sensitive, such as health, biometric or financial details, since these get stricter treatment. Note where the data comes from and where it goes.",
          "A simple table with columns for data, source, tool, purpose and retention is enough. It also helps you answer customer questions later.",
        ],
      },
      {
        heading: "2. Have a lawful basis and be transparent",
        paragraphs: [
          "You need a lawful basis for each purpose, such as contract, legitimate interests or consent. Which fits depends on the case, and marketing has specific rules, so get advice for anything unclear.",
          "Tell people what you do. Your privacy notice should mention that you use service providers and, where relevant, automated tools or AI. If a decision is made solely by automated means and has legal or similarly significant effects on a person, extra rules apply, so keep a human in those decisions.",
        ],
      },
      {
        heading: "3. Sign data processing agreements",
        paragraphs: [
          "Each vendor that handles personal data for you should have a data processing agreement (DPA). Most major automation and AI vendors publish a standard DPA you can accept or sign. Find it in their legal or trust pages, and keep a copy.",
        ],
        bullets: [
          "Check whether the vendor uses your data to train its models, and whether you can opt out.",
          "Ask who its sub-processors are.",
          "Check how a data breach is reported to you.",
          "Business and API plans often have different data terms from free consumer plans, so read the current terms for the plan you use.",
        ],
      },
      {
        heading: "4. Minimise what you send",
        paragraphs: [
          "Send only the data needed for the task. If an AI step is classifying emails, it may not need the sender's full address history. Remove or mask names, numbers and identifiers where you can, and never send card numbers, passwords or special category data to a tool that is not designed for it.",
          "Minimisation lowers your risk and your exposure if something goes wrong. It also reduces what you have to disclose and delete later.",
        ],
      },
      {
        heading: "5. Check where data is processed",
        paragraphs: [
          "Ask each vendor where data is stored and processed. If personal data moves from the UK or EU to other countries, such as the US, a legal transfer mechanism must be in place. Many large vendors rely on approved routes, and some offer regional hosting options. Confirm what applies to your plan, and ask a professional if it is unclear.",
          "Self-hosting a tool on a server in your region can simplify this for the automation layer, but any AI provider you call still has its own processing location. See /guides/self-hosted-n8n-guide.",
        ],
      },
      {
        heading: "6. Set retention, access and security",
        paragraphs: [
          "Decide how long each type of data is kept and delete on schedule. Automation logs often store full message content, so set them to purge or avoid logging sensitive fields.",
        ],
        bullets: [
          "Use strong, unique passwords and two-factor authentication on every tool.",
          "Give each person and each connection the minimum access it needs.",
          "Remove access when staff leave.",
          "Keep a record of your tools, DPAs and workflows.",
          "Have a plan to respond to access and deletion requests, including data held in automation tools.",
        ],
      },
      {
        "heading": "A worked example: checking a new AI step before launch",
        "paragraphs": [
          "Say a small estate agency in Manchester wants an AI step that reads incoming viewing requests and drafts replies. The owner walks through the checklist before launch. Data used: name, email, phone number and the property they asked about. Nothing sensitive. Lawful basis: the person asked about a property, so replying is part of dealing with their request. Privacy notice: updated to say that service providers and automated tools help to process enquiries.",
          "Vendors: the automation platform and the AI provider each have a published DPA, which the owner accepts and saves. Data location: both vendors state where they process data and the owner records it, asking an adviser about transfers because one is outside the UK. Minimisation: the AI step receives the message text and property name only, not the full contact record. Retention: automation logs are set to delete after a short period, and the CRM follows the agency's existing retention policy. Finally, the owner writes a one page record listing the tools, purpose, data and who is responsible."
        ],
        "bullets": [
          "Mistake: assuming a free consumer account has the same data terms as a business plan.",
          "Mistake: leaving logs on forever. Automation tools often store full message bodies.",
          "Mistake: forgetting deletion requests. Know every place a person's data lives, including automation history.",
          "Mistake: sending full records to an AI step when two fields would do.",
          "Mistake: no process for staff leaving. Remove their access and rotate shared keys.",
          "Mistake: relying on this checklist alone. For anything high risk, take professional advice."
        ]
      },
      {
        heading: "7. Consider a risk assessment and get advice",
        paragraphs: [
          "For higher-risk uses, such as large-scale profiling, sensitive data or automated decisions about people, a data protection impact assessment may be required. A short assessment is good practice for any new AI use.",
          "Marketing messages have their own rules, for example PECR in the UK. See /guides/cold-email-deliverability for the basics. We are not lawyers, and this guide is not legal advice. If you would like help mapping your workflows and tools before you talk to an adviser, the free audit at /contact is a place to start.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does GDPR apply to AI tools?",
        a: "Yes, if you process personal data of people in the UK or EU with them. You need a lawful basis, transparency, a processor agreement with the vendor, data minimisation and sensible retention.",
      },
      {
        q: "Is ChatGPT GDPR compliant?",
        a: "Compliance depends on how you use a tool, not only the tool. Check the vendor's current terms, DPA, data location and training settings for your plan, and avoid sending personal data you do not need. Ask a professional if unsure.",
      },
      {
        q: "Do I need a data processing agreement with automation vendors?",
        a: "Usually yes, if the vendor processes personal data for you. Most publish a standard DPA, so find it, accept or sign it and keep a copy.",
      },
      {
        q: "Can I send customer data to US-based AI providers?",
        a: "It can be possible with a valid transfer mechanism and the right terms, but it depends on the vendor and the plan. Check current vendor documentation and take professional advice.",
      },
      {
        q: "Is this guide legal advice?",
        a: "No. It is a general checklist. Laws and guidance change, so consult a qualified adviser and the official regulator before making decisions.",
      },
    ],
    services: ["operations", "custom-build", "data-and-analytics"],
    category: "Automation & AI",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "self-hosted-n8n-guide",
    title: "Self-Hosted n8n Guide: Setup, Cost, Backups, Security",
    description:
      "What you need to self-host n8n: server, database, backups, updates and security, the rough cost factors and when n8n cloud is the better choice for your team.",
    published: "2026-11-18",
    readMinutes: 6,
    keywords: [
      "self hosted n8n",
      "n8n self hosting",
      "n8n docker setup",
      "n8n vs n8n cloud",
      "n8n backups",
    ],
    intro: [
      "Self-hosting n8n means running it on a server you control instead of using n8n's hosted service. It gives you control over data and can be cost-effective, but you take on updates, backups and security. If nobody will look after it, use the hosted version.",
      "This guide covers what you need, the main cost factors, backups, security, and how to decide between self-hosted and cloud. n8n's licence terms and pricing change, so check n8n's own site for current details before you commit.",
    ],
    sections: [
      {
        heading: "What you need to self-host n8n",
        paragraphs: [
          "The basics are a server, a way to run n8n, a database, a domain name with HTTPS and somewhere to keep backups. Most people use a small Linux virtual private server and run n8n with Docker, following the official documentation.",
          "For anything beyond testing, use a proper database such as PostgreSQL rather than the default file-based one, and put n8n behind a reverse proxy that handles HTTPS. Check n8n's current docs for supported setups and system requirements, because they change between versions.",
        ],
      },
      {
        heading: "Rough cost factors",
        paragraphs: [
          "Self-hosting is not free even if the software is. Think of the whole cost, not just the server rental.",
        ],
        bullets: [
          "Server hosting. A small virtual server is often cheap, but you may need more as workflows grow. Check provider pricing.",
          "Backup storage. A little extra for offsite copies.",
          "Domain and monitoring. Small recurring costs.",
          "Licence terms. Review n8n's current licence for commercial use and which features need a paid plan.",
          "Your time. Setup, updates and fixing problems. For a small business this is usually the largest cost.",
          "AI and API usage. These are billed by their own providers regardless of where n8n runs.",
        ],
      },
      {
        heading: "Backups you can actually restore",
        paragraphs: [
          "A backup you have never restored is a hope, not a backup. You need three things saved: the database, which holds workflows and credentials, your n8n encryption key, and your configuration files. Without the encryption key, saved credentials in a restored database will not work.",
          "Schedule automatic daily database dumps, copy them off the server, keep several days of history and test a restore on a spare machine at least once. Also export workflows as files and keep them in version control so you can see changes over time.",
        ],
      },
      {
        heading: "Security basics",
        paragraphs: [
          "A self-hosted instance holds the keys to your other systems, so treat it as sensitive.",
        ],
        bullets: [
          "Serve it over HTTPS only and keep the server's firewall tight, opening only what you need.",
          "Turn on user authentication and use strong passwords, with two-factor if available on your version.",
          "Keep the operating system, Docker and n8n updated, reading release notes first.",
          "Restrict webhooks and the editor to what must be public.",
          "Use the least-privilege credentials for each connection, and rotate keys when staff leave.",
          "Do not store secrets in workflow text. Use n8n's credential store.",
        ],
      },
      {
        heading: "Updates and monitoring",
        paragraphs: [
          "n8n releases updates often, some of them security fixes. Decide who applies them and how often. A sound routine is: back up, update on a test copy if possible, check that key workflows still run, then update production, and keep a way to roll back.",
          "Monitor the server's disk space and uptime, and add a heartbeat workflow that pings an external check service. If the heartbeat stops, you get an alert. A stopped n8n sends no error emails, so an outside check matters. Our broader view on error alerts is in /guides/n8n-automation-agency.",
        ],
      },
      {
        heading: "Data protection and location",
        paragraphs: [
          "Self-hosting lets you choose the region where workflow data and logs live, which can help with GDPR and UK GDPR. It does not change what your connected tools do. An AI provider or CRM you call from n8n still processes data on its own terms. Set execution data retention so logs do not keep personal data longer than you need. This is not legal advice. See /guides/gdpr-ai-automation.",
        ],
      },
      {
        "heading": "A worked example: a small agency decides",
        "paragraphs": [
          "Say a six person marketing agency in Amsterdam runs about a dozen workflows and handles client contact data. One team member is comfortable with Linux and Docker. They compare the two options on a page of paper, with four rows: data location, who maintains it, cost and speed of start.",
          "Self-hosting wins on data location, because they can pick an EU region for the server. It loses on maintenance, since one person becomes responsible for updates and backups, and on speed of start. They decide to self-host but plan for the single point of failure: a second person is trained on the restore process, a written runbook lists the update and rollback steps, and a monthly calendar reminder covers a test restore. If that team member left and nobody could take over, they agreed to move to the hosted service rather than leave an unmaintained server running."
        ],
        "bullets": [
          "Step 1: decide who is accountable for the server, in writing, with a deputy.",
          "Step 2: set up a database that is backed up separately from the n8n container.",
          "Step 3: store the encryption key somewhere safe and separate from the backups.",
          "Step 4: put HTTPS and authentication in place before connecting real accounts.",
          "Step 5: add a heartbeat workflow and an outside uptime check.",
          "Step 6: write the update and rollback steps, then practise them once.",
          "Mistake: running on a laptop or an unpatched server that nobody checks.",
          "Mistake: exposing the editor to the whole internet with weak passwords."
        ]
      },
      {
        heading: "When cloud is the better choice",
        paragraphs: [
          "Choose the hosted service when nobody on your team is comfortable with servers, when you need a quick start, or when the time spent maintaining a server would exceed the savings. It also suits teams that want n8n to handle updates and infrastructure.",
          "Choose self-hosting when you need data to stay on infrastructure you control, want fewer limits from plan tiers, or already run servers confidently. If you are unsure, start on the hosted service and move later, since workflows can be exported. If you want us to set up or run it for you, see /services/cloud-and-devops, or book the free audit at /contact.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is self-hosted n8n free?",
        a: "The software has a free self-hosted option under n8n's licence terms, but you pay for the server, backups and your time. Check n8n's current licence and pricing for commercial use and paid features.",
      },
      {
        q: "What do I need to self-host n8n?",
        a: "A server, usually Docker, a database such as PostgreSQL, a domain with HTTPS, backups and a way to monitor it. Follow n8n's official documentation for current requirements.",
      },
      {
        q: "How do I back up n8n?",
        a: "Back up the database, the encryption key and your configuration, copy them off the server and test a restore. Also export workflows as files.",
      },
      {
        q: "Is self-hosted n8n secure?",
        a: "It can be if you use HTTPS, authentication, a tight firewall, regular updates and least-privilege credentials. You are responsible for keeping it patched.",
      },
      {
        q: "Should I choose n8n cloud or self-hosting?",
        a: "Choose cloud if you do not want to manage a server. Choose self-hosting for data control and if you have the skills to maintain it.",
      },
    ],
    services: ["cloud-and-devops", "operations", "custom-build"],
    category: "Automation & AI",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "speed-to-lead",
    title: "Speed to Lead: Reply Fast and Automate the First Reply",
    description:
      "Why replying quickly to new leads matters, what to automate in the first reply, and how to set up an instant response that keeps a person in charge of the sale.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "speed to lead",
      "lead response time",
      "automate first reply to leads",
      "respond to leads fast",
      "instant lead response",
    ],
    intro: [
      "Speed to lead is how quickly you respond after a new enquiry arrives. Replying fast matters because the person is thinking about the problem right now and may be contacting your competitors too. You can automate the first reply so it goes out in minutes, while a person handles the real conversation.",
      "This guide explains why speed matters without relying on made-up figures, what the first reply should say, how to set it up, and what to avoid. The examples are hypothetical.",
    ],
    sections: [
      {
        heading: "Why speed matters",
        paragraphs: [
          "When someone fills in a form or messages a business, they are usually in the middle of a task: fixing a leak, planning an event, comparing suppliers. A quick reply fits into that moment. A reply the next afternoon finds them on to something else, or already talking to a business that answered.",
          "You do not need studies to see the logic. Think of your own behavior. If two firms are contacted and one answers in five minutes, that firm has the advantage of being first and of looking organised. Speed also shows reliability, which people read as a sign of how you will treat the job.",
        ],
      },
      {
        heading: "Where the delay really comes from",
        paragraphs: [
          "Slow replies are rarely laziness. They come from process gaps.",
        ],
        bullets: [
          "Leads arrive in several places: the website form, email, social messages, directories.",
          "Nobody is clearly responsible for checking.",
          "The team is on a job or in a meeting.",
          "Out-of-hours enquiries wait until morning.",
          "The first reply needs details someone has to look up.",
        ],
      },
      {
        heading: "What the first reply should do",
        paragraphs: [
          "The automated first reply is not the sale. It has three jobs: confirm you received the enquiry, set an expectation of what happens next, and ask one useful question or offer a booking link.",
          "Keep it short, in plain language, and from a real name or address. Avoid pretending a person typed it if they did not, and never promise things the automation cannot guarantee. An example: \"Hi Sam, thanks for getting in touch about the kitchen fitting. We have your details. Someone from our team will call you today before 5 pm. If you would like to choose a time yourself, here is our calendar link.\"",
        ],
      },
      {
        heading: "How to set up the automation",
        paragraphs: [
          "The structure is the same in most tools such as Zapier, Make or n8n.",
        ],
        bullets: [
          "Trigger: a new enquiry from any source arrives, collected into one place.",
          "Create or update the contact in your CRM and tag the source.",
          "Send the first reply by email or text, depending on the channel and consent.",
          "Alert the right person on their phone with the lead's details.",
          "Create a task with a deadline for a personal follow-up.",
          "If no one has claimed the lead after a set time, escalate to another person.",
        ],
      },
      {
        heading: "Consent and channel choice",
        paragraphs: [
          "Email replies to people who just contacted you are generally fine, but texting rules are stricter. In the US, marketing texts need prior consent under rules such as the TCPA, and in the UK and EU, PECR and GDPR apply. A reply to a customer's own enquiry is different from marketing, but get advice on your setup. This is not legal advice.",
          "Use the channel the lead used where you can. If they emailed, reply by email. Ask permission on your form if you plan to text. Our missed-call workflow is in /guides/missed-call-text-back-and-online-booking.",
        ],
      },
      {
        heading: "What to avoid",
        paragraphs: [
          "An instant reply that reads like spam hurts more than it helps. Do not send a long block of marketing text. Do not use a fake human name. Do not send several automatic messages in a row. And do not let automation replace the human follow-up, since the person's call or tailored message is what wins the work.",
          "Make sure it does not fire on spam and test submissions, and that your own team's addresses are excluded.",
        ],
      },
      {
        "heading": "A worked example and what to check",
        "paragraphs": [
          "Say a driveway paving company in Ohio gets enquiries from its website form, a directory listing and Facebook messages. Today they arrive in three places and the owner checks them in the evenings. The change: all three feed into one lead list. When a lead arrives, a text or email goes out within a few minutes saying who they are, what happens next and offering a calendar link for a site visit. The owner's phone gets an alert showing the lead's name, request and phone number.",
          "A task is created: call within the hour during working hours, or by 9 am for out-of-hours leads. If the task is still open after two hours, the lead goes to a second person. The owner also keeps a simple record: time the lead arrived, time of first contact, and whether it led to a visit. After a month, the average and the slowest cases show where the process leaks.",
          "Before switching it on, run through this list."
        ],
        "bullets": [
          "Test each source: form, directory email and social message all create a lead.",
          "Check that spam and your own test entries do not trigger a reply.",
          "Send a test message to yourself and read it on a phone.",
          "Confirm consent wording for texts on your form, where texts are used.",
          "Make sure the reply sounds like your business and includes your name and number.",
          "Set quiet hours so nobody is texted at midnight.",
          "Mistake: celebrating a fast automatic reply when no human follows up for days.",
          "Mistake: replying in different tones from different tools. Keep one voice."
        ]
      },
      {
        heading: "Measure your response time",
        paragraphs: [
          "Record the time a lead arrives and the time of the first human contact. Check the average and the slowest cases weekly. Set a team target you can honestly keep, such as a personal call within the hour during opening times.",
          "If you want help building an instant-reply workflow, the free audit at /contact is a good start. The follow-up that comes after is covered in /guides/lead-follow-up-sequence, and our service page is /services/sales-and-leads.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is speed to lead?",
        a: "It is the time between a new enquiry arriving and your first response. The shorter it is, the more likely you are to start the conversation before the person moves on.",
      },
      {
        q: "How fast should I reply to a new lead?",
        a: "As fast as you reliably can. An automatic acknowledgement within minutes and a personal reply within the same working day or hour is a sensible aim for most small businesses.",
      },
      {
        q: "Is an automated first reply a good idea?",
        a: "Yes, if it is short, honest about what happens next and followed by a person. It should not pretend to be human or make promises you cannot keep.",
      },
      {
        q: "Can I text new leads automatically?",
        a: "Texting has stricter consent rules than email, such as the TCPA in the US and PECR in the UK. Get consent on your form and take advice. This is not legal advice.",
      },
    ],
    services: ["sales-and-leads", "voice-and-calls", "operations"],
    category: "Sales & marketing",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "crm-automation-small-business",
    title: "CRM Automation for Small Business: 10 Workflows",
    description:
      "Ten CRM automation workflows for small businesses, from lead capture and follow-ups to deal handover and data cleanup, with what to check before you start.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "crm automation",
      "crm automation for small business",
      "crm workflow examples",
      "automate crm tasks",
      "sales automation workflows",
    ],
    intro: [
      "CRM automation means your customer relationship tool does routine jobs for you: creating contacts, assigning leads, sending reminders and nudging deals along. Here are ten workflows that fit most small businesses, with notes on how each works and what can go wrong.",
      "Whatever CRM you use, such as HubSpot, Pipedrive, Zoho or GoHighLevel, the ideas are the same. Features and limits differ by plan, so check your vendor's current documentation. For choosing a CRM, see /guides/choose-crm-small-business.",
    ],
    sections: [
      {
        heading: "Before you automate: tidy the basics",
        paragraphs: [
          "Automation multiplies whatever is already there. If your pipeline stages are vague and your data is messy, you will get messy results faster. Agree a short list of deal stages, decide what counts as a qualified lead and make sure each contact has an owner.",
          "Also decide what must stay manual, such as pricing decisions and sensitive conversations. Automation should handle the routine so people can focus on those.",
        ],
      },
      {
        heading: "Workflows 1 to 4: capture and respond",
        paragraphs: [
          "These get new leads in and acknowledged.",
        ],
        bullets: [
          "1. Lead capture. Every form, email enquiry or chat creates a contact and a deal, tagged with the source.",
          "2. Lead assignment. New leads go to an owner by area, service or rotation, and the owner gets an alert.",
          "3. Instant acknowledgement. The lead receives a short confirmation, see /guides/speed-to-lead.",
          "4. Duplicate check. Before creating a contact, the workflow searches by email and phone and merges or flags matches.",
        ],
      },
      {
        heading: "Workflows 5 to 7: keep deals moving",
        paragraphs: [
          "These stop deals from going quiet.",
        ],
        bullets: [
          "5. Follow-up tasks. When a quote is sent, a task is created for three days later to check in. Templates are in /guides/lead-follow-up-sequence.",
          "6. Stale deal alert. A deal with no activity for a set number of days notifies the owner and their manager.",
          "7. Stage-based actions. Moving a deal to a stage triggers the right next step, such as sending a booking link or creating a proposal task.",
        ],
      },
      {
        heading: "Workflows 8 to 10: after the sale and data care",
        paragraphs: [
          "These cover what happens once a deal closes and keep the CRM useful.",
        ],
        bullets: [
          "8. Won deal handover. A won deal creates a project or onboarding checklist, sends a welcome message and may create an invoice in your accounting tool.",
          "9. Review and referral request. A few days after the job is done, the customer gets a request for a review or referral, see /guides/get-more-google-reviews.",
          "10. Data cleanup. A scheduled check finds missing phone numbers or emails, inconsistent names and lost deals with no reason, and creates tasks to fix them.",
        ],
      },
      {
        heading: "Guardrails that protect your customers",
        paragraphs: [
          "Automation that talks to customers needs limits. Add a rule that stops messages once a customer replies or the deal changes status. Check consent before marketing emails or texts, since rules such as GDPR, PECR and the TCPA apply. This is not legal advice.",
          "Avoid sending several automated messages on the same day, and keep a way for a person to pause automation on a single contact.",
        ],
      },
      {
        heading: "How to roll it out",
        paragraphs: [
          "Start with one or two workflows, such as lead capture and follow-up tasks. Run them for two weeks and look at what the logs show. Fix errors, then add the next. Add alerts for failed runs and name an owner for each workflow.",
          "Most CRMs have built-in automation. If you need to connect other tools, an automation platform can help, compared in /guides/zapier-vs-make-vs-n8n.",
        ],
      },
      {
        "heading": "A worked example: setting up three workflows in a week",
        "paragraphs": [
          "Say a small solar installer in Texas uses Pipedrive, HubSpot or a similar CRM, and wants to fix missed follow-ups. Day one: agree the pipeline stages, for example new, contacted, survey booked, quote sent, won and lost, and define what qualifies as a stale deal, such as no activity for seven days. Day two: build lead capture, so every form submission creates a contact and a deal in the new stage, tagged with the source, and assigns it to the next person in a rotation. Day three: add the follow-up task rule, so when a deal moves to quote sent, a task appears for three days later called check in with customer.",
          "Day four: add the stale deal alert, which messages the owner each morning with a list of deals idle for seven days. Day five: test with ten dummy contacts, try odd cases such as a duplicate email and a deal moved backwards, and fix the results. In week two, review the run history and ask the team which automations helped and which annoyed them. Remove or adjust anything nobody uses.",
          "The same approach works whatever tool you use. Keep a one page list of every automation: what triggers it, what it changes, who owns it and when it was last reviewed. When someone asks why a customer got a message, that list is the first place to look, and it stops old automations from running unnoticed after the business changes. Here are the checks to run for every workflow you add."
        ],
        "bullets": [
          "Does it have one clear trigger and one clear outcome?",
          "What happens if the contact already exists?",
          "What happens if a required field is empty?",
          "Does it stop when the customer replies?",
          "Who is alerted when it fails?",
          "Can a person pause it for one contact?",
          "Mistake: automating before stages and ownership are agreed.",
          "Mistake: so many alerts that the team ignores all of them."
        ]
      },
      {
        heading: "What to measure",
        paragraphs: [
          "Track response time to new leads, the share of leads that get a follow-up, how long deals stay in each stage and how many deals are stale. These show whether the automation helps or just adds noise.",
          "If you want help picking and building these, the free audit at /contact is a place to start, and /services/sales-and-leads has more detail.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is CRM automation?",
        a: "It is setting your CRM to carry out routine tasks automatically, such as creating contacts, assigning leads, sending follow-up reminders and moving deals through stages.",
      },
      {
        q: "Which CRM automation should I set up first?",
        a: "Start with lead capture and an instant acknowledgement, then add follow-up tasks for quotes. These have clear value and low risk.",
      },
      {
        q: "Do I need a separate automation tool for my CRM?",
        a: "Not always. Most CRMs have built-in workflows. A platform like Zapier, Make or n8n helps when you need to connect other tools.",
      },
      {
        q: "Can CRM automation hurt customer relationships?",
        a: "It can if messages are too frequent, impersonal or keep going after a reply. Add stop rules, check consent and keep a person in charge of key conversations.",
      },
    ],
    services: ["sales-and-leads", "operations", "marketing"],
    category: "Sales & marketing",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "choose-crm-small-business",
    title: "How to Choose a CRM for a Small Business",
    description:
      "How to choose a CRM for a small business: the criteria that matter, how HubSpot, Pipedrive, Zoho and GoHighLevel differ in general, and a simple way to decide.",
    published: "2026-11-18",
    readMinutes: 6,
    keywords: [
      "choose a crm",
      "best crm for small business",
      "hubspot vs pipedrive",
      "zoho crm vs hubspot",
      "gohighlevel vs hubspot",
    ],
    intro: [
      "The best CRM for a small business is the one your team will actually use to track leads and follow up. Start with your sales process and budget, shortlist two or three tools, and test them with real data before you commit.",
      "This guide gives the criteria that matter, a general view of how HubSpot, Pipedrive, Zoho CRM and GoHighLevel tend to differ, and a simple decision method. We do not quote prices, because plans change often. Check each vendor's current pricing and features before deciding.",
    ],
    sections: [
      {
        heading: "Start with your process, not the tool",
        paragraphs: [
          "Write down how a lead becomes a customer in your business: where leads come from, who contacts them, what stages a deal goes through and what happens after the sale. A CRM is a way to record and automate that. If you do not know your process, no tool will fix it.",
          "Note how many people will use it, how many leads you handle each month, and what you already use for email, calendar, invoicing and forms. Integration with those matters more than a long feature list.",
        ],
      },
      {
        heading: "Criteria that matter",
        paragraphs: [
          "Score each candidate on these points.",
        ],
        bullets: [
          "Ease of use. If it takes ages to log a call, people will not log calls.",
          "Pipeline view. A clear stage-by-stage board for deals.",
          "Automation. Can it send follow-up reminders and assign leads without extra tools? See /guides/crm-automation-small-business.",
          "Integrations. Does it connect to your email, calendar, website forms and accounting tool, or via an automation platform?",
          "Email and calling. Built-in tracking, templates and click-to-call if you need them.",
          "Reporting. Simple views of pipeline, sources and conversion.",
          "Pricing model. Per user, per contact or bundled, and what costs extra. Check for add-ons and limits.",
          "Data ownership and export. You must be able to export your data.",
        ],
      },
      {
        heading: "How the four tools tend to differ",
        paragraphs: [
          "These are general impressions, and each product changes often, so verify against current documentation and a trial.",
          "HubSpot is known for an easy-to-use free tier and a broad suite covering marketing, sales and service, with costs that can rise as you add features and contacts. Pipedrive is built around a visual sales pipeline and is popular with small sales teams who want simplicity. Zoho CRM is a flexible option within a large family of business apps and often appeals to cost-conscious teams that want customisation, though setup can take more effort. GoHighLevel is aimed at agencies and service businesses, bundling funnels, messaging, calendars and automation, with more to learn at the start.",
        ],
      },
      {
        heading: "Think about the whole cost",
        paragraphs: [
          "The subscription is only part of the cost. Include setup time, importing data, training the team, any paid add-ons, extra users, messaging fees and the cost of connecting tools. A cheaper tool that nobody uses is the most expensive option.",
          "Also consider switching cost. The more automations and data you build in a CRM, the harder it is to leave, so choose one you can imagine using for a few years.",
        ],
      },
      {
        heading: "Run a proper trial",
        paragraphs: [
          "Use free trials on your shortlist, and test with your own data, not the demo. Import fifty real contacts, create a few deals, set up one automation and connect your email. Ask the person who will use it daily for feedback.",
          "Check support and documentation too. Try asking a question and see how quickly a real answer arrives.",
        ],
      },
      {
        heading: "Common mistakes",
        paragraphs: [
          "Buying for features you will not use is the most common mistake. Others are choosing on price alone, skipping data cleanup before import, not assigning an owner for the CRM, and building complex automations before the basics work.",
          "Do not choose based on someone else's recommendation without checking whether their business resembles yours. A company with a field sales team needs different things from an online service business.",
        ],
      },
      {
        "heading": "A worked example: a scoring table for two trades businesses",
        "paragraphs": [
          "Say a three person roofing firm in Kent compares two CRMs. They choose five criteria and weight them out of five: ease of use on a phone (5), follow-up reminders (5), integration with their email and calendar (4), pipeline view (3) and cost for three users (4). After a trial week with real enquiries, they score each tool out of five on each point, multiply by the weights and add up. The result is not magic, but it makes disagreements visible, and it often shows that the favourite was chosen on looks rather than on the jobs the team does daily.",
          "A different business, say an online coaching service in Toronto with leads from social media and email, would weight differently: marketing automation, landing pages and email sequences would rank higher and phone use lower. That is why a recommendation without context is not worth much.",
          "Use these decision rules when scores are close."
        ],
        "bullets": [
          "Choose the tool your least technical user finds easiest, since adoption beats features.",
          "Choose the tool that already connects to your email, calendar and accounting software.",
          "If you need marketing, forms and messaging in one place, look at all in one platforms. If you need a clean sales pipeline, look at pipeline focused tools.",
          "If you want deep customisation and have the time, look at flexible tools, and budget for setup.",
          "If you may add staff soon, check how pricing changes per user.",
          "Check export options before you sign up, so leaving is possible.",
          "Mistake: importing a messy spreadsheet as it is. Clean duplicates and fix columns first.",
          "Mistake: no training session. Fifteen minutes with the team on the three daily actions saves months of half use."
        ]
      },
      {
        heading: "A simple way to decide",
        paragraphs: [
          "Pick your top five criteria, score two or three tools from one to five on each after the trial, and choose the highest score that your team is happy with. Then set up one pipeline, three automations at most, and review after a month.",
          "If you want a neutral view on what fits your setup, the free audit at /contact covers it, and /services/sales-and-leads describes how we set up CRMs and follow-up. For the follow-up itself, see /guides/lead-follow-up-sequence.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the best CRM for a small business?",
        a: "There is no single best. The right one fits your sales process, team size, budget and existing tools, and your team will actually use it. Shortlist two or three and trial them.",
      },
      {
        q: "Is HubSpot or Pipedrive better for a small business?",
        a: "HubSpot offers a broad suite and a free starting tier, while Pipedrive focuses on a simple visual sales pipeline. Which is better depends on whether you need marketing and service tools or just sales tracking. Check current plans.",
      },
      {
        q: "Do I need a CRM if I have a spreadsheet?",
        a: "A spreadsheet works for very small volumes. A CRM becomes worth it when you miss follow-ups, several people handle leads or you want automation and reporting.",
      },
      {
        q: "How much does a CRM cost?",
        a: "It varies widely by vendor, plan and number of users, and prices change. Check each vendor's current pricing and ask about add-ons and limits.",
      },
      {
        q: "Can I switch CRMs later?",
        a: "Yes, but it takes effort. Make sure the tool lets you export contacts, deals and notes, and avoid over-building automations that are hard to move.",
      },
    ],
    services: ["sales-and-leads", "operations", "data-and-analytics"],
    category: "Sales & marketing",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "lead-follow-up-sequence",
    title: "Lead Follow-Up Sequence: Timing and Templates",
    description:
      "A practical lead follow-up sequence for small businesses: when to send each message, how long to keep going, and five short email and text templates to adapt.",
    published: "2026-11-18",
    readMinutes: 6,
    keywords: [
      "lead follow up sequence",
      "follow up email templates",
      "sales follow up timing",
      "how many times to follow up with a lead",
      "follow up text templates",
    ],
    intro: [
      "A good lead follow-up sequence is a short series of polite messages over about two weeks, mixing email, text and a call, that stops the moment the person replies. Most deals are lost to silence rather than a clear no, so a simple sequence recovers work you would otherwise forget.",
      "This guide gives a timing plan, five short templates you can adapt, the rules that keep it respectful and the legal basics to check. Adjust the timing to your sales cycle, since a bathroom fitter and an accountancy firm do not wait the same length of time.",
    ],
    sections: [
      {
        heading: "Principles of a follow-up that works",
        paragraphs: [
          "Be useful, not pushy. Each message should add something: an answer, a question, a helpful detail or an easy next step. Keep it short. Make replying easy, ideally with one question that can be answered in a word.",
          "Mix channels. Someone who ignores email may answer a text, and a quick call can settle what three emails could not. Always stop when they reply, book or say no.",
        ],
      },
      {
        heading: "A timing plan",
        paragraphs: [
          "This is a starting point for a quote or enquiry, not a rule.",
        ],
        bullets: [
          "Minutes: acknowledge the enquiry, see /guides/speed-to-lead.",
          "Day 1 to 2: personal reply or call with the answer or quote.",
          "Day 3: a short check-in by email.",
          "Day 5: a text or a call attempt, if you have consent.",
          "Day 8: an email adding something useful, such as an answer to a common question.",
          "Day 14: a polite closing message that leaves the door open.",
          "After that, stop, and move the lead to a long-term list only if they agreed to hear from you.",
        ],
      },
      {
        heading: "Template 1: the acknowledgement",
        paragraphs: [
          "\"Hi [Name], thanks for contacting [Business] about [service]. We have your details and will [call/email] you by [time]. If it is easier, you can pick a time here: [link].\"",
          "This confirms receipt, sets an expectation and gives a self-serve option. It can be automated safely.",
        ],
      },
      {
        heading: "Templates 2 and 3: the check-ins",
        paragraphs: [
          "Template 2, the day 3 email: \"Hi [Name], I wanted to check you received the quote for [job]. Happy to adjust it if anything does not fit. Is there anything I can clarify?\"",
          "Template 3, the day 5 text: \"Hi [Name], it is [Your name] from [Business]. Just checking you got my email about [job]. Any questions, reply here. Reply STOP to opt out.\" Only text people who have given consent, and include an opt-out where required.",
        ],
      },
      {
        heading: "Templates 4 and 5: the value add and the close",
        paragraphs: [
          "Template 4, the day 8 email: \"Hi [Name], people often ask us [common question], so here is a quick answer: [two sentences]. If you would like to go ahead or talk it through, reply with a good time and I will call.\"",
          "Template 5, the day 14 email: \"Hi [Name], I do not want to bother you, so this is my last note about [job]. If your plans change, just reply and we will pick it up. Thanks for considering us.\" The last note is often the one that gets an answer, because it makes replying low pressure.",
        ],
      },
      {
        heading: "Automating the sequence",
        paragraphs: [
          "Your CRM or an automation tool can send these on schedule. Build in the stop rules: the sequence ends when the lead replies, books, is marked won or lost, or unsubscribes. Check the status right before each send.",
          "Keep messages in plain text from a real person, create a task for the call step so a human makes it and log everything on the contact record. Related workflows are in /guides/crm-automation-small-business, and tools are compared in /guides/zapier-vs-make-vs-n8n.",
        ],
      },
      {
        "heading": "A worked example and how to adapt the timing",
        "paragraphs": [
          "Say a kitchen fitter in Leicester sends quotes after a home visit. On day one he sends the quote with a personal note. On day three the system emails template 2. If there is no reply by day five, it creates a task for him to ring, because a short call after a quote often settles questions that emails cannot. On day eight the value email goes out, using an answer to the question customers ask most, which is how long the work will take. On day fourteen the closing note is sent, and the deal moves to a nurture list only if the customer agreed to hear from him again.",
          "If the customer replies at any point, the sequence stops, a task is created, and a person answers personally. The system checks the deal status before each message, so a customer who accepted yesterday does not receive a nudge today.",
          "Adjust the timing to your sales cycle. A cleaning company quoting a one off job might compress everything into a week. A firm selling a large project to businesses might space messages weeks apart and run the sequence over two months. Use these questions to tune it."
        ],
        "bullets": [
          "How long does a customer usually take to decide? Spread touches across about that long.",
          "Is the value high and the decision considered? Fewer, more personal messages.",
          "Is it a quick, low cost purchase? Faster and shorter.",
          "Which channel do customers actually answer? Lean on that one.",
          "Mistake: identical wording on every message. Each one should add something new.",
          "Mistake: sending at odd hours. Send during the working day.",
          "Mistake: never reviewing results. Note which message gets replies and improve the others."
        ]
      },
      {
        heading: "Legal and respect basics",
        paragraphs: [
          "Replying to someone who contacted you about their enquiry is generally different from cold marketing, but rules still apply. In the US, the CAN-SPAM Act covers commercial email and the TCPA covers texts and calls. In the UK and EU, GDPR and PECR apply. Include your business identity and an easy opt-out, honor requests fast and keep records of consent. This is not legal advice, so check with a professional.",
          "A sequence is a courtesy, not a siege. If someone says no, thank them and stop. If you want help building one, our free audit at /contact is a good starting point, and /services/sales-and-leads explains our approach.",
        ],
      },
    ],
    faqs: [
      {
        q: "How many times should I follow up with a lead?",
        a: "For a typical enquiry, four to five touches over about two weeks across email, text and phone is a reasonable start. Adjust for your sales cycle and stop as soon as they reply or decline.",
      },
      {
        q: "When should I send the first follow-up?",
        a: "Acknowledge the enquiry within minutes, then follow up with a personal reply the same or next day, and send the first check-in about three days after a quote.",
      },
      {
        q: "Can I automate follow-up emails?",
        a: "Yes. Use your CRM or an automation platform, with stop rules for replies and bookings, plain text from a real person and a person making the calls.",
      },
      {
        q: "Do I need consent to text leads?",
        a: "Often yes. Rules like the TCPA in the US and PECR in the UK set conditions for texts. Get clear consent, include an opt-out and take advice. This is not legal advice.",
      },
    ],
    services: ["sales-and-leads", "marketing", "operations"],
    category: "Sales & marketing",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "cold-email-deliverability",
    title: "Cold Email Deliverability: SPF, DKIM, DMARC and More",
    description:
      "Cold email deliverability basics: set up SPF, DKIM and DMARC, warm up a domain, keep volumes sane, clean your list and know Gmail, Yahoo and CAN-SPAM rules.",
    published: "2026-11-18",
    readMinutes: 6,
    keywords: [
      "cold email deliverability",
      "spf dkim dmarc setup",
      "email warm up",
      "gmail yahoo bulk sender rules",
      "avoid spam folder cold email",
    ],
    intro: [
      "Cold email deliverability comes down to four things: authenticate your domain with SPF, DKIM and DMARC, send in small steady volumes, keep your list clean, and send messages people do not mark as spam. Skip any of them and your emails land in spam or are blocked.",
      "This guide explains each in plain language, covers the Gmail and Yahoo bulk-sender rules announced for 2024, and notes the legal basics for the US, UK and EU. Mailbox providers change their rules, so check their current documentation. Nothing here is legal advice.",
    ],
    sections: [
      {
        heading: "Authenticate your domain: SPF, DKIM, DMARC",
        paragraphs: [
          "These are three DNS records that prove an email really comes from your domain. Without them, mailbox providers trust you less.",
        ],
        bullets: [
          "SPF lists which servers may send email for your domain. Publish one SPF record that includes your email provider and any sending tools.",
          "DKIM adds a digital signature to each message. Your email provider gives you a key to publish in DNS and turns on signing.",
          "DMARC tells receivers what to do when SPF or DKIM fails and sends you reports. Start with a monitoring policy, then tighten it once reports look clean.",
          "Check your setup with free testers and your provider's docs, and fix any alignment issues between the visible From domain and the authenticated domain.",
        ],
      },
      {
        heading: "Gmail and Yahoo bulk-sender rules",
        paragraphs: [
          "In 2024, Google and Yahoo began requiring more from senders, especially those sending large volumes to their users. In general terms, they expect authentication with SPF and DKIM, a DMARC record, easy one-click unsubscribe on marketing mail, and low spam complaint rates. Google publishes a spam-rate threshold that you should keep well under, so read its current sender guidelines.",
          "Even if you send small volumes, following these practices is wise. Use Google Postmaster Tools to watch your domain's reputation if you send to Gmail users.",
        ],
      },
      {
        heading: "Use a separate sending domain and warm it up",
        paragraphs: [
          "Many senders use a separate domain for outreach, such as a variation of the main business name, so that any reputation damage does not hit the main domain that carries invoices and customer email. Set up its records and mailboxes properly and redirect its website to your main site.",
          "A new mailbox has no reputation. Warm it up by sending small numbers of genuine emails to real contacts and getting replies, raising volume gradually over weeks. Automated warm-up services exist, but their value is debated, and nothing replaces real, wanted mail.",
        ],
      },
      {
        heading: "Keep volumes sane",
        paragraphs: [
          "Sending a large blast from a fresh mailbox looks like spam. Keep daily volumes per mailbox modest and increase slowly. Spread across several mailboxes rather than pushing one hard. Vendors and providers set their own limits, so check them.",
          "Quality beats quantity. Fifty well-targeted emails to the right people beat five hundred vague ones. Track bounces, replies and complaints, and pause if they rise.",
        ],
      },
      {
        heading: "List hygiene",
        paragraphs: [
          "Bounced addresses hurt your reputation. Verify addresses before sending, remove invalid and role addresses that are unlikely to respond, and remove anyone who bounces or unsubscribes straight away.",
        ],
        bullets: [
          "Collect contacts from reliable sources and for a clear reason.",
          "Verify the list before the first send.",
          "Keep your bounce rate low and suppress hard bounces immediately.",
          "Honor unsubscribe requests quickly and keep a suppression list.",
          "Remove people who never engage after several attempts.",
        ],
      },
      {
        heading: "Write email that deserves a reply",
        paragraphs: [
          "Short, plain-text style emails addressed to a specific person tend to perform best. Explain why you are writing to them in particular, offer something relevant and ask a simple question. Avoid heavy images, many links, tracking-heavy templates and spammy phrases.",
          "Do not misrepresent who you are or what the message is about. That is both bad practice and, in many places, illegal. Link your follow-ups to a sensible schedule, as in /guides/lead-follow-up-sequence.",
        ],
      },
      {
        "heading": "A worked example: preparing a new outreach domain",
        "paragraphs": [
          "Say a small web agency in Dublin wants to email local businesses about website audits. Rather than risk its main domain, it registers a close variation, points the website to the main site and creates two mailboxes with real names. It publishes SPF that includes its email provider, switches on DKIM signing from the provider's admin settings, and adds a DMARC record in monitoring mode with an address for reports.",
          "It then checks the setup with a free email authentication tester, sends a test to personal Gmail and Outlook accounts and confirms the headers show SPF, DKIM and DMARC passing. For the first two weeks, each mailbox sends only a few genuine emails a day to people it knows or has a reason to contact, and receives replies. Volume rises gradually. The list is verified before use, each email is plain text, names a specific reason for writing and includes a business address and a simple way to opt out. Replies and bounces are checked daily, and sending pauses if bounces rise."
        ],
        "bullets": [
          "Mistake: more than one SPF record on a domain. Combine them into one.",
          "Mistake: buying a huge list. Poorly sourced lists bounce and generate complaints.",
          "Mistake: tracking links and heavy images in a first email. Keep it simple.",
          "Mistake: ignoring unsubscribes or replies saying stop. Act the same day.",
          "Mistake: sending the same message to everyone. Tailor the first line.",
          "Mistake: treating warm-up tools as a substitute for real, wanted mail.",
          "Decision rule: if you cannot explain why this person would want this email, do not send it."
        ]
      },
      {
        heading: "Legal basics: CAN-SPAM, PECR and GDPR",
        paragraphs: [
          "In the US, CAN-SPAM requires accurate sender information, a non-deceptive subject line, a physical postal address and a working opt-out honored promptly. It applies to commercial email, including B2B.",
          "In the UK, PECR rules differ for corporate subscribers (limited companies and similar) and individual subscribers (sole traders and some partnerships), so B2B cold email is not simply allowed everywhere. UK GDPR and EU GDPR also apply to the personal data in business email addresses, and national rules in EU countries vary. You need a lawful basis, a clear way to opt out and honest identification. This is not legal advice, so get it checked by a professional. See also /guides/gdpr-ai-automation.",
          "If you want help setting up authentication and outreach properly, the free audit at /contact is a good starting point, and /services/marketing covers outreach work.",
        ],
      },
    ],
    faqs: [
      {
        q: "What are SPF, DKIM and DMARC?",
        a: "They are DNS-based checks that prove your emails come from you. SPF lists permitted senders, DKIM signs messages, and DMARC sets what happens when checks fail and reports back to you.",
      },
      {
        q: "How long does email warm-up take?",
        a: "Usually several weeks of gradually increasing, genuine sending. There is no fixed number, so watch bounce and complaint rates and go slowly.",
      },
      {
        q: "What are the Gmail and Yahoo bulk sender rules?",
        a: "From 2024 they expect SPF and DKIM authentication, DMARC, one-click unsubscribe on marketing mail and low spam complaint rates. Read each provider's current guidelines for details.",
      },
      {
        q: "Is cold email legal?",
        a: "It depends on where you and your recipients are. CAN-SPAM in the US sets rules but does not require prior consent, while UK PECR and GDPR add stricter conditions, especially for individuals. Get professional advice.",
      },
      {
        q: "Should I use a separate domain for cold email?",
        a: "Many senders do, to protect the main domain's reputation. Set up authentication on it, and redirect its website to your main site.",
      },
    ],
    services: ["marketing", "sales-and-leads", "cloud-and-devops"],
    category: "Sales & marketing",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "get-more-google-reviews",
    title: "Get More Google Reviews: Ask, Link, Automate Safely",
    description:
      "How to get more Google reviews: when to ask, how to create a review link in your Google Business Profile, automate the request and what Google forbids.",
    published: "2026-11-18",
    readMinutes: 6,
    keywords: [
      "get more google reviews",
      "google review link",
      "how to ask for google reviews",
      "automate review requests",
      "google review policy",
    ],
    intro: [
      "The simplest way to get more Google reviews is to ask every happy customer, soon after the job, with a direct link that opens the review box in one tap. Automating that request makes it happen every time, as long as you follow Google's rules.",
      "This guide covers when and how to ask, how to find your review link in your Google Business Profile, a short message template, how to automate the ask and what Google does not allow. Google changes its policies, so check its current review guidelines.",
    ],
    sections: [
      {
        heading: "Why reviews matter",
        paragraphs: [
          "Reviews help people decide whether to contact you, and they are one of the signals that appear around local search results. A business with recent, detailed, genuine reviews looks more trustworthy than one with few or old ones.",
          "You do not need hundreds. A steady flow of honest reviews, a few every month, beats a burst followed by silence. Our wider local search checklist is in /guides/local-seo-checklist.",
        ],
      },
      {
        heading: "Get your Google review link",
        paragraphs: [
          "Sign in to your Google Business Profile, either through the Business Profile manager or by searching your business name while signed in. Look for the option to get or share a review link, often labelled Ask for reviews or Share review form. Copy the short link it gives you.",
          "Test it in a private window or on your phone to see that it opens the review box. Menus change, so follow Google's current help pages if the wording differs. Shorten or add a QR code for print use if you wish.",
        ],
      },
      {
        heading: "When and how to ask",
        paragraphs: [
          "Ask at the moment the customer is happiest: right after a finished job, a delivered order or a compliment. Ask personally if you can, then follow with a message containing the link.",
          "Keep the message short and make it easy. Here is a template: \"Hi [Name], thank you for choosing [Business]. If you were happy with the work, would you mind leaving a quick review? It takes under a minute and really helps a small business like ours: [link]\"",
        ],
        bullets: [
          "Ask everyone, not just the people you expect to be happy.",
          "Use the channel the customer prefers, email or text.",
          "Send one reminder at most, a few days later.",
          "Reply to every review, good or bad, politely and quickly.",
        ],
      },
      {
        heading: "Automate the ask",
        paragraphs: [
          "The trigger should be the moment a job is marked complete or an order is delivered. A workflow then waits a day, checks there is no open complaint on that customer, sends the message with your link and logs it. If there is no review after a few days, it may send one gentle reminder, then stop.",
          "Add a rule that excludes customers with an open support issue, and a way for staff to skip a particular customer. Check consent rules for texts and email in your region, such as GDPR, PECR or the TCPA. This is not legal advice. Related setup is in /guides/crm-automation-small-business.",
        ],
      },
      {
        heading: "What Google forbids",
        paragraphs: [
          "Google's policies for user-generated content are clear on several points. Check the current wording, but in general:",
        ],
        bullets: [
          "Do not offer incentives, such as discounts, gifts or entries into a draw, in exchange for reviews.",
          "Do not review gate: asking customers how it went and only sending the review link to those who are happy, while diverting unhappy ones elsewhere. Ask everyone the same way.",
          "Do not write fake reviews or ask others to, including staff and relatives who did not use the service.",
          "Do not post reviews of your own business or of competitors.",
          "Do not bulk-buy reviews. Google removes them and can penalise your profile.",
        ],
      },
      {
        heading: "Handling negative reviews",
        paragraphs: [
          "A bad review is not the end. Reply calmly, thank the person, acknowledge the issue without arguing and offer to resolve it offline. Future customers read how you respond as much as the complaint itself.",
          "If a review breaks Google's policy, for example it is spam or about a different business, you can flag it for removal, but disagreement alone is not a reason. Do not pressure customers to delete reviews.",
        ],
      },
      {
        "heading": "A worked example and common mistakes",
        "paragraphs": [
          "Say a family run garden maintenance firm in Surrey finishes about 30 jobs a month and has a handful of reviews. The owner copies the review link from the Google Business Profile, saves it on her phone and in the job sheet. When a job is marked complete, the workflow waits until the next morning, checks that the customer has no open complaint and sends a text: a short thank you with the link. If the customer has not reviewed after four days, a single reminder goes out by email. After that, nothing more is sent.",
          "At the end of each visit the team also says something simple, such as \"If you are happy with the work, we would really appreciate a review, you will get a link by text.\" The personal ask works better than the message alone, and the message makes it easy to act. Each Friday the owner reads the new reviews and replies to every one, thanking people by first name and mentioning the job in a sentence. When a three star review arrives complaining about a missed hedge corner, she replies politely, apologises and offers to return, then phones the customer to arrange it."
        ],
        "bullets": [
          "Mistake: asking only the customers you think are happy. That is review gating, and Google does not allow it.",
          "Mistake: offering a discount or gift in return. Incentives are not allowed.",
          "Mistake: asking staff or friends to write reviews. Google treats this as fake.",
          "Mistake: copy pasting the same reply to every review. Mention specifics.",
          "Mistake: texting without consent where the law requires it. Check the rules for your region.",
          "Mistake: sending the request weeks after the job. Ask while it is fresh.",
          "Decision rule: ask every customer, once personally, once by message, one reminder at most."
        ]
      },
      {
        heading: "A simple monthly routine",
        paragraphs: [
          "Each month, check how many requests went out, how many reviews arrived, and what themes appear in the text. Use the themes to improve the service and to write better website copy. Keep your profile details accurate, as covered in /guides/google-business-profile-optimization.",
          "If you want the request automated with the right safeguards, the free audit at /contact is a good start, and /services/marketing has details.",
        ],
      },
    ],
    faqs: [
      {
        q: "How do I get a Google review link?",
        a: "Sign in to your Google Business Profile and look for the option to ask for or share a review link. Copy it and test it. Google changes menus, so use its current help pages.",
      },
      {
        q: "Can I offer a discount for a Google review?",
        a: "No. Google does not allow incentives in exchange for reviews. Ask politely and let customers decide.",
      },
      {
        q: "What is review gating?",
        a: "It is filtering customers by satisfaction and only sending the review link to happy ones. Google's policies prohibit it, so send the same request to everyone.",
      },
      {
        q: "Can I automate review requests?",
        a: "Yes. Trigger a message when a job is completed, exclude customers with open issues, send one reminder at most and respect consent rules for email and text.",
      },
      {
        q: "How many Google reviews do I need?",
        a: "There is no set number. A steady flow of genuine, recent reviews with detail is better than a large number all at once.",
      },
    ],
    services: ["marketing", "seo", "sales-and-leads"],
    category: "Sales & marketing",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "social-media-automation-small-business",
    title: "Social Media Automation for Small Business",
    description:
      "How to automate social media for a small business: scheduling, content batching and repurposing, what to automate, what never to, and a simple weekly routine.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "social media automation",
      "social media scheduling tools",
      "social media automation for small business",
      "content batching",
      "automate social media posts",
    ],
    intro: [
      "Social media automation for a small business means scheduling posts in advance, batching content creation and repurposing what you already have. It should save time on logistics, not replace the human parts of social media, like replying to people.",
      "This guide covers what to automate, what not to, a batching routine, how AI can help and how to avoid common traps. Platform rules and tool features change, so check each platform's current policies and each tool's documentation.",
    ],
    sections: [
      {
        heading: "What is worth automating",
        paragraphs: [
          "Automate the mechanical steps: publishing at set times, collecting content ideas, reformatting a post for different platforms and reminding you to review comments. These tasks are repetitive and add no value when done by hand each day.",
          "Scheduling tools such as Buffer, Later, Hootsuite and the scheduling features inside Meta Business Suite let you queue posts. Check each tool's current features, platform support and limits.",
        ],
      },
      {
        heading: "Content batching",
        paragraphs: [
          "Batching means making a lot of content in one session and scheduling it. It is easier than coming up with something every day.",
        ],
        bullets: [
          "Pick one block a week or month for planning and creating.",
          "Start with three to five themes your customers care about, such as how-tos, behind the scenes, customer questions and results.",
          "Take photos and short videos in one visit: a day of work, a finished job, the team.",
          "Write captions in a document, then paste them into your scheduler.",
          "Leave a few gaps in the calendar for timely posts.",
        ],
      },
      {
        heading: "Repurpose what you already have",
        paragraphs: [
          "One piece of content can become several. A guide on your website can become a short post, a few tips as a carousel and a quote graphic. A customer question becomes a short video. A before and after photo becomes a case study post, with permission.",
          "A simple workflow can help: when you publish a new page or article, it adds a row in a spreadsheet with the link and prompts you to write the social versions. Related ideas are in /guides/workflow-automation-examples.",
        ],
      },
      {
        heading: "Using AI for social content",
        paragraphs: [
          "AI can suggest post ideas, rewrite a caption for different platforms and summarise a long article into key points. It tends to produce generic text, so give it your real details and edit the result until it sounds like you. Do not publish AI-written claims about results or prices without checking them.",
          "Be aware of platform rules on automated or inauthentic activity, and any disclosure requirements for AI-generated images in your region. See /guides/chatgpt-for-small-business for practical prompting.",
        ],
      },
      {
        heading: "What not to automate",
        paragraphs: [
          "Some parts of social media should stay human.",
        ],
        bullets: [
          "Replies to comments and messages. People can tell when a bot answers, and sensitive complaints need care.",
          "Mass following, liking or commenting. It breaks platform rules and risks your account.",
          "Auto-DMs to new followers that read like spam.",
          "Reacting to news or tragedy. A scheduled cheerful post at the wrong moment can hurt your reputation, so check the queue when big events happen.",
          "Buying fake followers or engagement.",
        ],
      },
      {
        heading: "A simple weekly routine",
        paragraphs: [
          "A routine that fits into a busy week: once a month, plan the themes and batch content. Once a week, check the schedule, add something timely and tidy captions. Daily, spend ten minutes answering comments and messages. Monthly, look at which posts got real responses and do more of that.",
          "Keep measures simple: reach, saves, replies and enquiries from social. If a platform sends no business, reduce effort there.",
        ],
      },
      {
        "heading": "A worked example: a one hour weekly system",
        "paragraphs": [
          "Say a bakery in Portland has one person handling social media between orders. She sets aside one hour on Monday. In the first 15 minutes she reviews last week: which posts got saves, replies or enquiries. In the next 25 minutes she writes captions for four posts using a simple pattern of three themes: a behind the scenes photo, a product of the week and a customer question answered. She uses an AI assistant to suggest alternative first lines and edits them to sound like her.",
          "In the following 15 minutes she picks photos she took earlier in the week, and in the last 5 minutes she loads everything into the scheduler for the next seven days. Every day she spends ten minutes replying to comments and messages by hand. When something unexpected happens, such as a sold out item or a local event, she posts live in the moment. The scheduled content is the baseline, and her presence is what makes the account feel real.",
          "The hour is deliberately small. A system that needs a full day a week will be dropped the first busy month, while one that takes an hour survives. If the hour is not enough, cut a platform or a post rather than extending the time. Keep a note of ideas during the week, such as customer questions or interesting jobs, so Monday starts with material instead of a blank page. To set up a similar system, work through these steps."
        ],
        "bullets": [
          "Choose the one or two platforms where your customers actually are.",
          "Write down three to five content themes.",
          "Create a shared sheet with columns for date, platform, caption, image and status.",
          "Choose a scheduler that supports those platforms and check its current limits.",
          "Set a weekly time to review the queue, and a daily time to reply to people.",
          "Keep a folder of approved photos, logos and short videos.",
          "Mistake: scheduling a month ahead and not checking it. Events change.",
          "Mistake: posting identical text on every platform. Adapt length and tone."
        ]
      },
      {
        heading: "Choosing tools and getting help",
        paragraphs: [
          "Choose a scheduler that supports the platforms you actually use and has a clear approval flow if more than one person posts. Check pricing and limits on each vendor's site. Keep the content calendar in a shared sheet so it survives a change of tool.",
          "If you would like help setting up a content system, see /services/content-and-social, or start with the free audit at /contact.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is it okay to schedule social media posts?",
        a: "Yes. Scheduling is allowed on the main platforms through their own tools or approved partners. Just keep an eye on the queue and still engage with people in real time.",
      },
      {
        q: "What social media tasks can I automate?",
        a: "Publishing at set times, reformatting for platforms, collecting ideas, reminders and reports. Replies, relationship building and sensitive topics should stay manual.",
      },
      {
        q: "Can I use AI to write social posts?",
        a: "Yes, as a first draft. Add your own details, check any claims and edit so it sounds like you.",
      },
      {
        q: "How often should a small business post?",
        a: "Consistency matters more than volume. Choose a pace you can keep, such as two to four posts a week, and increase only if it brings results.",
      },
    ],
    services: ["content-and-social", "marketing", "operations"],
    category: "Sales & marketing",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "email-marketing-automation",
    title: "Email Marketing Automation: Four Flows to Build",
    description:
      "Email marketing automation for small businesses: build welcome, nurture, win-back and post-purchase flows, with timing, content ideas, consent rules and checks.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "email marketing automation",
      "welcome email sequence",
      "win back email campaign",
      "post purchase email flow",
      "email automation for small business",
    ],
    intro: [
      "Email marketing automation sends the right message to the right person at the right moment based on what they did, such as signing up, buying or going quiet. Four flows cover most small businesses: welcome, nurture, post-purchase and win-back.",
      "This guide describes each flow, timing and content ideas, how to keep them legal and useful, and what to measure. Tools such as Mailchimp, Klaviyo, Brevo and HubSpot all support these flows, but features and pricing change, so check each vendor's current details.",
    ],
    sections: [
      {
        heading: "Start with permission and a clean list",
        paragraphs: [
          "Only email people who have agreed to hear from you, or who fall under a legitimate rule for your region. In the US, CAN-SPAM sets requirements for commercial email. In the UK and EU, PECR and GDPR generally expect clear consent for marketing to individuals. Record where and when each person signed up. This is not legal advice.",
          "Every email needs your identity, a working unsubscribe link and honored opt-outs. Remove hard bounces. A smaller, engaged list gets better results than a large unwilling one. See /guides/cold-email-deliverability for authentication basics.",
        ],
      },
      {
        heading: "Flow 1: the welcome series",
        paragraphs: [
          "The welcome series goes to new subscribers or customers and gets the highest attention you will ever have. Three to four emails over about a week work for many businesses.",
        ],
        bullets: [
          "Email 1 (immediately): thank them, deliver what was promised, such as a guide or discount, and say what to expect.",
          "Email 2 (day 2): who you are, and one useful tip or story.",
          "Email 3 (day 4): answer common questions or show how others use your service, with permission.",
          "Email 4 (day 7): a clear, low-pressure offer or next step.",
        ],
      },
      {
        heading: "Flow 2: nurture for people not ready to buy",
        paragraphs: [
          "Not every lead buys straight away. A nurture flow stays in touch with useful content until they are ready. Send helpful articles, answers to common questions and examples, spaced every week or two, with a clear way to contact you.",
          "Segment by interest. Someone who clicked on a pricing guide is in a different place from someone who read a how-to. Tags in your email tool let you send relevant follow-ups. Keep it light, and stop the flow when they buy or ask to be removed.",
        ],
      },
      {
        heading: "Flow 3: post-purchase",
        paragraphs: [
          "After a purchase or a job, customers are open to hearing from you. Use this flow to confirm, help and ask.",
        ],
        bullets: [
          "Day 0: thank you and what happens next.",
          "A few days later: tips for getting the most from the product or service.",
          "After the job is done: a request for a review, see /guides/get-more-google-reviews.",
          "Later: a gentle suggestion of a related product or a service reminder, such as an annual check.",
        ],
      },
      {
        heading: "Flow 4: win-back",
        paragraphs: [
          "Win-back emails reach customers or subscribers who have gone quiet. Define quiet for your business, such as no purchase in six months or no opens in ninety days. Send two or three emails: a friendly check-in, a reminder of what is new or an offer, and a last note asking if they still want to hear from you.",
          "If they do not respond, remove them from your list or move them to a suppressed segment. This protects your sender reputation and saves cost. Abandoned baskets are a related case, covered in /guides/abandoned-cart-recovery.",
        ],
      },
      {
        heading: "Make the flows work well",
        paragraphs: [
          "Write like a person: short subject lines that say what is inside, one main message per email and one clear call to action. Personalise with real data, such as first name or last purchase, and test the fallback if data is missing so nobody gets \"Hi ,\" in their inbox.",
          "Set exit rules so a person leaves a flow when they buy, reply or unsubscribe. Send a test of every email to yourself and view it on a phone. Limit overall frequency so one person is not in several flows at once.",
        ],
      },
      {
        "heading": "A worked example: a welcome flow for a small online shop",
        "paragraphs": [
          "Say a shop selling handmade candles in Edinburgh adds a signup form to its site, offering a small first order incentive in return for an email address, with a clear consent checkbox. The tool applies a tag for the signup source and starts the welcome flow. Email one arrives immediately with the incentive code and a line about what to expect, such as one email a week. Email two, two days later, tells the story of how the candles are made, with a photo of the workshop. Email three, four days later, answers common questions about burn time, shipping and gift options. Email four, a week after signup, reminds the subscriber the incentive is expiring and links to bestsellers.",
          "The flow exits automatically if the person buys, so they are not reminded after purchase. It also exits on unsubscribe. The owner sends a test of each email to herself and checks it on a phone, then reviews click rates and replies after a month. The email with the fewest clicks gets rewritten first."
        ],
        "bullets": [
          "Mistake: no clear exit rule, so buyers keep getting sales emails.",
          "Mistake: ignoring the first email. It has the highest attention, so make it count.",
          "Mistake: stacking flows. A person in three flows at once gets too many emails.",
          "Mistake: relying on open rates alone. Privacy features inflate or hide them.",
          "Mistake: all offers, no help. Mix useful content with promotion.",
          "Mistake: forgetting unsubscribe and address requirements.",
          "Decision rule: build welcome first, then post purchase, then win-back, and add nurture when you have content to share."
        ]
      },
      {
        heading: "What to measure",
        paragraphs: [
          "Look at opens loosely, since privacy features on some mail apps make open rates unreliable. Clicks, replies, purchases and unsubscribes are clearer signals. Review each flow monthly, improve the weakest email first and retire flows that do not help.",
          "If you want help setting these up, the free automation audit at /contact is a good place to start, and /services/marketing describes our work.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is email marketing automation?",
        a: "It is sending emails automatically based on triggers such as signing up, buying or going quiet, so each person gets a relevant message at the right time.",
      },
      {
        q: "Which email flows should I set up first?",
        a: "Start with a welcome series, then post-purchase and win-back. Add a nurture flow once you have content to share.",
      },
      {
        q: "Do I need consent to send marketing emails?",
        a: "Rules vary. CAN-SPAM in the US sets conditions without requiring prior consent, while UK and EU rules generally expect consent for individuals. This is not legal advice, so check with a professional.",
      },
      {
        q: "How many emails should a welcome series have?",
        a: "Three to four over about a week suits many businesses. Test and adjust based on clicks and unsubscribes.",
      },
      {
        q: "Which tool should I use for email automation?",
        a: "Choose one that fits your size and integrates with your shop or CRM. Mailchimp, Klaviyo, Brevo and HubSpot are common, but check current features and pricing.",
      },
    ],
    services: ["marketing", "e-commerce", "content-and-social"],
    category: "Sales & marketing",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "abandoned-cart-recovery",
    title: "Abandoned Cart Recovery for Shopify and WooCommerce",
    description:
      "How abandoned cart recovery works on Shopify and WooCommerce: email and SMS timing, what to say, consent rules, discounts and how to measure whether it pays.",
    published: "2026-11-18",
    readMinutes: 6,
    keywords: [
      "abandoned cart recovery",
      "abandoned cart emails",
      "shopify abandoned cart",
      "woocommerce abandoned cart",
      "abandoned cart sms",
    ],
    intro: [
      "Abandoned cart recovery sends a short series of emails, and sometimes texts, to shoppers who added items to a cart and left without paying. A well-timed reminder brings back some of them, and it costs little once set up.",
      "This guide covers how it works on Shopify and WooCommerce, the timing of each message, what to write, consent rules in the US, UK and EU, and how to check that it is paying for itself. Platform features and app pricing change, so check current documentation.",
    ],
    sections: [
      {
        heading: "Why people abandon carts",
        paragraphs: [
          "Shoppers leave for ordinary reasons: unexpected shipping costs, being distracted, comparing prices, wanting to think, a clumsy checkout or a payment problem. Many never intended to buy right then.",
          "A recovery message cannot fix every cause, but it catches the ones who were interrupted or undecided. Fixing the checkout itself, with clear shipping costs and fewer steps, often helps more than any email, so check both.",
        ],
      },
      {
        heading: "How it works on Shopify",
        paragraphs: [
          "Shopify can send abandoned checkout emails as part of its own features, and the details of what you can customise depend on your plan, so check Shopify's current help pages. Email marketing apps such as Klaviyo and others offer more control over timing, design and SMS.",
          "The tool needs to know the shopper's email or phone, which usually happens when they enter it at checkout. If they leave before giving it, no message can be sent, which is expected and appropriate.",
        ],
      },
      {
        heading: "How it works on WooCommerce",
        paragraphs: [
          "WooCommerce does not send abandoned cart emails by default, so you add a plugin or connect an email platform. Several plugins and services exist for this, and quality and pricing vary, so read reviews and current documentation and test on a staging site first.",
          "Make sure the plugin captures the email address early, such as at the checkout email field, and that it works with your caching and consent settings. Check how it handles personal data in your database.",
        ],
      },
      {
        heading: "Timing and content of the messages",
        paragraphs: [
          "A common pattern is two or three messages. Test timing for your own shoppers.",
        ],
        bullets: [
          "About one hour after abandonment: a helpful reminder showing the items, a clear button back to the cart and contact details for questions.",
          "About one day later: answer likely objections, such as delivery times, returns and sizing, and show a review or two.",
          "About three days later, optionally: a last reminder, and if you choose, a small incentive.",
          "Stop the sequence as soon as they buy, and do not send if they have bought the same item another way.",
        ],
      },
      {
        heading: "Writing messages that do not annoy",
        paragraphs: [
          "Keep it short and honest. A subject line such as \"You left something in your basket\" works fine. Show the product image, name and price. Do not invent urgency, such as fake countdowns or false stock claims.",
          "Be careful with discounts. If you always offer one, shoppers learn to abandon carts on purpose. Try a no-discount first message, and keep any offer for the last email or for higher-value carts. Related flows are in /guides/email-marketing-automation.",
        ],
      },
      {
        heading: "SMS and consent",
        paragraphs: [
          "Text messages can get attention, but the rules are stricter. In the US, marketing texts generally need clear prior consent under rules such as the TCPA, and carriers have their own requirements. In the UK and EU, PECR and GDPR govern electronic marketing, and consent is expected for most individuals.",
          "Use a clear opt-in at checkout that is not pre-ticked where rules require, say what the person is signing up for, include an easy opt-out in every message and keep records. Email also needs rules followed, such as CAN-SPAM. This is not legal advice, so check with a professional.",
        ],
      },
      {
        "heading": "A worked example and a setup checklist",
        "paragraphs": [
          "Say a store selling running gear on Shopify or WooCommerce has shoppers who enter their email at checkout and then leave. The owner sets up three messages. Message one goes out after about an hour: a plain note with the product photos, the items and the price, a button back to the cart and a line that says to reply with any questions. Message two goes out a day later and addresses the usual doubts, with free returns information and sizing guidance, plus two short customer reviews. Message three, three days after, mentions that the items are not reserved and, for carts above a set value, offers free shipping rather than a percentage discount.",
          "Before launching, the owner places a test order as a customer would, abandons it, and checks each email arrives with the correct items and links. She also checks that a completed purchase stops the sequence. After a month she compares recovered orders with the number of emails sent and the cost of the tool and any free shipping offers, and decides whether to keep the third message.",
          "Use this checklist when you set up your own."
        ],
        "bullets": [
          "Capture the email early in checkout, with a clear privacy line.",
          "Add a consent checkbox for marketing where the rules require it.",
          "Make sure the cart link restores the cart on mobile.",
          "Exclude customers who bought in the meantime.",
          "Exclude test orders and staff emails.",
          "Include your business name, address and a working unsubscribe link.",
          "Mistake: sending twelve emails because the tool allows it. Two or three is enough.",
          "Mistake: fake urgency that customers can see through."
        ]
      },
      {
        heading: "Measure whether it pays",
        paragraphs: [
          "Track how many recovery emails sent, how many led to completed orders and the revenue from them, then subtract any discounts given and the cost of the tool. Compare with a group that gets no message if you can, because some of those shoppers would have returned anyway.",
          "Review monthly, rewrite the weakest message and watch the unsubscribe and complaint rate. If it is rising, send fewer messages. For wider store automation, see /guides/shopify-automation-ideas. If you want help setting this up, the free audit at /contact is a good start, and /services/e-commerce describes our store work.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is abandoned cart recovery?",
        a: "It is sending reminders, usually by email and sometimes text, to shoppers who left items in their cart without buying, to encourage them to complete the order.",
      },
      {
        q: "When should I send an abandoned cart email?",
        a: "A common starting point is about an hour after abandonment, then another the next day, and optionally a third a few days later. Test what works for your shoppers.",
      },
      {
        q: "Does WooCommerce have abandoned cart emails built in?",
        a: "Not by default. You add a plugin or connect an email platform. Check current options, reviews and how they handle personal data.",
      },
      {
        q: "Do I need consent to send abandoned cart texts?",
        a: "Generally yes. Marketing texts need clear consent under rules such as the TCPA in the US and PECR and GDPR in the UK and EU. This is not legal advice.",
      },
      {
        q: "Should I offer a discount in abandoned cart emails?",
        a: "Be careful. Always offering a discount trains shoppers to abandon carts. Try a first message with no offer and keep any incentive for a later message or larger carts.",
      },
    ],
    services: ["e-commerce", "marketing", "operations"],
    category: "Sales & marketing",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "shopify-automation-ideas",
    title: "Shopify Automation Ideas: Flow and App Workflows",
    description:
      "Shopify automation ideas using Shopify Flow and apps: order tagging, stock alerts, fraud review, customer segments, fulfilment notices and reports.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "shopify automation",
      "shopify flow examples",
      "shopify flow automation ideas",
      "automate shopify orders",
      "shopify fraud review automation",
    ],
    intro: [
      "Shopify automation means setting your store to handle routine jobs, such as tagging orders, flagging risky ones, alerting you to low stock and tidying customer data. Shopify Flow and a range of apps cover most of it without code.",
      "This guide gives practical ideas grouped by area, explains where Shopify Flow fits, and lists the checks to run before switching anything on. Availability of Shopify Flow and its features depends on your plan and changes over time, so check Shopify's current documentation.",
    ],
    sections: [
      {
        heading: "What Shopify Flow is, and when apps fit better",
        paragraphs: [
          "Shopify Flow is Shopify's own automation tool. You build workflows from a trigger (such as a new order), conditions (such as order value above a set amount) and actions (such as adding a tag or sending an internal email). Check which plans include it and which connectors it supports.",
          "Apps fill the gaps: email and SMS marketing, reviews, inventory forecasting, shipping and returns. For links between Shopify and tools outside it, such as a CRM or accounting software, an automation platform can help, compared in /guides/zapier-vs-make-vs-n8n.",
        ],
      },
      {
        heading: "Order automations",
        paragraphs: [
          "These keep orders organised and reduce manual sorting.",
        ],
        bullets: [
          "Tag orders by type, such as preorder, international, gift or wholesale, so the team can filter them.",
          "Tag first-time and repeat customers and send repeat buyers a thank-you.",
          "Hold or flag orders that need a person, such as very large quantities or unusual shipping addresses.",
          "Notify staff in chat when a high-value order arrives.",
          "Send an internal alert when an order sits unfulfilled for more than a set number of days.",
        ],
      },
      {
        heading: "Stock and product automations",
        paragraphs: [
          "Running out of stock quietly loses sales, and overselling annoys customers.",
        ],
        bullets: [
          "Alert you or a supplier when inventory falls below a set level.",
          "Tag or hide products automatically when they sell out and republish when restocked.",
          "Flag products with missing images, weights or descriptions.",
          "Send a weekly list of slow-moving products for review.",
          "Create a draft purchase order spreadsheet row from low-stock items.",
        ],
      },
      {
        heading: "Fraud review without false alarms",
        paragraphs: [
          "Shopify provides its own fraud analysis on orders. Flow can use signals such as a high risk level, a mismatch between billing and shipping countries or a large first order to tag the order and notify a person before you ship.",
          "Keep a person in the decision. Rules can flag, but a human should decide whether to cancel, because false positives cost genuine customers. Do not automatically cancel on a single signal. Keep notes on what you learn, and check Shopify's current fraud features and payment provider guidance.",
        ],
      },
      {
        heading: "Customer and marketing automations",
        paragraphs: [
          "Segment customers using tags and spending, and connect those to your email flows. A customer who spent above a set amount can join a VIP segment. A customer who has not bought in six months can enter a win-back flow, see /guides/email-marketing-automation.",
          "Abandoned checkout recovery is a good early win, covered in /guides/abandoned-cart-recovery. Review requests after delivery help your reputation. Keep consent for email and SMS clear, since GDPR, PECR, CAN-SPAM and the TCPA apply depending on your customers. This is not legal advice.",
        ],
      },
      {
        heading: "Reporting and admin automations",
        paragraphs: [
          "A weekly summary sent to your inbox saves checking several dashboards: orders, revenue, refunds, top products and returns. Flow can send simple notices, and a reporting tool or spreadsheet connection can build fuller reports.",
          "Other admin tasks to automate include sending new orders to your accounting tool, tagging customers from certain countries for tax handling, and notifying the team when a product review is posted. For deeper reporting see /services/data-and-analytics.",
        ],
      },
      {
        "heading": "A worked example and common mistakes",
        "paragraphs": [
          "Say a store selling pet supplies ships about 60 orders a week, mostly from one person working in a spare room. They set up three small workflows. First, tag every order containing a liquid or oversize item so the packer sees it immediately. Second, alert the owner when stock on a bestseller falls below a set level, by message to their phone, with a link to reorder. Third, tag orders with a high risk analysis or a mismatched shipping country, hold fulfilment and send the owner a message with the order number so she can check by email or phone before shipping.",
          "After a week they read the run history. The risk tag fires a few times, mostly on genuine gift orders sent abroad. They adjust the rule so that only orders with a high risk level and a large order value are flagged, which cuts the noise. They leave customer facing actions for later, and they keep a short note listing each workflow, what it does and who owns it.",
          "A good order of work for a new store follows."
        ],
        "bullets": [
          "Week one: internal tagging and a daily summary of unfulfilled orders.",
          "Week two: low stock alerts and a simple fraud flag with human review.",
          "Week three: post delivery review request and abandoned checkout recovery.",
          "Week four: customer segments such as repeat buyers, and a win-back flow.",
          "Mistake: auto cancelling orders on a single risk signal.",
          "Mistake: workflows with no owner, which keep running after the business changes.",
          "Mistake: forgetting to test with real order shapes such as bundles, discounts and international addresses.",
          "Mistake: installing many apps that overlap. Each one adds cost, scripts and data sharing."
        ]
      },
      {
        heading: "Before you switch anything on",
        paragraphs: [
          "Test each workflow on a few orders, ideally in a development store or using test orders, and check the results. Start with internal actions, such as tagging and alerts, before anything customers see. Name each workflow clearly, note who owns it and review the run history monthly for failures.",
          "Avoid automations that cancel orders, refund or change prices without a person. If you want help planning your store workflows, the free audit at /contact is a place to start, and /services/e-commerce describes our work.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is Shopify Flow?",
        a: "Shopify Flow is Shopify's built-in automation tool that lets you set a trigger, conditions and actions to handle routine tasks such as tagging orders or sending alerts. Check current plan availability.",
      },
      {
        q: "Can I automate fraud checks in Shopify?",
        a: "You can use rules to flag or tag risky orders and alert a person, but a human should make the final decision to avoid cancelling genuine orders.",
      },
      {
        q: "Do I need an app for Shopify automation?",
        a: "Not always. Flow covers many internal tasks. Apps help with email, SMS, reviews, shipping and inventory, and an automation platform links Shopify to other tools.",
      },
      {
        q: "How do I automate low stock alerts?",
        a: "Set a workflow that triggers when inventory falls below a threshold and sends a message to you or your supplier, or adds a row to a reorder sheet.",
      },
    ],
    services: ["e-commerce", "operations", "marketing"],
    category: "Sales & marketing",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "google-ads-for-small-business",
    title: "Google Ads for Small Business: A Starter Plan",
    description:
      "A starter plan for Google Ads for small business: set goals, track conversions, build search campaigns, set a budget in general terms and avoid common mistakes.",
    published: "2026-11-18",
    readMinutes: 6,
    keywords: [
      "google ads for small business",
      "google ads beginner guide",
      "google ads conversion tracking",
      "google search ads setup",
      "google ads budget",
    ],
    intro: [
      "Google Ads lets you show your business to people searching for what you sell, and you pay when they click. For a small business, a simple starter plan is: pick one goal, set up conversion tracking, run a tight search campaign, start with a budget you can afford to learn from and review weekly.",
      "This guide covers each step in plain language and the mistakes that waste money. Google changes its interface, features and recommendations often, so use this as a plan and check Google's current help pages for exact steps.",
    ],
    sections: [
      {
        heading: "Step 1: decide what a win looks like",
        paragraphs: [
          "Choose one goal: phone calls, quote requests, bookings or online sales. Work out what a new customer is worth to you and how much you can afford to pay for one. Without those numbers you cannot tell whether the ads work.",
          "For example, say a Leeds heating engineer earns a certain margin on an average boiler service. If one in several enquiries turns into a booked job, that sets a rough ceiling for what an enquiry is worth. Do the sum with your own figures.",
        ],
      },
      {
        heading: "Step 2: set up conversion tracking first",
        paragraphs: [
          "Tracking tells Google and you what happens after the click. Without it you only see clicks, which prove nothing. Set up conversions for form submissions, calls from ads, click-to-call and bookings or purchases.",
          "Use Google's tag or Google Tag Manager, and test that a real form submission shows up as a conversion. In the UK and EU, your cookie consent setup affects what can be measured, so see /guides/cookie-consent-uk-eu. Track enquiries in your CRM too, since a form fill is not the same as a customer.",
        ],
      },
      {
        heading: "Step 3: start with search campaigns",
        paragraphs: [
          "Search ads show when someone types a query, so they match intent best for most small businesses. Start with one campaign and a few tightly themed ad groups, for example one for each main service.",
        ],
        bullets: [
          "Choose keywords that describe what people type when they are ready to buy, such as service plus location.",
          "Use match types carefully, and review the search terms report often.",
          "Add negative keywords for things you do not offer, such as jobs, free or DIY.",
          "Target your actual service area, not a whole country.",
          "Write ads that include the keyword, a clear benefit and a call to action.",
        ],
      },
      {
        heading: "Step 4: landing pages that match",
        paragraphs: [
          "Send people to a page about exactly what they searched for, not your home page. It should load fast on a phone, state the offer, show proof such as reviews and make the next step obvious, such as a call button or short form. Page principles are in /guides/landing-page-that-converts.",
          "Make sure your business details, hours and phone number are accurate, and use call extensions or assets so people can ring you directly.",
        ],
      },
      {
        heading: "Step 5: budget in general terms",
        paragraphs: [
          "There is no universal budget. Costs per click vary hugely by industry and location, so check Google's keyword planner for your terms. Start with an amount you can afford to lose while learning, run it long enough to collect meaningful data, and increase only when you see qualified enquiries at a cost you can accept.",
          "Be careful with automated bidding. It can work once you have conversion data, but with little data it can waste money. Set daily limits and check spend every few days at first.",
        ],
      },
      {
        heading: "Common mistakes",
        paragraphs: [
          "Most wasted spend comes from a handful of errors.",
        ],
        bullets: [
          "No conversion tracking, so you cannot tell what works.",
          "Targeting too broadly, in keywords or location.",
          "Never checking the search terms report or adding negatives.",
          "Sending traffic to the home page.",
          "Accepting every recommendation Google makes without thinking about your goal.",
          "Changing everything at once, so you cannot tell what helped.",
          "Not following up enquiries fast enough, see /guides/speed-to-lead.",
        ],
      },
      {
        "heading": "A worked example: a first month for a local plumber",
        "paragraphs": [
          "Say a plumbing company in Nottingham wants more boiler repair enquiries. The owner writes his goal as booked call outs, and decides that phone calls and form submissions count as conversions. Week one is setup: conversion tracking is installed and tested with a real form entry and a test call, the campaign is limited to postcodes the team serves, and a dedicated page for boiler repair is built with the phone number at the top, local reviews and a short form.",
          "He creates one search campaign with two ad groups, boiler repair and emergency plumber, using phrase and exact keywords, and adds negatives such as training, jobs, parts and DIY. He sets a daily limit he can live with and a schedule that matches when someone can answer the phone. Week two onward, he checks the search terms report every few days, adds negatives for irrelevant searches, pauses keywords with spend and no enquiries and notes the cost per enquiry. At the end of the month he asks how many enquiries became jobs, since a cheap enquiry that never books is not a win.",
          "Use this checklist for your own first campaign."
        ],
        "bullets": [
          "Conversion tracking tested with a real submission and a real call.",
          "Location limited to your service area, with the presence setting checked.",
          "One goal, one campaign, a few tight ad groups.",
          "Negative keywords added on day one and every week after.",
          "A landing page that matches the search and loads fast on a phone.",
          "A daily budget you can afford and a date to review.",
          "Mistake: expanding to display or broad match before the basics work.",
          "Mistake: judging results after two days. Wait for a few weeks of data."
        ]
      },
      {
        heading: "Review rhythm and when to get help",
        paragraphs: [
          "Weekly: look at spend, conversions, search terms and any disapproved ads. Monthly: compare cost per enquiry against your target, pause weak keywords and test new ad text. Quarterly: decide whether to scale up, hold or stop.",
          "Paid ads reward careful management. If you would rather have a specialist run it, see /services/paid-ads, or start with the free audit at /contact to check whether ads suit your business now.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much should a small business spend on Google Ads?",
        a: "It depends on your industry, location and goals. Start with an amount you can afford to learn from, track conversions and scale up only when the cost per enquiry makes sense.",
      },
      {
        q: "Do I need conversion tracking for Google Ads?",
        a: "Yes. Without it you only see clicks and cannot tell which ads bring enquiries or sales. Set it up before you spend.",
      },
      {
        q: "Should I use search or Performance Max campaigns?",
        a: "Many small businesses start with search campaigns for control and clear intent. Other campaign types can work later once you have conversion data. Check Google's current guidance.",
      },
      {
        q: "How long before Google Ads show results?",
        a: "Clicks start quickly, but it usually takes a few weeks of data to judge and improve a campaign. Avoid big changes too early.",
      },
      {
        q: "Can I run Google Ads myself?",
        a: "Yes, with care. Learn the basics, track conversions, review search terms often and set daily limits. Consider a specialist if spend is significant.",
      },
    ],
    services: ["paid-ads", "marketing", "seo"],
    category: "Sales & marketing",
  },
  // ---------------------------------------------------------------------------
  {
    slug: "meta-ads-for-local-business",
    title: "Meta Ads for Local Business: Facebook and Instagram",
    description:
      "How local businesses can use Facebook and Instagram ads: choose audiences, make creative that works, use lead forms and set up tracking, with common mistakes.",
    published: "2026-11-18",
    readMinutes: 5,
    keywords: [
      "meta ads for local business",
      "facebook ads for local business",
      "instagram ads for small business",
      "facebook lead ads",
      "meta pixel tracking",
    ],
    intro: [
      "Meta ads on Facebook and Instagram let a local business reach people nearby who may need its service, even if they are not searching for it. They work best with a clear offer, a tight local audience, simple creative and quick follow-up of every enquiry.",
      "This guide covers audiences, creative, lead forms, tracking and common mistakes. Meta changes its tools, policies and targeting options often, so check its current help pages for exact steps and restrictions, especially for sensitive categories.",
    ],
    sections: [
      {
        heading: "How Meta ads differ from Google ads",
        paragraphs: [
          "Google search ads catch people who are already looking. Meta ads interrupt people scrolling, so they are better for creating interest, filling a calendar for services people buy on impulse or by recommendation, and reminding people who visited you before.",
          "Both can work for a local business, and they often complement each other. If your customers actively search, start with /guides/google-ads-for-small-business. If your offer is visual or seasonal, Meta can do well.",
        ],
      },
      {
        heading: "Choose a clear goal and offer",
        paragraphs: [
          "Pick one goal: leads, calls, bookings or store visits. Make one clear offer, such as a free quote, a first appointment or a seasonal service. A vague \"visit us\" ad rarely works.",
          "Decide what a customer is worth and what you can pay for an enquiry before you start, so you can judge results. Keep the first campaign small and simple.",
        ],
      },
      {
        heading: "Audiences for a local business",
        paragraphs: [
          "Start with location. Target a radius or postcodes around your business where you actually serve customers. Meta's targeting options have become broader and more automated over time, and some detailed targeting options have been removed, so check what is available to you now.",
        ],
        bullets: [
          "Broad local audience: location and age range, letting Meta find likely responders.",
          "Custom audiences: your customer list or website visitors, subject to consent and Meta's rules.",
          "Lookalike or similar audiences built from your best customers, where available.",
          "Retargeting: people who engaged with your page or visited your site.",
          "Exclusions: existing customers, if the offer is for new ones.",
        ],
      },
      {
        heading: "Creative that works",
        paragraphs: [
          "Real photos and short videos of your work and team usually beat stock images. Show a result: a finished kitchen, a clean car, a happy client, with permission. Put the offer in the first line of text and make the call to action obvious.",
          "Make several versions, for example three images and two headlines, and let the results show what works. Vertical video for Reels and Stories needs its own format. Keep claims honest and check Meta's ad policies, which restrict some wording and categories.",
        ],
      },
      {
        heading: "Lead forms and landing pages",
        paragraphs: [
          "Meta lead forms keep people inside the app, which makes it easy to submit but can produce lower-intent leads. A landing page on your site asks for more effort and may filter better. Try both if you can.",
          "With lead forms, keep fields few, add a question that helps qualify, such as postcode or timeframe, and connect submissions to your CRM or email so they do not sit in Meta. Reply quickly, since people forget they filled it in. See /guides/speed-to-lead and /guides/lead-follow-up-sequence.",
        ],
      },
      {
        heading: "Tracking and privacy",
        paragraphs: [
          "Install the Meta pixel or use the Conversions API to record leads and purchases, and test that events appear. In the UK and EU, consent rules affect tracking, so link it to your cookie setup, see /guides/cookie-consent-uk-eu. Also track enquiries in your own CRM, since platform reports can differ from reality.",
          "Handle lead data carefully under GDPR or US state privacy laws. This is not legal advice.",
        ],
      },
      {
        "heading": "A worked example: a first campaign for a local salon",
        "paragraphs": [
          "Say a hair salon in Brighton wants more new colour clients. The owner chooses one offer, a free consultation for new clients, and one goal, booked consultations. She sets the audience to a radius around the salon and an age range that fits her clients, and excludes existing customers using her email list where consent allows. The creative is a short phone video of a real transformation, with permission from the client, plus two photos of recent work. The text starts with the offer and the neighbourhood, and the button is Book now or Send message.",
          "She connects the lead form to her booking inbox so requests arrive within seconds, and writes a reply template that offers two time slots. Every enquiry gets a reply within the hour during opening times. After two weeks she checks spend, number of leads and, most importantly, how many leads booked and showed up. She replaces the weakest creative, keeps the best and tries a new angle, such as a seasonal offer.",
          "Use this as a launch checklist."
        ],
        "bullets": [
          "One offer and one goal for the first campaign.",
          "Local radius or postcodes where you actually serve customers.",
          "Real photos or video, with permission from people shown.",
          "Pixel or Conversions API tested, with consent handled.",
          "Lead form or landing page connected to your CRM or inbox.",
          "A reply template and a person responsible for answering quickly.",
          "Mistake: boosting a post and calling it a campaign. Use a clear offer and goal.",
          "Mistake: ignoring ad policies on wording about health, finance or personal attributes."
        ]
      },
      {
        heading: "Common mistakes and a review rhythm",
        paragraphs: [
          "Common errors are broad geography, no tracking, boosting posts with no offer, changing the campaign every day and slow follow-up. Let a campaign run long enough to gather data before judging, and avoid reacting to a single day.",
          "Check weekly: spend, leads, cost per lead and, most important, how many leads became customers. Replace tired creative every few weeks. For help, see /services/paid-ads, or book the free audit at /contact.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do Facebook ads work for local businesses?",
        a: "They can, especially for visual or recommendation-based services, if you have a clear offer, tight local targeting, simple creative and fast follow-up. Track results to be sure.",
      },
      {
        q: "How do I target people near my business?",
        a: "Set your location to a radius or specific postcodes where you serve customers, then add age or other options. Check Meta's current targeting options, as they change.",
      },
      {
        q: "Are Facebook lead forms better than landing pages?",
        a: "Lead forms are easier to complete but may bring lower-quality leads, while landing pages ask for more effort and can filter better. Test both and compare how many become customers.",
      },
      {
        q: "Do I need the Meta pixel?",
        a: "Tracking helps Meta find more people like your converters and helps you measure results. Set it up with correct consent handling, and also track leads in your own CRM.",
      },
      {
        q: "How much should I spend on Meta ads?",
        a: "Start with an amount you can afford to learn from, run long enough to see patterns and scale only when the cost per customer works for you.",
      },
    ],
    services: ["paid-ads", "marketing", "content-and-social"],
    category: "Sales & marketing",
  },
];
