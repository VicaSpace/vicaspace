export default {
  app: {
    name: process.env.REACT_APP_APP_NAME,
  },
  endpoint: {
    buncha: process.env.REACT_APP_ENDPOINT_BUNCHA_WS ?? '',
    banhmi: process.env.REACT_APP_BACKEND_URL ?? '',
  },
  handlerNamespace: {
    spaceSpeaker: 'spaceSpeaker',
    rtc: 'rtc',
  },
};
