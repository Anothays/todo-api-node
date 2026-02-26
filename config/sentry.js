/**
 * Sentry instrumentation - must be loaded before any other modules (via node --import ./instrument.mjs).
 * @see https://docs.sentry.io/platforms/javascript/guides/express/install/esm/
 */
import * as Sentry from "@sentry/node";
import "dotenv/config";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
});
