# Setup Guide for Geo-On-Fire v2

## Quick Start

### 1. Environment Variables Setup

This application requires AI provider API keys to function. Follow these steps:

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Add your API keys to the `.env` file:**

   Open `.env` and add at least ONE of the following API keys:

   ```bash
   # AI Providers (at least one is REQUIRED)
   OPENAI_API_KEY="sk-..."           # Get from: https://platform.openai.com/api-keys
   ANTHROPIC_API_KEY="sk-ant-..."    # Get from: https://console.anthropic.com/
   PERPLEXITY_API_KEY="pplx-..."     # Get from: https://www.perplexity.ai/settings/api

   # Database (REQUIRED)
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

   # Auth (REQUIRED)
   BETTER_AUTH_SECRET="your-32-character-secret-key"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. **Generate secrets for authentication:**
   ```bash
   # Generate a random 32-character secret for BETTER_AUTH_SECRET
   openssl rand -base64 32
   ```

### 2. Getting API Keys

#### OpenAI (Recommended)
- Go to: https://platform.openai.com/api-keys
- Click "Create new secret key"
- Copy the key starting with `sk-`
- Add to `.env`: `OPENAI_API_KEY="sk-..."`

#### Anthropic (Recommended)
- Go to: https://console.anthropic.com/
- Navigate to API Keys
- Create a new key
- Copy the key starting with `sk-ant-`
- Add to `.env`: `ANTHROPIC_API_KEY="sk-ant-..."`

#### Perplexity (Optional)
- Go to: https://www.perplexity.ai/settings/api
- Generate an API key
- Copy the key starting with `pplx-`
- Add to `.env`: `PERPLEXITY_API_KEY="pplx-..."`

### 3. Database Setup

1. **Install PostgreSQL** (if not already installed)
   - macOS: `brew install postgresql`
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Linux: `sudo apt-get install postgresql`

2. **Create a database:**
   ```bash
   createdb geo_on_fire
   ```

3. **Update DATABASE_URL in `.env`:**
   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/geo_on_fire"
   ```

4. **Run migrations:**
   ```bash
   npm run db:migrate
   # or
   pnpm db:migrate
   ```

### 4. Install Dependencies & Run

```bash
# Install dependencies
npm install
# or
pnpm install

# Run development server
npm run dev
# or
pnpm dev
```

The application should now be running at `http://localhost:3000`

---

## Troubleshooting

### Error: "No AI providers configured"

**Symptom:** Analysis shows 0% visibility score

**Cause:** No API keys are configured in your `.env` file

**Solution:**
1. Make sure you have a `.env` file in your project root
2. Add at least one AI provider API key (see step 2 above)
3. Restart your development server

### Error: "Invalid API key"

**Cause:** API key is incorrect or expired

**Solution:**
1. Verify your API key by testing it directly with the provider's API
2. Regenerate a new API key from the provider's dashboard
3. Update your `.env` file with the new key
4. Restart your development server

### Provider-Specific Issues

**OpenAI:**
- Make sure your API key starts with `sk-`
- Ensure you have credits in your OpenAI account
- Check rate limits: https://platform.openai.com/account/rate-limits

**Anthropic:**
- Make sure your API key starts with `sk-ant-`
- Verify your account has access to Claude API
- Check usage: https://console.anthropic.com/settings/usage

**Perplexity:**
- Make sure your API key starts with `pplx-`
- Verify your account status
- Check API docs: https://docs.perplexity.ai/

---

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard:
   - Go to Settings → Environment Variables
   - Add all variables from your `.env` file
   - **Important:** Do NOT commit your `.env` file to git!

### Other Platforms

Make sure to set all environment variables in your platform's dashboard or CLI.

---

## Configuration

### Enable/Disable Providers

Edit `lib/provider-config.ts`:

```typescript
export const PROVIDER_ENABLED_CONFIG: Record<string, boolean> = {
  openai: true,      // Set to false to disable OpenAI
  anthropic: true,   // Set to false to disable Anthropic
  google: false,     // Google Gemini (currently disabled)
  perplexity: true,  // Set to false to disable Perplexity
};
```

---

## Need Help?

- Check the [GitHub Issues](https://github.com/yourusername/geo-on-fire-v2/issues)
- Join our Discord community
- Email support: support@yourapp.com
