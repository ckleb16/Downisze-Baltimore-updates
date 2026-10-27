import { metadataFields, type PageMetadata } from "./siteMetadata";

export function updateDocumentMetadata(document: Document, metadata: PageMetadata) {
  const titles = Array.from(document.head.querySelectorAll("title"));
  const title = titles.shift() ?? document.head.appendChild(document.createElement("title"));
  titles.forEach(element => element.remove());
  title.textContent = metadata.title;
  for (const field of metadataFields(metadata)) {
    const matches = Array.from(document.head.querySelectorAll<HTMLMetaElement>(`meta[${field.attribute}="${field.key}"]`));
    const first = matches.shift();
    matches.forEach(element => element.remove());
    if (field.value === null) { first?.remove(); continue; }
    const element = first ?? document.head.appendChild(document.createElement("meta"));
    element.setAttribute(field.attribute, field.key);
    element.content = field.value;
  }
  const canonicals = Array.from(document.head.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]'));
  const first = canonicals.shift();
  canonicals.forEach(element => element.remove());
  if (metadata.canonical) {
    const element = first ?? document.head.appendChild(document.createElement("link"));
    element.rel = "canonical";
    element.href = metadata.canonical;
  } else first?.remove();
}
