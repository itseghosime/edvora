// ==============================================================================
// Edvora School Management — Configuration Registry
// Strictly fails closed if credentials/secrets are missing.
// NEVER falls back to hardcoded production secrets.
// ==============================================================================

export const config = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  // Service credential for n8n automation suite (must be set in environment)
  automationServiceKey: process.env.AUTOMATION_SERVICE_KEY || '',
  paystack: {
    environment: (process.env.PAYSTACK_ENVIRONMENT || 'test') as 'test' | 'live',
    publicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
    secretKey: process.env.PAYSTACK_SECRET_KEY || '',
  },
  termii: {
    apiKey: process.env.TERMII_API_KEY || '',
    senderId: process.env.TERMII_SENDER_ID || 'EdvoraSch',
    baseUrl: process.env.TERMII_BASE_URL || 'https://api.ng.termii.com',
    webhookSecret: process.env.TERMII_WEBHOOK_SECRET || '',
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
};
