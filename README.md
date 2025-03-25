# 1PoundBid Environment Setup

## Environment Variables

The application requires certain environment variables to be set for proper operation. Create a `.env` file in the project root with the following variables:

### Required Variables

```bash
# Supabase Configuration (Required)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Optional Variables

```bash
# ElevenLabs Voice Configuration (Optional)
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
VITE_ELEVENLABS_VOICE_ID=your_voice_id

# Development Configuration (Optional)
NODE_ENV=development
VITE_DEV_MODE=true
```

## Environment Setup Instructions

1. Create a new `.env` file:
   ```bash
   cp env.example .env
   ```

2. Update the `.env` file with your actual values:
   - Get Supabase credentials from your project dashboard
   - Optional: Add ElevenLabs credentials for voice synthesis
   - Set development variables as needed

3. Verify your setup:
   ```bash
   npm run dev
   ```
   The application will validate the configuration on startup.

## Environment Types

- **Development**: Default local development environment
- **Production**: Stricter validation, no debug features
- **Test**: Special configuration for testing environment

## Security Notes

- Never commit the `.env` file to version control
- Keep the example file updated with all required variables
- Use appropriate values for each environment
- Protect sensitive credentials, especially in production

## Troubleshooting

If you encounter environment-related issues:

1. Verify all required variables are set
2. Check for typos in variable names
3. Ensure values are properly formatted
4. Look for configuration validation errors in the console