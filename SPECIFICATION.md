# Flora AI Gardening Assistant: Application Specification

### Version 1.0

## 1. Introduction

This document outlines the functional and non-functional requirements for **Flora**, an AI-powered gardening assistant. The application's primary purpose is to provide users with an interactive and helpful tool for plant identification and care.

## 2. Core Functionality

### 2.1. Plant Identification

-   **Requirement**: Users must be able to upload an image file from their device or capture a new photo using their device's camera.
-   **Acceptance Criteria**:
    -   The application shall provide a distinct button (paperclip icon) to open the device's file gallery.
    -   The application shall provide a distinct button (camera icon) to open the device's camera directly.
    -   The application shall accept common image formats (e.g., JPEG, PNG, WEBP).
    -   The uploaded image will be sent to the Gemini API for analysis.
    -   If the user provides an image without a text prompt, a default prompt ("What plant is this and how do I care for it?") will be used.

### 2.2. Plant Care Instructions

-   **Requirement**: Upon successful plant identification, the AI must provide detailed care instructions.
-   **Acceptance Criteria**:
    -   The AI's response should include the plant's common and scientific names.
    -   Care instructions must cover at least: **Sunlight**, **Watering**, **Soil type**, and **Fertilizer**.
    -   The response should be formatted using Markdown for readability (headings, bold text, lists).

### 2.3. General Gardening Q&A

-   **Requirement**: Users must be able to ask text-only questions related to gardening.
-   **Acceptance Criteria**:
    -   The AI should provide relevant and helpful answers to general gardening queries.
    -   The AI should maintain its persona as a friendly gardening assistant.

### 2.4. Error Handling

-   **Requirement**: The application must gracefully handle errors during API calls or image processing.
-   **Acceptance Criteria**:
    -   If an API call fails, a user-friendly error message will be displayed in the chat window.
    -   If an image cannot be identified, the AI will politely inform the user and suggest trying a different image.

## 3. User Interface (UI) / User Experience (UX)

### 3.1. Main Layout

-   **Header**: A fixed header containing the application name ("Flora") and icon.
-   **Chat Window**: A scrollable view that displays the conversation history. It must auto-scroll to the latest message.
-   **Input Bar**: A fixed footer containing the text input field and action buttons.

### 3.2. Chat Components

-   **User Messages**: Displayed on the right side with a distinct background color (e.g., light green).
-   **Bot Messages**: Displayed on the left side, accompanied by the "Flora" icon, with a different background color (e.g., white).
-   **Image Previews**: User-uploaded images will be shown within their message bubble.
-   **Typing Indicator**: When waiting for an AI response, a typing animation will be displayed to inform the user that the system is processing.

### 3.3. Input Controls

-   **Text Area**: A multi-line text input that expands automatically. Pressing "Enter" sends the message, while "Shift+Enter" creates a new line.
-   **Attach Button**: A paperclip icon that opens the device's file selector.
-   **Camera Button**: A camera icon that opens the device's camera for direct capture.
-   **Send Button**: A paper plane icon that sends the message. It is disabled when no input is present or while a response is loading.
-   **Image Preview**: A small thumbnail of the selected image appears above the input bar with an "x" button to remove it before sending.
-   **Tooltips**: All icon buttons must display a descriptive tooltip on hover to clarify their function (e.g., "Attach image from gallery", "Send message").

## 4. Technical Requirements

-   **Frontend Framework**: React 18+ with TypeScript.
-   **AI Service**: Google Gemini API.
-   **Model**: `gemini-2.5-flash` for its multimodal capabilities and fast responses.
-   **API Communication**: Asynchronous `fetch` calls are made from a dedicated service module (`geminiService.ts`).
-   **Styling**: Tailwind CSS for utility-first styling.

## 5. Non-Functional Requirements

-   **Performance**: The application must feel responsive. API calls should not block the UI. The initial load time should be minimal.
-   **Responsiveness**: The UI must adapt cleanly to various screen sizes, from mobile phones to desktop monitors.
-   **Accessibility**: Interactive elements must have appropriate ARIA labels (e.g., "Attach image from gallery," "Use camera to take a photo"). Semantic HTML should be used where possible.
-   **Offline Functionality**: The application does not require offline functionality. An active internet connection is necessary to communicate with the Gemini API.