# AI Bench Pro Frontend

## Overview

AI Bench Pro Frontend is a modern, responsive web application for exploring, comparing, and analyzing AI models. It provides interactive dashboards, model leaderboards, detailed model views, and benchmarking tools, all with a focus on usability and performance.

---

## Tech Stack

- **React**  
  Component-based JavaScript library for building user interfaces. Powers the SPA architecture and dynamic UI updates.

- **TypeScript**  
  Superset of JavaScript adding static typing, improving code reliability and developer experience.

- **Vite**  
  Fast build tool and development server for modern web projects. Enables instant hot module replacement and optimized builds.

- **Tailwind CSS**  
  Utility-first CSS framework for rapid UI development and consistent styling, including dark/light mode support.

- **Shadcn/UI**  
  Collection of accessible, customizable React components used for forms, dialogs, navigation, and more.

- **Charting Library**  
  (e.g., Chart.js or similar, as seen in `ui/chart.tsx`)  
  Used for rendering interactive charts and visualizations in benchmarking and comparison pages.

---

## Main Features

- **Model Leaderboard:**  
  Browse and filter top AI models by category, performance, and other metrics.

- **Model Comparison:**  
  Compare multiple models side-by-side with visual charts and detailed stats.

- **Benchmarks:**  
  View and analyze benchmark results with interactive charts.

- **Model Detail View:**  
  Explore comprehensive information about each model, including metrics, descriptions, and usage.

- **Pricing Page:**  
  Transparent pricing information for different tiers and features.

- **Responsive Design:**  
  Fully functional on desktop, tablet, and mobile devices.

- **Dark/Light Mode:**  
  Seamless theme switching for optimal viewing comfort.

---

## Page & Navigation Structure

### 1. Home (`/`)
- **Features:** Hero section, featured models, quick search, and navigation links.
- **Navigation:** Entry point with links to Leaderboard, Benchmarks, Pricing, and Model Comparison.

### 2. Leaderboard (`/leaderboard`)
- **Features:**  
  - Ranked list of models with filters (category, performance, etc.).
  - Preview cards for each model.
- **Navigation:**  
  - Click a model card to view its detail page.

### 3. Model Detail View (`/viewPage/modelView`)
- **Features:**  
  - In-depth model information.
  - Performance metrics, charts, and usage instructions.
  - Option to compare or benchmark the model.
- **Navigation:**  
  - Back to Leaderboard or direct to Model Comparison.

### 4. Model Comparison (`/comparison/modelComparison`)
- **Features:**  
  - Select multiple models to compare.
  - Side-by-side stats and interactive charts.
- **Navigation:**  
  - Add/remove models from comparison.
  - Return to Leaderboard or Model Detail.

### 5. Benchmarks (`/benchmarks`)
- **Features:**  
  - Visualize benchmark results.
  - Filter by model, dataset, or metric.
  - Interactive charts for performance analysis.
- **Navigation:**  
  - Link to Model Detail or Comparison.

### 6. Pricing (`/pricing`)
- **Features:**  
  - Overview of pricing tiers and features.
  - Clear call-to-action for upgrades or contact.

### 7. Not Found (`/404`)
- **Features:**  
  - User-friendly error page for invalid routes.
  - Navigation back to home or main sections.

---

## UI/UX Highlights

- **Dark/Light Mode:**  
  Toggle between themes; persists user preference.

- **Responsive Layout:**  
  Adapts to all screen sizes using Tailwind CSS.

- **Interactive Charts:**  
  Visualize model metrics and benchmarks with dynamic, responsive charts.

- **Advanced Forms:**  
  Accessible, validated forms for search, filtering, and user input.

- **Model Cards & Previews:**  
  Quick-glance information with expandable details.

- **Navigation Bar & Footer:**  
  Consistent, accessible navigation and site-wide links.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/) (if using bun)

### Installation

```bash
# Using npm
npm install

# Or using bun
bun install
```

### Development Server

```bash
# Using npm
npm run dev

# Or using bun
bun run dev
```

- The app will be available at `http://localhost:5173` (default Vite port).

### Building for Production

```bash
# Using npm
npm run build

# Or using bun
bun run build
```

- Output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
# Or
bun run preview
```

---

## Contributing

1. Fork the repository and create a new branch.
2. Make your changes following the existing code style.
3. Submit a pull request with a clear description.

---

## License

This project is licensed under the MIT License.

---

## Contact

For questions or support, please open an issue or contact the maintainers.
