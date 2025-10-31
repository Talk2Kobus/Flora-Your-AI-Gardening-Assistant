# Flora: Your AI Gardening Assistant

Flora is a modern, AI-powered web application designed to help gardening enthusiasts of all levels. By leveraging the power of Google's Gemini API, Flora can identify plants from a photograph, provide detailed care instructions, and answer general gardening questions through a user-friendly chat interface.

![Flora Screenshot](https://storage.googleapis.com/aistudio-o-images/project_screenshots/flora-gardening-assistant.png)

## ✨ Features

-   **📸 Plant Identification**: Upload a photo or use your device's camera to snap a picture of a plant for instant identification.
-   **💬 Conversational Interface**: An intuitive chat window to interact with the AI assistant.
-   **🌿 Detailed Care Instructions**: Receive specific advice on sunlight, watering, soil, and fertilizer for your plants.
-   **💡 Intuitive UI**: A clean interface with helpful tooltips and clear iconography.
-   **🧠 General Gardening Knowledge**: Ask any gardening-related question and get a helpful response.
-   **💨 Real-time Responses**: Get quick answers with a "Flora is typing..." indicator for a better user experience.
-   **📱 Responsive Design**: A clean, mobile-first interface that works beautifully on any device.

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
    git clone https://github.com/your-username/flora-assistant.git
    cd flora-assistant
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
│   ├── ChatWindow.tsx         # Displays the chat message history
│   ├── InputBar.tsx           # The text and file input area
│   ├── MarkdownRenderer.tsx   # Renders Markdown from the AI's response
│   └── icons.tsx              # SVG icon components
├── services/                  # Handles external API calls
│   └── geminiService.ts       # Logic for interacting with the Gemini API
├── App.tsx                    # Main application component
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