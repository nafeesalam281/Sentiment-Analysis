Features
Sentiment Classification: Identifies emotional sentiment in text (Happy, Sad, Neutral)

Interactive Learning: Example sentences and interactive quiz

Dual Analysis Modes: Simple rule-based and AI-powered analysis options

Child-Friendly Interface: Colorful, engaging design suitable for young learners

Educational Content: Helps develop emotional intelligence and text analysis skills

Technology Stack
Frontend: React, Vite

Styling: Tailwind CSS

Build Tool: Vite

Package Manager: npm

Project Structure
text
sentiment-kids/
├── public/                 # Static assets
├── src/
│   ├── api/               # API integration files
│   ├── assets/            # Images and other assets
│   ├── App.css            # Application styles
│   ├── App.jsx            # Main application component
│   ├── index.css          # Global styles
│   └── main.jsx           # Application entry point
├── package.json           # Project dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
└── vite.config.js        # Vite configuration

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
