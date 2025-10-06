/* Lightweight structured logger used across the API. */
type Meta = Record<string, any> | undefined;

function formatMessage(message: any, meta?: Meta) {
  if (meta && Object.keys(meta).length > 0) {
    try {
      return typeof message === 'string' ? `${message} ${JSON.stringify(meta)}` : JSON.stringify({ message, ...meta });
    } catch (e) {
      return typeof message === 'string' ? message : JSON.stringify(message);
    }
  }
  return typeof message === 'string' ? message : JSON.stringify(message);
}
const apiLogger = {
  info(message: any, meta?: Meta) {
    // eslint-disable-next-line no-console
    console.log(formatMessage(message, meta));
  },
  warn(message: any, meta?: Meta) {
    // eslint-disable-next-line no-console
    console.warn(formatMessage(message, meta));
  },
  error(message: any, meta?: Meta) {
    // eslint-disable-next-line no-console
    console.error(formatMessage(message, meta));
  },
  debug(message: any, meta?: Meta) {
    if (process.env['NODE_ENV'] !== 'production') {
      // eslint-disable-next-line no-console
      console.debug(formatMessage(message, meta));
    }
  },
};

export default apiLogger;
export { apiLogger };
export const logger = {
  info: console.log,
  warn: console.warn,
  error: console.error,
};
