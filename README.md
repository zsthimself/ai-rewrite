# AI Writer

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## About

AI Writer is an AI-powered writing assistant application that provides various text processing features, including:

- Text Paraphraser
- Text Summarizer
- Grammar Checker
- More features in development...

## Technologies Used

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Clerk (Authentication)
- Supabase (Database)
- OpenRouter API (AI text generation)

## Setup & Configuration

### Prerequisites

- Node.js 18.0.0 or later
- npm, yarn, or pnpm

### Environment Variables

Copy the `.env.example` file to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

You'll need to set up:

1. **Clerk Authentication**
   - Create an account at [Clerk](https://clerk.dev/)
   - Create a new application
   - Get your Publishable Key and Secret Key
   - Add them to your `.env.local` file

2. **Supabase Database**
   - Create an account at [Supabase](https://supabase.com/)
   - Create a new project
   - Get your URL and Anon Key
   - Add them to your `.env.local` file

3. **OpenRouter API**
   - Register at [OpenRouter](https://openrouter.ai/)
   - Create an API key
   - Add it to your `.env.local` file as `NEXT_PUBLIC_OPENROUTER_API_KEY`

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## License

MIT
