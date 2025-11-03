# Flora Navigator: Your AI Gardening Guide

Flora Navigator is a modern, AI-powered web application designed to help gardening enthusiasts of all levels. By leveraging the power of Google's Gemini API, Flora Navigator can identify plants from a photograph, diagnose problems, and provide detailed care instructions through a user-friendly, conversational interface.

![Flora Navigator Screenshot](https://storage.googleapis.com/aistudio-o-images/project_screenshots/flora-navigator.png)

## ✨ Features

-   **🎯 Three Specialized Modes**:
    -   **Identify**: Snap a photo to learn about any plant.
    -   **Diagnose**: Upload an image of a sick plant to get a diagnosis and treatment plan.
    -   **Care**: Ask for detailed care instructions for your plants.
-   **📷 Flexible Image Input**: Upload photos from your device or use the built-in camera for real-time identification.
-   **💬 Interactive Chat**: Engage in a natural conversation with Flora, your AI gardening assistant.
-   **🎨 Dynamic Theming**: The app's color scheme (headers, chat bubbles, UI accents) changes to match the active mode, creating a beautiful and intuitive experience.
-   **🌙 Light & Dark Modes**: Switch between light and dark themes for comfortable viewing in any environment.
-   **📱 Responsive Design**: A clean, mobile-first interface that looks great on any screen size.
-   **✨ Rich Responses**: AI responses are formatted with Markdown for easy readability, including headers, lists, and bold text.

## 🛠️ Tech Stack

-   **Frontend**: [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **AI Model**: [Google Gemini API (`gemini-2.5-flash`)](https://ai.google.dev/)
-   **Module Loading**: ES Modules with Import Maps

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
-   A modern web browser (e.g., Chrome, Firefox, Safari).
-   A Google Gemini API Key. You can obtain one from [Google AI Studio](https://aistudio.google.com/).

## 🚀 Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository (or download the files):**
    ```bash
    git clone https://github.com/your-username/flora-navigator.git
    cd flora-navigator
    ```

2.  **Set up your API Key:**
    The application is configured to use an environment variable `process.env.API_KEY`. In a local development environment or a platform like AI Studio, this variable needs to be configured in the environment settings.

    Create a `.env` file in the root of your project and add your API key:
    ```
    API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```
    *Ensure this file is listed in your `.gitignore` to keep your key private.*

3.  **Run the application:**
    You can serve the files using a simple local web server. If you have Python installed, you can run:
    ```bash
    python -m http.server
    ```
    Or with Node.js, you can use a package like `serve`:
    ```bash
    npx serve .
    ```
    Open your browser and navigate to the provided local URL (e.g., `http://localhost:8000`).

## 📁 Project Structure

```
.
├── components/                # Reusable React components
│   ├── CameraCapture.tsx      # Modal component for taking photos
│   ├── ChatWindow.tsx         # Displays the chat message history
│   ├── InputBar.tsx           # The text and file input area
│   ├── LandingPage.tsx        # The initial screen for mode selection
│   ├── MarkdownRenderer.tsx   # Renders Markdown from the AI's response
│   ├── NavigationBar.tsx      # Bottom navigation for switching modes
│   ├── assets.ts              # Base64 encoded image assets
│   ├── icons.tsx              # SVG icon components
│   └── logo.ts                # Base64 encoded app logo
├── services/                  # Handles external API calls
│   └── geminiService.ts       # Logic for interacting with the Gemini API
├── App.tsx                    # Main application component, manages state and views
├── index.html                 # The main HTML file
├── index.tsx                  # The entry point for the React app
├── metadata.json              # Application metadata
├── types.ts                   # Shared TypeScript type definitions
├── README.md                  # This file
├── SPECIFICATION.md           # Application specification details
├── AGENTS.md                  # AI agent persona and instructions
└── LICENSE.md                 # Project license
```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.
