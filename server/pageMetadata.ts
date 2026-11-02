import {
  initialMetadataInput,
  metadataFields,
  resolvePageMetadata,
  type MetadataContext,
} from "../client/src/lib/siteMetadata";

export function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export function serializeMetadataContext(context: MetadataContext) {
  // Escape characters that can terminate an HTML script or alter script parsing.
  return JSON.stringify(context).replace(/[<>&\u2028\u2029]/g, character =>
    `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`);
}

export function renderPageMetadata(template: string, context: MetadataContext) {
  const metadata = resolvePageMetadata(context, initialMetadataInput(context));
  const fields = metadataFields(metadata)
    .filter(field => field.key !== "description" && field.value !== null)
    .map(field => `<meta ${field.attribute}="${field.key}" content="${escapeHtml(field.value!)}" />`);
  if (metadata.canonical) fields.unshift(`<link rel="canonical" href="${escapeHtml(metadata.canonical)}" />`);
  fields.push(`<script id="site-metadata-context" type="application/json">${serializeMetadataContext(context)}</script>`);
  return template
    .replace(/<title>[\s\S]*?<\/title>/i, () => `<title>${escapeHtml(metadata.title)}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/i,
      () => `<meta name="description" content="${escapeHtml(metadata.description)}" />`)
    .replace(/<!--__ROUTE_META_START__-->[\s\S]*?<!--__ROUTE_META_END__-->/,
      () => fields.join("\n    "));
}
