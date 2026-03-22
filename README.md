# Email Builder

A drag-and-drop email template builder built with React 18, TypeScript, and Vite.

## Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui** (Radix primitives)
- **dnd-kit** for drag & drop
- **react-router-dom** v6
- **@tanstack/react-query**
- **Vitest** + **@testing-library/react** for tests

## Getting Started

The only requirement is Node.js & npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start the development server
npm run dev
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build |
| `npm run build:dev` | Development build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |
| `npm test` | Run all tests (single pass) |
| `npm run test:watch` | Run tests in watch mode |

## Features

- **Block palette** — Drag or click to add: Heading, Text, Image, Button, Hero, Product Card, Coupon, Survey/Rating, Timer, Video, Divider, Spacer, HTML, Social, IF/ELSE Conditional
- **Multi-column rows** — 1, 2, or 3 column layouts with drag-and-drop reordering
- **Inline editing** — Click any text block to edit in place with a floating rich-text toolbar (bold, italic, underline, links, font size/family, lists, alignment, AI rewrite, personalisation variables)
- **Properties panel** — Full property editing for every block type
- **Image editor** — Crop, adjust (brightness/contrast/saturation/blur), AI background removal, AI upscale, stock photo browser (Unsplash)
- **Personalisation** — Insert `{{variable}}` merge tags and IF/ELSE conditional blocks
- **Undo / Redo** — Full history with Ctrl+Z / Ctrl+Shift+Z
- **Desktop / Mobile preview toggle**
- **AI template generation** (mock) and starter templates
- **Upload HTML** — Import an existing HTML email and parse it into editable blocks
- **Export** — Download email-safe HTML or copy to clipboard; optional Google Fonts injection
- **Internationalisation** — English, Russian, Ukrainian, Italian, Spanish, French

## Project Structure

```
src/
├── components/email-builder/
│   ├── blocks/          # One folder per block type (Renderer, PropsPanel, exportHtml, index)
│   ├── canvas/          # Droppable canvas helpers
│   ├── inline-editor/   # Contenteditable rich-text editor + floating toolbar
│   ├── index-page/      # Page-level composition (sidebar, drag preview, block meta)
│   └── properties-panel/# Shared controls and per-block property panels
├── config/              # Fonts, social networks, personalisation variables, i18n
├── data/                # Starter email templates
├── hooks/               # useEmailBuilder, useBlockOps, useRowOps, useTemplateHistory, …
├── pages/               # Index (builder) and NotFound
├── types/               # All TypeScript types for blocks and templates
└── utils/               # exportHtml, parseHtml, uid, AI mocks

tests/                   # Mirror of src/ structure; run with Vitest
```

## Configuration

### Unsplash Stock Photos

Add your free Unsplash API key to `.env` to enable live search:

```
VITE_UNSPLASH_ACCESS_KEY=your_key_here
```

Get a free key at <https://unsplash.com/developers>. Without a key, a curated library of 20 images is shown.

### Image Storage

By default, edited images are stored as base64 data URIs. To switch to a server upload, edit `src/config/image-storage.ts`:

```ts
export const IMAGE_STORAGE_CONFIG: ImageStorageConfig = {
    driver: 'server',
    serverEndpoint: 'https://your-upload-endpoint.com/upload',
};
```

### Adding a New Block Type

See the step-by-step guide in [`AGENTS.md`](./AGENTS.md#adding-a-new-block-type).

### Adding a New Social Network

Append one entry to `SOCIAL_NETWORK_CONFIG` in `src/config/social-networks.ts` — no other files need changing. See [`AGENTS.md`](./AGENTS.md#adding-a-new-social-network).

### Adding a New Language

See [`AGENTS.md`](./AGENTS.md#adding-a-new-language).

## Testing

Tests live in `tests/` and mirror the `src/` structure.

```sh
npm test          # single run
npm run test:watch  # watch mode
```

Coverage areas include utility functions (`parseHtml`, `exportHtml`, AI mocks), hooks (`useEmailBuilder`, `useBlockOps`, `useTemplateHistory`), inline editor helpers (positioning, formatting, toolbar state, keyboard handling), and component-level tests (block renderers, modals, context menus).

## Deployment

Build the project and serve the `dist/` folder from any static host:

```sh
npm run build
# then upload dist/ to your host of choice
```