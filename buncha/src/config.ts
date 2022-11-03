/**
 * This file is for the application's config,
 * including environment variables, addition settings.
 */
export default {
  app: {
    env: process.env.NODE_ENV,
    port: Number(process.env.APP_PORT),
    host: process.env.APP_HOST,
    ip: process.env.APP_IP,
  },
  endpoint: {
    banhmiApi: process.env.ENDPOINT_BANHMI_API,
  },
  rtc: {
    minPort: Number(process.env.RTC_MIN_PORT),
    maxPort: Number(process.env.RTC_MAX_PORT),
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  handlerNamespace: {
    spaceSpeaker: 'spaceSpeaker',
    rtc: 'rtc',
  },
};
