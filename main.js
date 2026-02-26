import * as Sentry from "@sentry/node";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

// Sentry error handler: after all routes, before any other error-handling middlewares
Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
  Sentry.logger.info(`App listening on port ${PORT}`, { port: PORT });
});
