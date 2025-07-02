# Company Data Platform

A Next.js application for uploading, cleaning, and filtering company data from CSV files.

## Features

- 📁 CSV file upload with drag & drop
- 🤖 AI-powered data cleaning and enrichment using OpenAI
- 🗄️ PostgreSQL database with Supabase
- 🔍 Real-time filtering by country, employee size, and domain
- 📊 Clean table interface for viewing data
- 🚀 Ready for Vercel deployment

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **AI**: OpenAI GPT-3.5-turbo for data enrichment
- **File Processing**: PapaParse for CSV parsing

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd ththroxy
npm install
```

### 2. Set Up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Go to the SQL Editor in your Supabase dashboard
3. Copy and paste the contents of `supabase-schema.sql` and run it
4. Go to Settings > API to get your project URL and keys

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Create an account and get your API key
3. Add it to your `.env.local` file

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

1. **Upload CSV**: Drag and drop a CSV file or click to select one
2. **Data Processing**: The system will automatically clean and enrich the data using AI
3. **View Data**: See all companies in the table below
4. **Filter**: Use the filter inputs to search by country, employee size, or domain

## API Endpoints

- `POST /api/upload` - Upload and process CSV files
- `GET /api/companies` - Get companies with optional filters
- `GET /api/countries` - Get unique countries
- `GET /api/employee-sizes` - Get employee size buckets

## Data Cleaning & Enrichment

The system performs the following data cleaning:

- **Country**: Converts country codes to full names (e.g., "us" → "United States")
- **Domain**: Validates and cleans domain names
- **Employee Size**: Categorizes into predefined buckets
- **AI Enrichment**: Uses OpenAI to improve data quality and fill missing information

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to add all environment variables in your Vercel project settings.

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page
├── components/        # React components
├── lib/              # Utilities and configurations
└── types/            # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT
