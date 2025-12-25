# ✨ Git-Aura

> **A Cyberpunk Developer Analytics Dashboard**
> *Visualize your GitHub activity with style, motion, and code.*

![Git-Aura Banner](https://placehold.co/1200x400/000000/00ffff?text=Git-Aura+Analytics)

Git-Aura is a high-performance, visually stunning dashboard that turns your GitHub profile into a cinematic experience. Built with **Next.js 16**, **Tailwind CSS**, and **Framer Motion**, it provides deep insights into your coding habits, presented with a "Vibe Coding" aesthetic.

---

## 🚀 Why Git-Aura?

Developers create value every day, but commit logs are boring. Git-Aura transforms your hard work into a **visual story**.

*   **Cyberpunk Aesthetic**: Ditch the flat white dashboards. Embrace the neon, glassmorphism, and immersive animations.
*   **Deep Insights**: Go beyond the green squares. Analyze your velocity, top languages, commit habits, and developer persona.
*   **Performance First**: Powered by the latest web tech (Next.js 16, React Server Components), it's blazing fast.
*   **Shareable**: Perfect for portfolios, social media bragging rights, or just understanding your own workflow better.

## ⚡ Features

*   **🔥 Heatmap Analysis**: specialized visualization of your contribution intensity.
*   **⚡ Velocity Graph**: Track your commit speed and consistency over time.
*   **📊 Tech Stack Breakdown**: Beautiful bar charts showing your most used languages.
*   **🤖 Developer Persona**: AI-inspired analysis of what kind of developer you are based on your stats.
*   **🧩 Bento Profile**: A clean, grid-based summary of your key metrics.
*   **🎵 Sonic Feedback**: Interactive UI sounds for a tactile feel.

## 🏗️ Architecture

Git-Aura is built on a modern, type-safe stack.

*   **Framework**: Next.js 16 (App Router)
*   **Styling**: Tailwind CSS + Framer Motion
*   **State**: Zustand + TanStack Query
*   **Data**: GitHub GraphQL API via Octokit

👉 **[Read the detailed Architecture documentation](./ARCHITECTURE.md)** to learn about the project structure, data flow, and tech stack.

## 🛠️ Installation & Getting Started

Follow these steps to get Git-Aura running on your local machine.

### Prerequisites

*   **Node.js** (v18.17+ recommended)
*   **npm** or **yarn** or **pnpm**
*   **GitHub Personal Access Token**

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Vibe-Artifacts.git
cd Vibe-Artifacts/git-aura
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment

1.  Create a `.env.local` file in the root of the `git-aura` directory.
2.  Add your GitHub Token. You can generate one [here](https://github.com/settings/tokens) (Fine-grained or Classic).
    *   **Scopes required**: `read:user`, `repo` (for private stats), `read:org` (optional).

```env
GITHUB_TOKEN=ghp_your_secret_token_here
```

### Step 4: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 Usage

1.  On the home page, type in any **GitHub Username** (e.g., `torvalds`, `aditya452007`).
2.  Hit **Enter** or click "Analyze".
3.  Enjoy the show! Navigate through the slides using the on-screen controls or keyboard arrows.

## 🤝 Contributing

We welcome contributions! whether it's fixing bugs, improving the UI, or adding new metrics.

👉 **[Check out our Contributing Guide](./CONTRIBUTING.md)** for details on how to get started.

Please also read our **[Code of Conduct](./CODE_OF_CONDUCT.md)** to ensure a welcoming environment for everyone.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

*Created with ❤️ and ☕ by [aditya452007](https://github.com/aditya452007)*
