# Downsize Baltimore Developer Handoff

## Project overview

Downsize Baltimore is a React 19 static website for a Baltimore real-estate advisory service focused on families navigating downsizing, aging in place, buying and selling, caregiving, probate, and later-life housing decisions. The visual system is **Harbor House Editorial**: navy, cream, taupe, antique gold, Cormorant Garamond headlines, DM Sans body text, restrained anchor motifs, and editorial photography.

## Routes

| Route | Purpose |
|---|---|
| `/` | Home landing page |
| `/downsizing-services` | Downsizing planning and transition guidance |
| `/aging-in-place` | Aging in place education, home considerations, and self-evaluation |
| `/buying-selling` | Combined buying and selling strategy page |
| `/resource-center` | Same-page resource filters, FAQ accordion, and upcoming classes/events area |
| `/meet-mary` | Mary’s professional and personal story |
| `/contact` | Calendly-first contact page |
| Fallback | On-brand custom 404 page |

## Implemented functionality

The Aging in Place self-evaluation is a client-side, ten-question flow. Questions 1–9 use the three requested response choices; question 10 is visually distinguished and uses its own answer labels. Results are shown immediately without collecting contact information or applying a simplistic stay/move score. Results group responses into Working Well, Worth Planning For, and Needs a Closer Look, followed by the requested conversation CTA linked to Mary’s existing Calendly appointment option.

The Resource Center’s six doors now act as same-page filters for the featured resource library. Filters can also be opened directly with `/resource-center?path=stay#resource-library`, `/resource-center?path=downsizing#resource-library`, `/resource-center?path=family#resource-library`, `/resource-center?path=housing#resource-library`, `/resource-center?path=probate#resource-library`, or `/resource-center?path=local#resource-library`. The FAQ area uses tap-to-expand controls on the same page. The Upcoming Classes & Events section is available at `/resource-center#upcoming-classes-events`, and program-related calls to action route there rather than to a separate events page.

The Downsizers Club is presented as an active, now-enrolling offering. Its “Ask About Enrollment” CTA routes to the existing Contact page rather than creating a separate club page.

Downsizing Services now presents eight informational step cards with desktop hover emphasis and keyboard/touch expansion. Aging in Place’s six home-consideration cards use the same accessible interaction model. Buying and Selling remains one page, with the existing Explore Buying and Explore Selling links targeting `#buying` and `#selling`.

## Intentional content states

No customer reviews, ratings, testimonials, or placeholder review excerpts have been fabricated. Existing testimonial reserve areas remain available for genuine, approved excerpts to be supplied later. Resource download cards that are still in development remain non-clickable and visibly labeled as development states.

## Development commands

Run `pnpm install` if dependencies are not present. Use `pnpm run dev` for local development, `pnpm run check` for TypeScript validation, `pnpm run build` for the production build, and `pnpm run format` for formatting.

## Assets

Large images and media are kept outside the project source and referenced through persistent `/manus-storage/...` URLs. New assets should be staged in `/home/ubuntu/webdev-static-assets/`, uploaded with the project asset workflow, and referenced by the returned storage path. Do not place large media in `client/public` or `client/src/assets`.

## Hosting and deployment

The project is hosted through Manus WebDev in Autoscale mode. The current published domain is `https://downsizebal-kacy23k2.manus.space`. The project is configured for automatic publishing on checkpoint creation. A new developer should use the project’s checkpoint/version workflow rather than manually copying files into a separate deployment.

## Maintenance notes

Preserve the existing page-level CSS conventions and design tokens in `client/src/index.css`. Keep navigation and footer destinations synchronized across all seven pages. Use existing Calendly links for appointment actions. Aging in Place home-safety and ADU CTAs use the Resource Center’s filtered `stay` and `housing` views. When adding review content, use only genuine excerpts approved by Mary, with the reviewer attribution she authorizes. Keep personal photographs authentic and use cropping only when necessary for layout.

## Corrected Functional Repair Notes

The homepage pathway cards now route directly to Downsizing Services, Buying & Selling, and Aging in Place. The homepage Chart the Course cards now route to relevant Resource Center filtered views or the Buying & Selling page, while Visit the Resource Center opens the main Resource Center route.

Aging in Place home-safety, ADU, upcoming-program, self-evaluation, and trusted-local-resources actions use specific Resource Center anchors or the local-resource pathway. The Downsizers Club is presented as Now enrolling and its Ask About Enrollment action opens Contact. In-development Resource Center items remain inactive rather than linking to fabricated pages or downloads.

The sitewide booking destination remains `https://calendly.com/mary-movewithmarylynch/30min`; a direct HTTP check returned 200 during the repair audit. If the owner changes Calendly event settings, update the shared `calendlyUrl` constants across page components.
