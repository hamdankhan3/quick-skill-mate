import { Wrench, Zap, Droplets, Wind, Paintbrush, SprayCan, Car, HardHat, LucideIcon } from "lucide-react";

export type CategorySlug =
  | "electrician"
  | "plumber"
  | "mechanic"
  | "ac_technician"
  | "painter"
  | "cleaner"
  | "handyman"
  | "construction";

export interface CategoryInfo {
  slug: CategorySlug;
  name: string;
  icon: LucideIcon;
  color: string;
  tagline: string;
  description: string;
  commonJobs: string[];
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: "electrician",
    name: "Electrician",
    icon: Zap,
    color: "text-yellow-500",
    tagline: "Licensed electricians for safe, reliable wiring & repairs.",
    description:
      "From flickering lights to full rewiring, hire trusted electricians to handle any electrical job at home or work.",
    commonJobs: ["Wiring & rewiring", "Switch & socket installation", "Light fixtures", "Fault diagnosis", "Fan installation"],
  },
  {
    slug: "plumber",
    name: "Plumber",
    icon: Droplets,
    color: "text-blue-500",
    tagline: "Fix leaks, blockages, and fittings — fast.",
    description: "Skilled plumbers ready to fix leaks, install fixtures, and solve any plumbing emergency.",
    commonJobs: ["Leak repair", "Pipe installation", "Drain cleaning", "Tap & faucet fitting", "Water heater service"],
  },
  {
    slug: "mechanic",
    name: "Mechanic",
    icon: Car,
    color: "text-red-500",
    tagline: "Car & bike mechanics that come to you.",
    description: "Get your vehicle running smoothly with experienced mechanics for diagnostics, repairs, and servicing.",
    commonJobs: ["Engine diagnostics", "Battery replacement", "Brake repair", "Oil change", "Roadside assistance"],
  },
  {
    slug: "ac_technician",
    name: "AC Technician",
    icon: Wind,
    color: "text-cyan-500",
    tagline: "AC install, service, and repair specialists.",
    description: "Stay cool with certified AC technicians for installation, gas refill, deep cleaning, and repair.",
    commonJobs: ["AC installation", "Gas refill", "Deep cleaning", "Cooling issues", "Annual servicing"],
  },
  {
    slug: "painter",
    name: "Painter",
    icon: Paintbrush,
    color: "text-purple-500",
    tagline: "Interior & exterior painting done right.",
    description: "Refresh your space with professional painters for homes, offices, and commercial spaces.",
    commonJobs: ["Interior painting", "Exterior painting", "Wall texturing", "Wood polishing", "Waterproofing"],
  },
  {
    slug: "cleaner",
    name: "Cleaner",
    icon: SprayCan,
    color: "text-green-500",
    tagline: "Sparkling clean homes & offices on demand.",
    description: "Book reliable cleaners for deep cleaning, regular upkeep, and post-renovation cleanups.",
    commonJobs: ["Deep cleaning", "Kitchen & bathroom", "Sofa & carpet", "Office cleaning", "Move-in / move-out"],
  },
  {
    slug: "handyman",
    name: "Handyman",
    icon: Wrench,
    color: "text-orange-500",
    tagline: "One pro for all those small fixes.",
    description: "Hire a versatile handyman for furniture assembly, small repairs, mounting, and odd jobs.",
    commonJobs: ["Furniture assembly", "TV mounting", "Door & lock repair", "Curtain fitting", "Minor repairs"],
  },
  {
    slug: "construction",
    name: "Construction",
    icon: HardHat,
    color: "text-amber-700",
    tagline: "Skilled construction workers for any project.",
    description: "Find masons, tilers, and construction labor for renovations and building work.",
    commonJobs: ["Masonry", "Tiling", "Plastering", "Demolition", "Renovation"],
  },
];

export const getCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
