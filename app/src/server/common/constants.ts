const isDevEnv = process.env.NODE_ENV !== 'production';
export const FASTAGENCY_SERVER_URL = isDevEnv
  ? 'http://127.0.0.1:8000'
  : process.env.FASTAGENCY_SERVER_URL || 'https://api.fastagency.ai';
