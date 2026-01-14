# AI Recipe Generator

A web app that turns your ingredients into recipes using Google's Gemini AI.

## Features

- Generate recipes from ingredients you have
- Filter by cuisine type and meal type
- Get complete recipes with prep time, ingredients, and step-by-step instructions
- Clean, responsive design

## Setup

1. Clone the repo:
```bash
git clone https://github.com/vikram00014/AI-Recipe-Generator.git
cd AI-Recipe-Generator
```

2. Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

3. For local testing, create `.env` file:
```
GEMINI_API_KEY=your_api_key_here
```

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variable:
   - Key: `GEMINI_API_KEY`
   - Value: Your Gemini API key
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vikram00014/AI-Recipe-Generator)

## Tech Stack

- HTML, CSS, JavaScript
- Google Gemini 2.5 Flash API
- No frameworks, no dependencies

## Usage

1. Enter ingredients (e.g., "chicken, rice, tomatoes")
2. Pick cuisine and meal type (optional)
3. Click Generate
4. Get your recipe

## License

MIT
