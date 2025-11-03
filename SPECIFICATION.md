# Flora Navigator: Application Specification

## 1. Overview

Flora Navigator is an AI-powered web application designed for gardening enthusiasts. It provides a mobile-first, conversational interface to help users identify plants, diagnose plant health problems, and get detailed care instructions. The application leverages Google's Gemini API for its powerful multimodal AI capabilities.

## 2. Core Features

### 2.1. Application Flow
The application is designed with a clear, two-stage flow to enhance user experience.

#### 2.1.1. Landing Page
-   **Purpose**: The initial screen that provides a clear, visually engaging entry point into the app's core functionalities.
-   **Components**:
    -   Application logo and a "Hello, Gardener!" greeting.
    -   A large, interactive "hero" card for "Identify Plant" featuring a background image.
    -   Two smaller, distinctively colored cards for "Diagnose Problem" and "Care Guide".
-   **Behavior**:
    -   Tapping any of the three cards transitions the user to the Chat View, pre-set to the corresponding mode (`identify`, `diagnose`, or `care`).
    -   The user is not automatically prompted to upload a file, allowing them to start the conversation by typing if they prefer.

#### 2.1.2. Chat View
-   **Purpose**: The main interactive screen where the user communicates with the AI.
-   **Layout**:
    -   **Header**: Displays the application logo and the current mode's title (e.g., "Identify"). The title color dynamically changes based on the mode. Includes a theme (light/dark) toggle.
    -   **Chat Window**: A scrollable view of the conversation. User message bubbles are color-coded to match the current mode's theme.
    -   **Input Bar**: A text area for user input, with buttons for attaching files, using the camera, and sending the message. The placeholder text, focus ring, and send button colors are themed according to the current mode.
    -   **Navigation Bar**: A fixed bar at the bottom of the screen for easy navigation.

### 2.2. Navigation Bar
-   **Purpose**: Allows for quick switching between different modes and returning to the landing page.
-   **Buttons**:
    -   **Home**: Returns the user to the Landing Page.
    -   **Identify**: Switches to the plant identification mode.
    -   **Diagnose**: Switches to the problem diagnosis mode.
    -   **Care**: Switches to the care instructions mode.
-   **Behavior**:
    -   The icon for the currently active mode is highlighted with a background color that matches the mode's theme.
    -   Switching modes clears the current chat history to provide a clean context for the new conversation.

### 2.3. AI Modes & Personas
The AI, "Flora," adopts a different persona based on the selected mode to provide specialized responses. See `AGENTS.md` for detailed system instructions.

-   **Identify Mode**: Flora acts as a plant identification expert.
-   **Diagnose Mode**: Flora acts as a plant pathologist.
-   **Care Mode**: Flora acts as a master gardener.

### 2.4. User Inputs
-   **Text**: Users can type questions or descriptions in the input bar.
-   **Image**: Users can upload an image file or take a new photo with their device's camera.

### 2.5. AI Responses
-   **Text**: Responses are formatted using Markdown for better readability (headings, lists, bold text).
-   **Real-time Feedback**: A "typing" indicator is shown while the AI is processing a response.

## 3. Technical Details

-   **Frontend Framework**: React with TypeScript.
-   **Styling**: Tailwind CSS for a responsive, utility-first design.
-   **AI Model**: Google Gemini (`gemini-2.5-flash`) for its multimodal chat capabilities.
-   **Permissions**: The app requests camera permissions when the user chooses to take a photo.

## 4. Accessibility & Design
-   **Responsive Design**: The interface is optimized for mobile devices but is functional on desktops.
-   **Dynamic Theming**: The app uses a dynamic color system. The UI for each mode (`identify`, `diagnose`, `care`) has a unique color palette (blue, teal, green respectively) applied to headers, buttons, and chat bubbles for strong visual cohesion.
-   **Dark Mode**: A theme toggle allows users to switch between light and dark modes for user comfort.
-   **ARIA Attributes**: Buttons and inputs include appropriate ARIA labels for screen reader compatibility.
