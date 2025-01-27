# Fatura Fácil 📊

A modern web application for analyzing credit card statements (faturas) with automatic categorization and visual insights.

## Features

- 📄 PDF Statement Upload & Parsing
- 🏷️ Automatic Transaction Categorization
- 📊 Visual Data Analysis
- 📱 Responsive Design
- 🤖 Optional AI-powered categorization

## Tech Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- Recharts
- PDF.js
- OpenAI API (optional)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/fatura-facil.git
cd fatura-facil
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your OpenAI API key (optional):
```bash
VITE_OPENAI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

## Usage

1. Click the "Carregar Fatura" button in the navigation bar
2. Upload your credit card statement PDF
3. View your transactions automatically categorized and visualized in charts
4. Toggle between dark and light modes using the theme switcher

## Features in Detail

### PDF Parsing
The application uses PDF.js to extract transaction data from credit card statements. It supports various Brazilian credit card statement formats.

### Transaction Categorization
Transactions are automatically categorized using:
- Pattern matching for merchant names
- Amount ranges
- Keyword analysis
- Optional AI-powered categorization using OpenAI's GPT-3.5

### Data Visualization
- Bar charts showing spending over time
- Pie charts for category distribution
- Detailed transaction list with category indicators

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Vite](https://vitejs.dev/) for the development environment
- [TailwindCSS](https://tailwindcss.com/) for styling
- [Recharts](https://recharts.org/) for data visualization
- [PDF.js](https://mozilla.github.io/pdf.js/) for PDF parsing
- [OpenAI](https://openai.com/) for AI-powered categorization

The built files will be in the `dist` directory.
