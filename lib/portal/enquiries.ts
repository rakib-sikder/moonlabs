// Website contact-form enquiries (table `enquiries`, migration 0002). Staff only.
export const ENQUIRY_STATUSES = ["new", "contacted", "won", "lost", "spam"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  services: string | null;
  budget: string | null;
  timeline: string | null;
  message: string;
  status: EnquiryStatus;
  notified: number;
  created_at: string;
};

export const enquiryTone: Record<EnquiryStatus, "ok" | "warn" | "bad" | "info" | "neutral"> = {
  new: "info",
  contacted: "warn",
  won: "ok",
  lost: "neutral",
  spam: "bad",
};
