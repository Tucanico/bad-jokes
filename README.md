<img src="https://res.cloudinary.com/dtl48kr1u/image/upload/v1699270985/bad-jokes/title2_s1prxl.png" width="320" alt="Bad Jokes" />

Bad Jokes is a web app that lets users pick up to three words and generates a dad joke using Mistral AI. It features a comic-style UI with an avatar, sound effects, and a modal to display the joke.

## Composition

The app is built around a single flow:

- **Intro** → select up to three words → **Generate joke** (Mistral) → **Modal** with joke and sound effects.

## Features

- Word selection (up to three) to steer the joke.
- Mistral-powered joke generation via `/api/completion`.
- Animated avatar with different states (e.g. greet, stressed).
- Sound effects (punch, laugh) using `use-sound`.
- Title/logo image and favicon (`/Media/icon.PNG`, title image in layout).
- Responsive layout with Bootstrap.

## Technology

- Next.js 16 + React 19
- TypeScript
- Mistral AI API
- Bootstrap
- use-sound
- Upstash Redis (optional, shared rate limit)

## Setup

```bash
npm install
npm run dev
```

Create `.env.local` in the project root with your Mistral API key:

```
MISTRAL_API_KEY=your_mistral_api_key_here
```

Optional: the joke API allows 10 jokes per minute per visitor. Without Upstash that count is kept per server instance; to share it across all instances, create an Upstash Redis database and add its REST credentials (Vercel's Upstash integration sets `KV_REST_API_URL` and `KV_REST_API_TOKEN` instead, which also work):

```
UPSTASH_REDIS_REST_URL=your_upstash_rest_url_here
UPSTASH_REDIS_REST_TOKEN=your_upstash_rest_token_here
```

## Build

```bash
npm run build
npm run start
```

## Assets

- **Logo / title**: The title above is the app logo (Cloudinary: `bad-jokes/title2_s1prxl.png`). Used in the layout.
- **Favicon**: `public/Media/icon.PNG`.
- **Sounds**: `public/Media/Sounds/` (e.g. laugh, punch, swoosh).
- **Balloons / comics**: `public/Media/` (Balloons, comics assets).

## Notes

- Requires a valid Mistral API key for joke generation.
- Media folder at repo level (outside this app) is for design assets only and can be ignored for running the app.
