<img src="https://res.cloudinary.com/dtl48kr1u/image/upload/v1699270985/bad-jokes/title2_s1prxl.png" width="320" alt="Bad Jokes" />

Bad Jokes is a web app that lets users pick up to three words and generates a dad joke using OpenAI. It features a comic-style UI with an avatar, sound effects, and a modal to display the joke.

## Composition

The app is built around a single flow:

- **Intro** → select up to three words → **Generate joke** (OpenAI) → **Modal** with joke and sound effects.

## Features

- Word selection (up to three) to steer the joke.
- OpenAI-powered joke generation via `/api/completion`.
- Animated avatar with different states (e.g. greet, stressed).
- Sound effects (punch, laugh) using `use-sound`.
- Title/logo image and favicon (`/Media/icon.PNG`, title image in layout).
- Responsive layout with Bootstrap.

## Technology

- Next.js 14 + React 18
- TypeScript
- OpenAI API
- Bootstrap
- use-sound
- Sharp (images)

## Setup

```bash
npm install
npm run dev
```

Create `.env.local` in the project root with your OpenAI key:

```
OPENAI_KEY=your_openai_api_key_here
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

- Requires a valid OpenAI API key for joke generation.
- Media folder at repo level (outside this app) is for design assets only and can be ignored for running the app.
