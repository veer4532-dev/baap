# 3.1.0 — 24 October 2026

Homepage order is blogs, categories, videos, study callout and footer. Blogs use existing published resources (up to 12 newest); click opens /learn/:id. Carousels pause on focus/hover and respect reduced motion. Native horizontal scrolling supports touch. Public and admin filter bars have been removed; header text search remains.

The new site_content table stores categories, videos and pages. A one-time migration publishes four starter categories and six original information pages. Existing learning data is preserved. Archived/draft CMS records are hidden from public routes. Editors can manage CMS content; only administrators can change branding/upload logos. Actions enforce session role, origin, rate limits and validated fields. Page body is rendered as text and headings, never arbitrary HTML.

YouTube URL validation accepts only HTTPS YouTube watch/short/share links or valid IDs. URLs are reconstructed from an 11-character ID. Thumbnails use i.ytimg.com, explicitly permitted by CSP. Selecting a video opens YouTube; no embedded player or ad scripts are loaded. No owner video URLs were provided, so the video collection intentionally starts empty for owner management.

Logo uploads accept decoded single-frame PNG/JPEG/WebP up to 5 MB and 25 million input pixels. Images are re-encoded and resized to WebP in private DATA_DIR/uploads; only the active logo is served through a validated public route. Existing backup tooling includes this directory.

Information pages are not an AdSense approval certificate. Owner contact information, real educational content and deployment-specific privacy/consent details must be completed before launch or applying. Reference: https://support.google.com/adsense/answer/81904

Original live site and supplied archives are unchanged. No production deployment is included.

## Verification outcome
Production build: passed. Unit tests: 12 passed. npm audit: 0 reported vulnerabilities on 24 October 2026. Default-page creation and preservation of edited/archived pages were exercised against a fresh isolated SQLite database across separate processes. Browser/responsive screenshots and new HTTP integration tests were not executed because automatic approval review blocked local server startup even after network permission was granted. This is an explicit verification limit, not a production readiness guarantee. The 3.0 browser images are not included as evidence for this updated layout.
