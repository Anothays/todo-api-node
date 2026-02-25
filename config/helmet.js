import helmet from "helmet";

const helmetMiddleware = helmet(({
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'"],
      },
    },
  }),
);

export { helmetMiddleware };