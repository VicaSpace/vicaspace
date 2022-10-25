/**
 * This file is for the application's config,
 * including environment variables, addition settings.
 */
export default {
  apiUrl: {
    banhmi: process.env.API_URL_BANHMI,
  },
  rtc: {
    minPort: Number(process.env.RTC_MIN_PORT),
    maxPort: Number(process.env.RTC_MAX_PORT),
  },
  database: {
    url: process.env.DATABASE_URL,
  },
};
