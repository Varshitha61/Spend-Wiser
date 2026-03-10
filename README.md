# SpendWiser

## Overview
SpendWiser is a web application designed to help users track and analyze their personal expenses. It provides intuitive visualizations, budgeting tools, and insights to promote better financial habits.

## Features
- Dashboard with expense summaries
- Categorization of transactions
- Interactive charts and graphs
- Budget planning and alerts
- Export data to CSV/Excel

## Technical Architecture
SpendWiser is a modern Single Page Application (SPA) built with React and TypeScript, ensuring type safety and code maintainability. It utilizes a component-based architecture with hooks for efficient state management. The application features a responsive design implemented with Tailwind CSS, adapting seamlessly to various screen sizes. Data persistence is handled via the browser's LocalStorage, offering a lightweight, offline-capable solution for storing user transaction data. Furthermore, the application integrates with Google's Gemini AI to analyze spending patterns and generate personalized financial insights, providing users with intelligent feedback on their financial habits.

## Technology Stack
- **Frontend Framework:** React 19
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI Integration:** Google Gemini AI SDK
- **Icons:** Lucide React
- **Visualization:** Recharts
- **State Management:** React Hooks (Context/Local State)
- **Data Storage:** LocalStorage API

## Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/spendwiser.git

# Navigate to the project directory
cd spendwiser

# Install dependencies (Node.js required)
npm install
```

## Running the Application
```bash
# Start the development server
npm run dev
```

Open your browser and navigate to `http://localhost:3000` to view the app.

## Building for Production
```bash
npm run build
npm start
```

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes
4. Push to your fork and open a Pull Request

## License
This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.
