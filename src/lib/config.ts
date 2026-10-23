// Environment & Integration Configuration
export const config = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  // High-entropy 256-bit service credential for n8n automation suite
  automationServiceKey:
    process.env.AUTOMATION_SERVICE_KEY ||
    'edv_sec_7f9c2d8e4b1a0f3e5d8c6b4a2e9f1d7c0b3a5e8d2c4f6a9b1e3d5c7f0a2b4e6d',
  paystack: {
    publicKey: process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_edvora_sample_public_key',
    // Paystack uses the secret key (sk_test_...) directly for HMAC-SHA512 webhook signature verification
    secretKey: process.env.PAYSTACK_SECRET_KEY || 'sk_test_edvora_sample_secret_key',
  },
  termii: {
    apiKey: process.env.TERMII_API_KEY || 'termii_test_sample_api_key',
    senderId: process.env.TERMII_SENDER_ID || 'EdvoraSch',
    baseUrl: process.env.TERMII_BASE_URL || 'https://api.ng.termii.com',
    // Termii DLR webhooks authenticate via secret token on the webhook URL (?secret=...)
    webhookSecret: process.env.TERMII_WEBHOOK_SECRET || 'edv_termii_sec_9a8b7c6d5e4f3a2b1c0d',
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ',
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
};
