import type { ResponsiveMediaSource } from "./responsiveMedia";

// Approved sources and sizes, shared by page images and server resource hints.
// Changing this map must not change the photo, crop, or layout without approval.
export const ROUTE_HERO_MEDIA = {
  "/": { src: "/manus-storage/AugustwebsiteHOMEphoto_6750abaf.png", sizes: "100vw" },
  "/downsizing-services": { src: "/manus-storage/downsizing-hero_718d6bc8.jpeg", sizes: "100vw" },
  "/aging-in-place": { src: "/manus-storage/aging-in-place-hero_627154ed.jpg", sizes: "(max-width: 900px) 100vw, 46vw" },
  "/buying-selling": { src: "/manus-storage/mary-lynch-buying-selling-hero_41a29217.jpg", sizes: "(max-width: 1180px) 100vw, 54vw" },
  "/resource-center": { src: "/manus-storage/mary-lynch-resource-center_4f151291.jpg", sizes: "(max-width: 1180px) 100vw, 50vw" },
  "/meet-mary": { src: "/manus-storage/mary-lynch-meet-mary-hero_8902efd8.jpg", sizes: "(max-width: 1180px) 100vw, 50vw" },
  "/contact": { src: "/manus-storage/mary-lynch-contact-chair_dd829984.jpg", sizes: "(max-width: 1180px) 100vw, 50vw" },
} as const satisfies Record<string, { src: ResponsiveMediaSource; sizes: string }>;
