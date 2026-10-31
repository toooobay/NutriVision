# NutriVision AI

A personal AI nutritionist web app. Upload a photo of a meal and NutriVision AI identifies the food, estimates its nutrition, and gives a health assessment with suggestions in Bahasa Indonesia.

## Features

- Food photo analysis with Google Gemini
- Calories, macronutrients, vitamins and minerals
- Traffic-light indicators for sugar, sodium and saturated fat
- Healthier alternatives and diet tips
- Daily nutrition tracker and user profile
- BMI calculator
- Light and dark themes

History, profile and tracker data are stored in the browser's `localStorage`.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express
- **AI:** Google Gemini (`gemini-2.5-flash`)

## Getting Started

### Prerequisites

- Node.js 20 or newer
- A [Gemini API key](https://aistudio.google.com/apikey)

### Setup

```bash
npm install
cp .env.example .env
```

Add your key to `.env`:

```
GEMINI_API_KEY=your_key_here
```

### Run

```bash
npm run dev
```

The app runs at http://localhost:5000.

> On macOS, AirPlay Receiver may already be using port 5000. If so, set `PORT=5001` in `.env`.

### Production Build

```bash
npm run build
npm run start
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build the client and server into `dist/` |
| `npm run start` | Run the production build |
| `npm run check` | Type-check the project |
| `npm run db:push` | Push the Drizzle schema (requires `DATABASE_URL`) |

## Project Structure

```
client/           React frontend
server/           Express API and Gemini integration
shared/           Shared schema and types
attached_assets/  Images used by the app
```

## Disclaimer

Nutrition values are AI estimates and are not medical advice.
