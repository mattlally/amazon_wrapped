# Amazon Wrapped

A client-side web application that analyzes your Amazon order history and creates a Spotify Wrapped-style interactive dashboard. All processing happens entirely in your browser - your data never leaves your device.

## 🚀 New to Coding?

**👉 Start here:** Read [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md) for step-by-step instructions written for complete beginners!

## Features

- 📊 Interactive charts and visualizations
- 🔍 Searchable and sortable transaction table
- 👥 Person assignment via fuzzy matching
- 📈 Monthly spending trends
- 🏷️ Automatic category inference
- 💾 Export filtered data as CSV or summary JSON
- 📱 Fully responsive design
- 🚀 Deployable to GitHub Pages for free

## Tech Stack

- **Vite** + **React** + **TypeScript**
- **Tailwind CSS** for styling
- **PapaParse** for CSV parsing
- **Plotly.js** for interactive charts
- **date-fns** for date handling
- Custom token-set similarity algorithm for fuzzy matching

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone this repository:
```bash
git clone <your-repo-url>
cd amazon-wrapped-web
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## CSV File Format

Your Amazon order history CSV should contain two tables:

1. **Transactions table** (at the top) with columns:
   - `order id`
   - `order url`
   - `items`
   - `to`
   - `date` (YYYY-MM-DD format)
   - `total`
   - `shipping`
   - `shipping_refund`
   - `gift`
   - `tax`
   - `refund`
   - `payments`

2. **Cards table** (at the bottom, after blank rows) with columns:
   - `last_4`
   - `name`

The app will automatically detect and split these tables.

## Deployment to GitHub Pages

### Step 1: Update Vite Config

Before deploying, update the `base` path in `vite.config.ts` to match your repository name:

```typescript
base: process.env.NODE_ENV === 'production' ? '/<YOUR_REPO_NAME>/' : '/',
```

For example, if your repo is `amazon-wrapped-web`, use:
```typescript
base: process.env.NODE_ENV === 'production' ? '/amazon-wrapped-web/' : '/',
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
4. Save the settings

### Step 3: Push to Main Branch

The GitHub Actions workflow will automatically:
- Build your app when you push to `main`
- Deploy it to GitHub Pages

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 4: Access Your Site

After deployment completes (check the Actions tab), your site will be available at:
```
https://<YOUR_USERNAME>.github.io/<YOUR_REPO_NAME>/
```

## How It Works

1. **Upload**: Drag and drop or browse to upload your CSV file
2. **Parse**: The app splits the CSV into transactions and cards tables
3. **Process**: 
   - Removes rows with blank items
   - Normalizes headers and data
   - Parses dates and money values
   - Assigns people using fuzzy matching
   - Infers categories from item descriptions
4. **Visualize**: Interactive charts show spending patterns, trends, and breakdowns
5. **Filter**: Use filters to focus on specific people, date ranges, or metrics
6. **Export**: Download filtered data or summary statistics

## Data Privacy

- **100% client-side**: All processing happens in your browser
- **No backend**: No server, no API calls, no data transmission
- **No tracking**: No analytics, no external services
- **Your data stays local**: The CSV file is never uploaded anywhere

## Development

### Project Structure

```
src/
├── components/       # React components
│   ├── UploadZone.tsx
│   ├── FiltersPanel.tsx
│   ├── KpiCards.tsx
│   ├── Charts.tsx
│   ├── DataTable.tsx
│   └── DebugPanel.tsx
├── utils/           # Utility functions
│   ├── csvSplit.ts
│   ├── normalize.ts
│   ├── money.ts
│   ├── fuzzy.ts
│   ├── derive.ts
│   ├── categorize.ts
│   ├── export.ts
│   └── processData.ts
├── types.ts         # TypeScript interfaces
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Troubleshooting

### Build fails with "base path" errors
- Make sure the `base` path in `vite.config.ts` matches your repository name exactly

### Charts not displaying
- Check browser console for errors
- Ensure Plotly.js loaded correctly

### Person assignment not working
- Verify your cards table has `last_4` and `name` columns
- Check that payment strings contain 4-digit card numbers

### Date parsing issues
- Ensure dates are in YYYY-MM-DD format
- Check for invalid dates in your CSV

## License

MIT

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.
