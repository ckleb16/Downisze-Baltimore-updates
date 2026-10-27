import { RESOURCE_GUIDES, guidePath, type ResourceGuide } from "@/lib/resourceGuides";

export default function GuideLinks({ slugs }: { slugs: readonly ResourceGuide["slug"][] }) {
  return (
    <div className="topic-guide-links">
      <h3>Free guides</h3>
      <ul>
        {slugs.map((slug) => {
          const guide = RESOURCE_GUIDES.find((item) => item.slug === slug)!;
          return <li key={slug}><a href={guidePath(guide)}>{guide.title}</a></li>;
        })}
      </ul>
    </div>
  );
}
