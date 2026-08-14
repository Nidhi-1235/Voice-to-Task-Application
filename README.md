# Voice Task AI

Create a modern, full-stack Voice-to-Task Mobile & Web Application using React Native (Expo) and Tailwind CSS (NativeWind / Lucide Icons). 

This app is designed to convert spoken or natural language voice commands into structured, actionable tasks (extracting task title, date, and time) using Google Gemini AI.

---

### Key Requirements & Features:

1. 🎙️ **Voice & Natural Language Input:**

   - A prominent input bar allowing users to type or use speech-to-text dictation.

   - Quick "Sample Voice Commands" pills for fast testing (e.g., "Remind me to call John tomorrow at 5 PM", "Submit assignment on Friday by 11 AM").

2. 🧠 **AI Task Extraction (Gemini 1.5 Flash API Integration):**

   - Take the raw input string and send it to Google Gemini AI API.

   - System prompt instructions:

     Extract task details and respond strictly with a valid JSON object:

     {

       "task": "Clean concise title",

       "date": "Extracted date (e.g. Tomorrow, Aug 15, or Friday)",

       "time": "Extracted time (e.g. 5:00 PM or Not specified)"

     }

   - Include a robust local regex fallback parser if no API key is provided or if network fails.

3. 📋 **Structured Task Dashboard & Cards:**

   - Display tasks in a clean feed with badges for 📅 Date and ⏰ Time.

   - Show the original voice command query below the extracted task card for transparency.

   - Allow toggling tasks as "Completed" or deleting them.

4. 🎨 **UI/UX Design:**

   - Clean, dark/light modern UI with smooth micro-interactions.

   - Loading spinners and error handling toasts when AI is processing commands.

   - Fully responsive on mobile (iOS/Android) and Web.

5. 📄 **Export / Setup Instructions:**

   - Provide clean, modular code with comments.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://speak-task-magic-32.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0eec177f-3c47-4a75-a57e-ca6543856aac).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
