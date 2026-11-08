// One icon per service, sector and industry, so lists read at a glance.
import {
  AppWindow,
  Blocks,
  BookOpen,
  Briefcase,
  Building2,
  ChartColumn,
  Cloud,
  Database,
  Globe,
  GraduationCap,
  Headset,
  Megaphone,
  MousePointerClick,
  Newspaper,
  Palette,
  PenTool,
  PhoneCall,
  Scale,
  Search,
  Settings2,
  ShoppingCart,
  Smartphone,
  Stethoscope,
  Target,
  Truck,
  UtensilsCrossed,
  Wallet,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId } from "./site";

export const serviceIcons: Record<string, LucideIcon> = {
  "sales-and-leads": Target,
  marketing: Megaphone,
  "customer-support": Headset,
  "voice-and-calls": PhoneCall,
  operations: Settings2,
  "finance-and-hr": Wallet,
  "e-commerce": ShoppingCart,
  "custom-build": Wrench,
  "web-development": Globe,
  "app-development": Smartphone,
  "web-apps-and-saas": AppWindow,
  "database-management": Database,
  "data-and-analytics": ChartColumn,
  "cloud-and-devops": Cloud,
  "ui-ux-design": PenTool,
  branding: Palette,
  seo: Search,
  "paid-ads": MousePointerClick,
  "content-and-social": Newspaper,
};

export const categoryIcons: Record<CategoryId, LucideIcon> = {
  automation: Workflow,
  development: Blocks,
  "data-cloud": Database,
  design: PenTool,
  growth: ChartColumn,
};

export const industryIcons: Record<string, LucideIcon> = {
  "real-estate": Building2,
  healthcare: Stethoscope,
  restaurants: UtensilsCrossed,
  "e-commerce": ShoppingCart,
  agencies: Briefcase,
  "law-firms": Scale,
  education: GraduationCap,
  logistics: Truck,
};

export const fallbackIcon = BookOpen;
