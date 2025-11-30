# EchoScribe

EchoScribe is a fictional product concept for meeting intelligence—transcripts, summaries, and action items tied to timestamps and speakers. This build is a static marketing site: one page, custom CSS, and vanilla JS, focused on how the product would be explained to teams who need follow-ups the same day as the call. There is no backend; CTAs and pricing are presentational.

## Live Demo — [🔗](https://echoscribee.netlify.app/)

## Overview

The page follows a post-call workflow—record, structure, review, share—using hero and in-page workspace mockups, a bento feature grid, social proof, pricing, and FAQ. Most of the work went into layout, typography, light/dark theme, and believable app chrome rather than shipping transcription or integrations.

## Highlights

- Hero and workspace mockups (transcript, summary inspector, tabs, status bar)
- Bento feature grid with inline UI previews (summaries, actions, email draft, search)
- Marketing sections: trust strip, how-it-works, testimonials, pricing, final CTA
- System-aware dark mode with persistence, mobile nav, scroll reveals, FAQ accordion
- Accessible patterns: skip link, semantic landmarks, accordion ARIA, reduced-motion fallbacks

## Tech Stack

- HTML5
- Custom CSS (design tokens, no UI framework)
- Vanilla JavaScript
- Google Fonts (Fraunces, Inter)

## Run Locally

```bash
# Option 1: open index.html directly in a browser

# Option 2: local server (Python)
python -m http.server 8080

# Option 3: local server (Node)
npx serve .
```

## Scope Note

This is a fictional product concept. This version does not include persistence or backend integration—no API, authentication, billing, or live connectors.