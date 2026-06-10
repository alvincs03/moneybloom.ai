# Google OAuth Setup Guide for moneybloom

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click the project dropdown at the top
3. Click "NEW PROJECT"
4. Name it "moneybloom"
5. Click "CREATE"
6. Wait for the project to be created

## Step 2: Enable Google+ API

1. In the Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click on it
4. Click the blue **ENABLE** button
5. Wait for it to enable

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** at the top
3. Select **OAuth client ID**
4. If prompted, configure the OAuth consent screen first:
   - Click "Configure Consent Screen"
   - Choose "External" user type
   - Click "CREATE"
   - Fill in required fields:
     - App name: "moneybloom"
     - User support email: your email
     - Developer contact: your email
   - Click "SAVE AND CONTINUE" through all screens
5. Back to OAuth credentials, select **Web application**
6. Give it a name: "moneybloom-web"
7. Under "Authorized redirect URIs", add:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (for production)
8. Click **CREATE**
9. Copy your **Client ID** and **Client Secret**

## Step 4: Set Up Environment Variables

1. Create `.env.local` file in your project root (copy from `.env.example`):
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=[generate one below]
   GOOGLE_CLIENT_ID=[paste your Client ID]
   GOOGLE_CLIENT_SECRET=[paste your Client Secret]
   ```

2. Generate NEXTAUTH_SECRET:
   - Run: `openssl rand -base64 32`
   - Or use: https://generate-secret.vercel.app/32
   - Paste the result into `.env.local`

3. **DO NOT commit `.env.local`** - it contains secrets!

## Step 5: Test Locally

1. Run your app: `npm run dev`
2. Go to http://localhost:3000/signin
3. Click "Google" button
4. You should be redirected to Google login
5. After login, you should be redirected back to dashboard

## Troubleshooting

### "redirect_uri_mismatch" error
- Make sure your redirect URI in Google Cloud matches exactly:
  - For local: `http://localhost:3000/api/auth/callback/google`
  - Check for typos and extra slashes

### Session not persisting
- Make sure `NEXTAUTH_SECRET` is set
- Make sure `NEXTAUTH_URL` matches your domain
- Check browser console for errors

### "Client not authenticated" error
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Make sure `.env.local` is loaded (restart `npm run dev`)

## Production Deployment

When deploying to production:

1. Update Google Cloud credentials with production redirect URI:
   - `https://yourdomain.com/api/auth/callback/google`

2. Set production environment variables:
   - `NEXTAUTH_URL=https://yourdomain.com`
   - `NEXTAUTH_SECRET=[secure random string]`
   - `GOOGLE_CLIENT_ID=[your ID]`
   - `GOOGLE_CLIENT_SECRET=[your secret]`

3. Never commit `.env.local` or secrets to version control

## Adding More Providers (Future)

NextAuth supports many providers:
- GitHub: `import GitHub from "next-auth/providers/github"`
- Microsoft: `import AzureAD from "next-auth/providers/azure-ad"`
- Discord: `import Discord from "next-auth/providers/discord"`

Just add to the `providers` array in `app/api/auth/[...nextauth]/route.ts`
