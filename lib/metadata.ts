import type { Metadata } from "next";

export const drEngineRusMetadata: Metadata = {
  title: {
    default: "Dr. Engine R'us",
    template: "%s | Dr. Engine R'us",
  },
  description: "Internal motorcycle service operations platform for Dr. Engine R'us.",
};

export const visayasMotoHubMetadata: Metadata = {
  title: {
    absolute: "Visayas Moto Hub",
    template: "%s | Visayas Moto Hub",
  },
  description: "Brand-new motorcycle showroom, service requests, reservations, and inquiries for Visayas Moto Hub.",
};

export function visayasMotoHubPageMetadata(title: string, description?: string): Metadata {
  return {
    title: {
      absolute: `${title} | Visayas Moto Hub`,
    },
    description: description ?? visayasMotoHubMetadata.description,
  };
}
