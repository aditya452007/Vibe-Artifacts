# Contributing to Git-Aura

First off, thanks for taking the time to contribute! 🎉

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## 🚀 Getting Started

### Prerequisites

You will need the following tools installed on your machine:
- [Node.js](https://nodejs.org/) (Version 18.17 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Git](https://git-scm.com/)

### Development Workflow

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/YOUR_USERNAME/Vibe-Artifacts.git
    cd Vibe-Artifacts/git-aura
    ```
    *(Note: This project is located in the `git-aura` subdirectory of the repo)*

3.  **Install dependencies**:
    ```bash
    npm install
    ```

4.  **Set up Environment Variables**:
    - Copy the example environment file:
        ```bash
        cp .env.local.example .env.local
        ```
    - Open `.env.local` and add your GitHub Token:
        ```env
        GITHUB_TOKEN=your_github_personal_access_token
        ```
    > **Note:** You can generate a token [here](https://github.com/settings/tokens). It needs `read:user` and `repo` (if you want to see private contributions, otherwise public access is fine) scopes.

5.  **Run the development server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 How to Contribute

### Pull Requests

1.  Create a new branch for your feature or fix:
    ```bash
    git checkout -b feature/amazing-feature
    ```
2.  Make your changes.
3.  Ensure your code follows the project's style (we use ESLint).
    ```bash
    npm run lint
    ```
4.  Commit your changes using descriptive commit messages.
5.  Push to your fork:
    ```bash
    git push origin feature/amazing-feature
    ```
6.  Open a Pull Request against the `main` branch of the original repository.

### Coding Guidelines

-   **TypeScript**: We use TypeScript for everything. Please ensure proper typing.
-   **Tailwind CSS**: Use utility classes for styling.
-   **Components**: Keep components small and reusable.
-   **Server Actions**: Use Server Actions (`lib/data-service.ts`) for data fetching to keep credentials secure.

## 🐛 Reporting Bugs

Bugs are tracked as GitHub issues. When filing an issue, please explain the problem and include additional details to help maintainers reproduce the problem:

-   Use a clear and descriptive title for the issue to identify the problem.
-   Describe the exact steps which reproduce the problem in as many details as possible.
-   Provide specific examples to demonstrate the steps.

## 📄 License

By contributing, you agree that your contributions will be licensed under its MIT License.
