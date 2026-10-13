# Atelier

A small, production-grade art discovery app for iOS and Android, built with Expo
Router. It browses the public collection of the **Cleveland Museum of Art**
(Open Access API, no key required) and presents works as a printed museum
catalogue.

## What it does

- **Collection list** — a curated, infinite-scrolling feed of public-domain works
  with images, fetched from `openaccess-api.clevelandart.org`. Filter by medium
  (painting, print, photograph, sculpture, drawing, textile).
- **Detail screen** — full-bleed image with a parallax header, catalogue
  metadata, the curatorial description, related works by the same artist, native
  share, and a link through to the work on clevelandart.org.
- **Loading / error / empty states** — bespoke shimmer skeletons, a designed
  error state with retry, and a 404 screen.
- **Pull to refresh** and infinite scroll.
- Light and dark themes that follow the system.

## Design

The visual language is a warm "museum catalogue": bone paper by day and a
lamp-lit gallery at night, a single vermilion accent, hairline rules, and an
editorial type pairing of **Fraunces** (display) with **Inter** (text). Icons are
a hand-drawn SVG set rather than a stock icon font, and the app icon is generated
from the Fraunces monogram.

## Stack

- [Expo](https://docs.expo.dev) SDK 57 + React Native, Expo Router (file routes in `src/app/`)
- [`@tanstack/react-query`](https://tanstack.com/query) for fetching, caching, retries, pagination
- `expo-image` (CDN images with cross-fade), `react-native-reanimated`, `react-native-svg`
- TypeScript (strict), `eslint-config-expo`

## Structure

```
src/
  app/                 # routes: _layout, index (list), artwork/[id] (detail), +not-found
  components/
    artwork/           # cards, hero, metadata grid, related rail, skeletons
    ui/                # brand primitives: button, chip rail, icon set, state views, skeleton
  lib/                 # api client, react-query hooks, formatting
  theme/               # colour, type, spacing, motion tokens
```

## Commands

```bash
npm install
npm start           # dev server
npm run ios         # iOS simulator
npm run android     # Android emulator
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
```

Add native libraries with `npx expo install <pkg>` so versions stay SDK-compatible.

## Data

Artwork data and images are provided by the Cleveland Museum of Art Open Access
initiative and are, in almost all cases, released under CC0. Images are served
from the museum's public CDN, which permits cross-origin embedding, so the same
requests work on device and in the browser.
