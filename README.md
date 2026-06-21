<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Art Prompt Builder

AI Art Prompt Builder is a React application that generates highly customizable, multi-format creative prompts for AI art generators.

## Features
- **Prompt Generation:** Create prompts by selecting elements across Character, Scene, and Camera categories.
- **Multi-Format Output:** Export prompts in narrative, technical, poetic, or bullet-point formats.
- **AI-Powered Imports:** Use the Gemini API to generate and import new, creative options into your prompt categories.
- **Customizable Themes:** Choose from seven distinct visual themes (Neon, Dark, Pastel, Ocean, Sunset, Forest, Candy).
- **Sound Effects:** Optional interactive sound effects.
- **One-Click Copy:** Easily copy generated prompts to your clipboard.

## Install & Usage

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Run the application:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview the production build locally:
   ```bash
   npm run preview
   ```

## Tech Stack
React, TypeScript, Vite, @google/genai