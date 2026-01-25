# ✨ Vibe Prompt Builder

> **Craft the perfect prompt with the power of next-gen AI.**

Vibe Prompt Builder is a futuristic browser extension designed to elevate your prompt engineering workflow. By harnessing the capabilities of hypothetical 2026 AI models, it transforms raw ideas into high-fidelity, professional prompts instantly.

## 🚀 Overview

Gone are the days of manual iteration. **Vibe Prompt Builder** integrates directly into your browser, offering a sleek, glassmorphic interface that feels as good as it looks. Whether you're a developer, writer, or researcher, this tool adapts to your needs with specific AI personalities.

---

## ✨ The Vibe Personalities

The core of Vibe Prompt Builder lies in its three distinct AI engines, each "fine-tuned" for specific prompting styles. These personalities ensure you get the exact "vibe" you need for your task.

### 🧠 The Architect (OpenAI GPT-5.2)
*The Flagship Powerhouse*
- **Role**: Structural optimization and logic.
- **Vibe**: Precise, balanced, and professional.
- **Best For**: Complex coding tasks, system architecture design, and logical reasoning.
- **Under the Hood**: powered by the hypothetical `gpt-5.2` model.

### 🎭 The Philosopher (Anthropic Claude 4.5 Sonnet)
*The Nuanced Thinker*
- **Role**: Contextual depth and safety.
- **Vibe**: thoughtful, detailed, and highly articulate.
- **Best For**: Creative writing, ethical guidelines, and long-form content generation.
- **Under the Hood**: powered by `claude-4.5-sonnet`.

### ⚡ The Sprinter (Google Gemini 2.5 Flash)
*The Rapid Iterator*
- **Role**: Speed and efficiency.
- **Vibe**: Concise, direct, and multimodal-ready.
- **Best For**: Quick ideas, brainstorming sessions, and rapid prototyping.
- **Under the Hood**: powered by `gemini-2.5-flash`.

---

## 🎛️ AI Fine-Tuning Specs

We believe in transparency. Here is exactly how we have fine-tuned the AI agents to serve you better:

| Provider | Model | Temperature | Max Tokens | System Instruction |
| :--- | :--- | :--- | :--- | :--- |
| **OpenAI** | `gpt-5.2` | `0.7` (Balanced) | Auto | "Optimize raw input into professional, high-fidelity prompt." |
| **Anthropic** | `claude-4.5-sonnet` | Dynamic | `1024` | "Return ONLY the improved prompt, no conversational filler." |
| **Gemini** | `gemini-2.5-flash` | Dynamic | Auto | Multi-part content generation. |

> **Note**: All agents share a core System Prompt designed to strip away conversational filler and focus purely on **optimization**.

---

## 💎 Features

- **Glassmorphism UI**: A stunning, modern interface with blur effects and smooth transitions (`motion/react` ready).
- **Privacy First (BYOK)**: **Bring Your Own Key**. Your API keys are stored locally in your browser (`chrome.storage.local`). We never see them.
- **Prompt Library**: Organize your prompts with tags, favorites, and custom groups (Coding, Writing, etc.).
- **One-Click Export**: Copy to clipboard or export your polished prompts instantly.
- **Dark Mode Native**: Designed from the ground up for dark mode lovers.

---

## 🛠️ Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/aditya452007/Vibe-Artifacts.git
    cd Vibe-Artifacts/Vibe-Prompt-Builder
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Build the Extension**:
    ```bash
    npm run build
    ```
    *This will create a `dist` folder.*

4.  **Load in Browser**:
    - Open Chrome/Edge and go to `chrome://extensions`.
    - Enable **Developer Mode** (top right).
    - Click **Load unpacked**.
    - Select the `Vibe-Prompt-Builder/dist` folder.

---

## 🎮 Usage Guide

1.  **Open the Extension**: Click the Vibe icon in your toolbar.
2.  **Configure Keys**: Click the ⚙️ (Settings) icon. Enter your API keys for OpenAI, Anthropic, or Gemini.
3.  **Select Your Vibe**: Choose your default provider in settings.
4.  **Build a Prompt**:
    - Click **+ New Prompt**.
    - Enter your raw idea (e.g., "make a python script for scraping").
    - The AI will optimize it into a detailed prompt.
    - Save it with tags (e.g., `coding`, `python`).
5.  **Organize**: Use the Sidebar to filter by Groups or Favorites.

---

## 🤝 Contributing

We welcome fellow Vibe creators! Please read our [CONTRIBUTING.md](../CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

<p align="center">
  Built with ❤️ and 🤖 by Aaditya
</p>
