// Small stroke icons for the portal (16px, currentColor).

type IconProps = { className?: string };

function Svg({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className ?? "h-4 w-4"}
    >
      {children}
    </svg>
  );
}

export const IconOverview = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2" y="2" width="5" height="5" rx="1" />
    <rect x="9" y="2" width="5" height="5" rx="1" />
    <rect x="2" y="9" width="5" height="5" rx="1" />
    <rect x="9" y="9" width="5" height="5" rx="1" />
  </Svg>
);
export const IconProjects = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2 4.5h12M2 8h8M2 11.5h5" />
  </Svg>
);
export const IconAutomations = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 1.8 3.5 9H8l-1 5.2L12.5 7H8z" />
  </Svg>
);
export const IconRequests = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2z" />
  </Svg>
);
export const IconFiles = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 1.8h5l3 3V14H4z" />
    <path d="M9 1.8v3h3" />
  </Svg>
);
export const IconBilling = (p: IconProps) => (
  <Svg {...p}>
    <rect x="1.8" y="3.5" width="12.4" height="9" rx="1.5" />
    <path d="M1.8 6.5h12.4" />
  </Svg>
);
export const IconAdmin = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 1.8 13 4v4c0 3-2.2 5.2-5 6.2C5.2 13.2 3 11 3 8V4z" />
  </Svg>
);
export const IconMenu = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" />
  </Svg>
);
export const IconClose = (p: IconProps) => (
  <Svg {...p}>
    <path d="m4 4 8 8M12 4l-8 8" />
  </Svg>
);
export const IconChevron = (p: IconProps) => (
  <Svg {...p}>
    <path d="m4.5 6.5 3.5 3.5 3.5-3.5" />
  </Svg>
);
export const IconArrowLeft = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12.5 8h-9M7 4.5 3.5 8 7 11.5" />
  </Svg>
);
export const IconDownload = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 2.5v8M4.8 7.5 8 10.7l3.2-3.2M3 13.5h10" />
  </Svg>
);
export const IconExternal = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9.5 2.5h4v4M13.5 2.5 7.5 8.5M12 9.5v4H2.5V4h4" />
  </Svg>
);
export const IconCheck = (p: IconProps) => (
  <Svg {...p}>
    <path d="m3.5 8.5 3 3 6-7" />
  </Svg>
);
export const IconPlus = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 3v10M3 8h10" />
  </Svg>
);
