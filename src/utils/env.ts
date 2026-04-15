/**
 * Environment Variable Validation
 * 
 * Validates required environment variables at startup.
 * Provides clear error messages for missing configuration.
 */

interface EnvConfig {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_DATA_BACKEND?: "supabase" | "enginex";
  VITE_API_URL?: string;
}

function validateEnv(): EnvConfig {
  const required: (keyof EnvConfig)[] = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
  ];

  const missing: string[] = [];

  for (const key of required) {
    if (!import.meta.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map((k) => `  - ${k}`).join('\n')}\n\nPlease check your .env file.`
    );
  }

  return {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_DATA_BACKEND: import.meta.env.VITE_DATA_BACKEND,
    VITE_API_URL: import.meta.env.VITE_API_URL,
  };
}

export const env = validateEnv();
