export type ResponsiveMediaMetadata = {
  width: number;
  height: number;
  variants: readonly number[];
};

export const RESPONSIVE_MEDIA = {
  "/manus-storage/AugustwebsiteHOMEphoto_6750abaf.png": { width: 1536, height: 1024, variants: [480, 768, 1200, 1536] },
  "/manus-storage/aging-in-place-consultation_1b627f71.jpg": { width: 2048, height: 1365, variants: [480, 768, 1200, 1600] },
  "/manus-storage/aging-in-place-hero_627154ed.jpg": { width: 1365, height: 2048, variants: [480, 768, 1200, 1365] },
  "/manus-storage/downsizing-hero_718d6bc8.jpeg": { width: 1672, height: 941, variants: [480, 768, 1200, 1600] },
  "/manus-storage/downsizing-room_d33a128b.jpeg": { width: 1672, height: 941, variants: [480, 768, 1200, 1600] },
  "/manus-storage/mary-and-pop-boat.png": { width: 1448, height: 1086, variants: [480, 768, 1200, 1448] },
  "/manus-storage/mary-chesapeake-frenchies_ed69a28d.jpg": { width: 1206, height: 1603, variants: [480, 768, 1200, 1206] },
  "/manus-storage/mary-family-travel_7af40885.jpg": { width: 1206, height: 1254, variants: [480, 768, 1200, 1206] },
  "/manus-storage/mary-lynch-buying-selling-hero_41a29217.jpg": { width: 1365, height: 2048, variants: [480, 768, 1200, 1365] },
  "/manus-storage/mary-lynch-contact-chair_dd829984.jpg": { width: 1365, height: 2048, variants: [480, 768, 1200, 1365] },
  "/manus-storage/mary-lynch-downsizing_b73a2d4f.jpg": { width: 1365, height: 2048, variants: [480, 768, 1200, 1365] },
  "/manus-storage/mary-lynch-meet-mary-hero_8902efd8.jpg": { width: 1365, height: 2048, variants: [480, 768, 1200, 1365] },
  "/manus-storage/mary-lynch-resource-center_4f151291.jpg": { width: 1365, height: 2048, variants: [480, 768, 1200, 1365] },
  "/manus-storage/mary-orioles-family_627afe9d.jpg": { width: 1206, height: 1602, variants: [480, 768, 1200, 1206] },
  "/manus-storage/Mary_Lynch_3d838598.jpg": { width: 1365, height: 2048, variants: [480, 768, 1200, 1365] },
  "/manus-storage/pop-and-baby-mary-boat_ef16c849.jpg": { width: 1152, height: 2048, variants: [480, 768, 1152] },
  "/manus-storage/pop-driving-the-boat-thumbnail_d6758521.jpg": { width: 1280, height: 720, variants: [480, 768, 1200, 1280] },
} as const satisfies Record<string, ResponsiveMediaMetadata>;

export type ResponsiveMediaSource = keyof typeof RESPONSIVE_MEDIA;

export function responsiveVariant(source: ResponsiveMediaSource, width: number) {
  return source.replace(/\.(?:png|jpe?g)$/i, `-${width}w.webp`);
}
