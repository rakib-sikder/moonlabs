/**
 * The site's photographs: paper-craft dioramas shot at night, one per topic.
 * Every picture is dark, so it always sits in its own dark frame; that way it reads
 * as a framed photo in the light theme and melts into the page in the dark one.
 * Inside a `group` link the picture eases forward on hover.
 */
const pictures = {
  "about-workshop": [1264, 848, "A paper workbench at night with a half-built machine of gears under a lamp"],
  "industry-real-estate": [1200, 896, "Three paper houses at night, one window lit, a key at its door"],
  "industry-healthcare": [1200, 896, "A paper clinic reception at night with one calendar square lit"],
  "industry-restaurants": [1200, 896, "A paper bistro table set for two under a warm lamp"],
  "industry-e-commerce": [1200, 896, "Paper parcels moving along a conveyor towards stacked shelves"],
  "industry-agencies": [1200, 896, "A paper bar chart rising in steps beside a rolled report"],
  "industry-law-firms": [1200, 896, "Paper balance scales beside a tidy stack of folders"],
  "industry-education": [1200, 896, "A paper school desk with an open book under a lamp"],
  "industry-logistics": [1200, 896, "A paper delivery van on a winding road marked with map pins"],
  "service-automation": [1200, 896, "A paper machine turning a messy pile of notes into a neat stack"],
  "service-development": [1200, 896, "A paper building under construction, a crane lowering the last panel"],
  "service-data-cloud": [1200, 896, "A paper filing cabinet with an open drawer and paper clouds above it"],
  "service-design": [1200, 896, "A fan of paper swatches, a pencil and a compass on a desk"],
  "service-growth": [1200, 896, "A paper staircase with a telescope at the top pointed at the moon"],
  "work-leadpilot": [1376, 768, "A paper lighthouse sweeping its beam over small paper boats"],
  "work-gmail-forwarding": [1376, 768, "Ten paper mailboxes feeding into one lit mailbox"],
  "work-browser-profiles": [1376, 768, "A row of separate paper booths, light spilling from open doors"],
  "guide-whatsapp-automation-for-business-bangladesh": [1376, 768, "A paper shop counter with speech bubbles hanging above it"],
  "guide-small-business-automation-ideas": [1376, 768, "A paper cabinet of small drawers, a few open and glowing"],
  "guide-missed-call-text-back-and-online-booking": [1376, 768, "A paper telephone off the hook beside a small calendar"],
  "guide-website-audit-checklist-small-business": [1376, 768, "A paper magnifying glass over a page with a column of squares"],
  "guide-business-automation-cost": [1376, 768, "A paper receipt unrolling under five rising stacks of coins"],
  "guide-zapier-vs-make-vs-n8n": [1376, 768, "Four differently shaped paper keys on hooks above four padlocks, one key amber"],
  "process-path": [1584, 672, "Five paper objects along a lamp-lit path: a magnifier, a blueprint, a workbench, a rocket and a globe"],
  "contact-desk": [1376, 768, "Two paper armchairs facing each other across a low table under a floor lamp"],
  "not-found": [1200, 896, "A single paper note lying on the floor, far from a lit desk"],
  "svc-sales-and-leads": [1200, 896, "A paper magnet drawing a trail of small cards towards a card box"],
  "svc-marketing": [1200, 896, "A paper megaphone on a tripod with a burst of small paper triangles flying from it"],
  "svc-customer-support": [1200, 896, "A paper headset on a stand beside a tidy stack of ticket stubs"],
  "svc-voice-and-calls": [1200, 896, "A paper telephone switchboard with cords plugged across it, one of them amber"],
  "svc-operations": [1200, 896, "A paper railway yard where five tracks merge into one beside a lit signal"],
  "svc-finance-and-hr": [1200, 896, "A paper abacus with one amber row of beads, beside a ledger and stacks of coins"],
  "svc-e-commerce": [1200, 896, "A paper shop counter with a cash register and a row of shopping bags"],
  "svc-custom-build": [1200, 896, "An open paper toolbox with tools laid out around one unusual machine part"],
  "svc-web-development": [1200, 896, "An open pop-up book with a small street of paper shopfronts rising from its pages"],
  "svc-app-development": [1200, 896, "Two upright paper frames being filled with small blocks like a puzzle"],
  "svc-web-apps-and-saas": [1200, 896, "A paper control desk of levers and switches with one amber lever"],
  "svc-database-management": [1200, 896, "A paper bookcase of identical books with a ladder, one amber book pulled out"],
  "svc-data-and-analytics": [1200, 896, "A paper strip folded into a rising zigzag line beside a round gauge"],
  "svc-cloud-and-devops": [1200, 896, "Three tall paper towers punched with holes, the middle one glowing, small clouds around them"],
  "svc-ui-ux-design": [1200, 896, "A paper pinboard of blank cards joined by threads, one card amber"],
  "svc-branding": [1200, 896, "A paper stamp and ink pad above a row of matching envelope, card, tag and sheet"],
  "svc-seo": [1200, 896, "A paper signpost at a crossroads, its amber arrow pointing to a lit shop"],
  "svc-paid-ads": [1200, 896, "A paper roadside billboard lit by three small spotlights, a car parked below"],
  "svc-content-and-social": [1200, 896, "A paper typewriter with paper aeroplanes rising from its page"],
  "page-services": [1200, 896, "A paper pegboard of twelve tools, with one amber key waiting on the shelf below"],
  "page-industries": [1200, 896, "A paper high street of small buildings: a house, a shop, a clinic, a cafe, a school and a warehouse"],
  "page-work": [1200, 896, "Three small paper machines displayed on plinths under a lamp"],
  "page-guides": [1200, 896, "A half-unfolded paper map with a dashed route, a compass and a pencil"],
  "page-pricing": [1200, 896, "Three paper moons on stands: a crescent, an amber half moon and a full moon"],
  "page-faq": [1200, 896, "A paper suggestion box with notes in its slot beside a stack of answered notes"],
  "page-integrations": [1200, 896, "A ring of paper jigsaw pieces with the last amber piece about to drop in"],
  "page-security": [1200, 896, "A round paper vault door with light glowing through its keyhole"],
  "page-roi-calculator": [1200, 896, "A paper hourglass beside an adding machine with a long curling receipt"],
} as const;

export type Picture = keyof typeof pictures;

export const hasPicture = (name: string): name is Picture => name in pictures;

/** The picture with this name, if there is one. For names built from a slug. */
export const pictureFor = (name: string): Picture | undefined => (hasPicture(name) ? name : undefined);

export function Diorama({
  name,
  ratio,
  className = "",
  eager = false,
  decorative = false,
}: {
  name: Picture;
  /** CSS aspect-ratio for the frame, e.g. "16 / 9". Defaults to the picture's own shape; null leaves it to classes. */
  ratio?: string | null;
  className?: string;
  /** Load straight away: for pictures visible when the page opens. */
  eager?: boolean;
  /** Hide from screen readers when the text beside it already says the same thing. */
  decorative?: boolean;
}) {
  const [w, h, alt] = pictures[name];
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-border bg-[#0b0c0f] ${className}`}
      style={ratio === null ? undefined : { aspectRatio: ratio ?? `${w} / ${h}` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- images are served as-is on Cloudflare (see next.config.ts) */}
      <img
        src={`/images/${name}.webp`}
        alt={decorative ? "" : alt}
        width={w}
        height={h}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
    </div>
  );
}
