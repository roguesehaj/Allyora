# Environment Variables Setup

## OpenRouter API Key Configuration

The chat assistant requires an OpenRouter API key to function.

### Step 1: Get Your API Key

1. Visit [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Sign up or log in to your account
3. Click "Create Key"
4. Copy your API key (it will start with `sk-or-v1-`)

### Step 2: Local Development Setup

1. Create a `.env` file in the root directory of your project
2. Add the following line:
   ```
   VITE_OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
   ```
3. Replace `sk-or-v1-your-actual-api-key-here` with your actual API key
4. Save the file
5. **Restart your development server** (stop with Ctrl+C and run `npm run dev` again)

### Step 3: Vercel Deployment Setup

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Click **Add New**
4. Enter:
   - **Name**: `VITE_OPENROUTER_API_KEY`
   - **Value**: Your OpenRouter API key
   - **Environments**: Select all (Production, Preview, Development)
5. Click **Save**
6. **Redeploy** your application for the changes to take effect

### Important Security Notes

- ⚠️ **Never commit `.env` files to Git**
- The `.gitignore` file excludes `.env` files automatically
- Always use Vercel's environment variables for production
- API keys exposed in frontend code can be seen by anyone - consider using a backend proxy for production

### Testing

After setting up the API key:
1. Restart your dev server
2. Go to the Chat page
3. Send a message - you should get an AI response instead of an error

### Troubleshooting

- **Error: "API key not configured"**
  - Check that your `.env` file is in the root directory
  - Verify the variable name is exactly `VITE_OPENROUTER_API_KEY`
  - Make sure you restarted the dev server after creating/updating `.env`

- **Error: "Invalid API key"**
  - Verify your API key is correct
  - Check that you copied the entire key (they're long)
  - Ensure there are no extra spaces

- **Error: "Insufficient credits"**
  - Add credits to your OpenRouter account
  - Or switch to a free tier model in `src/lib/openrouter.ts`

