import express from "express";
import { errorHandler } from "./shared/presentation/middleware/error-handler.middleware.js";
import { resourcesRouter } from "./modules/resources/presentation/resources.routes.js";
import {
  customersRouter,
  publicCustomersRouter,
} from "./modules/customers/presentation/customers.routes.js";
import { reservationsRouter } from "./modules/reservations/reservations.routes.js";

import {
  authRouter,
  publicAuthRouter,
} from "./modules/authentication/auth.routes.js";
import { createSessionMiddleware } from "./modules/authentication/middlewares/session.middleware.js";
import { requireAuth } from "./modules/authentication/middlewares/require-auth.middleware.js";

const prefix = "/api";
const app = express();

app.use(express.json());

// Request middlewares
app.use(createSessionMiddleware());

// Public routes
app.use(prefix, publicAuthRouter);
app.use(prefix, publicCustomersRouter);

// Private middlewares
app.use(prefix, requireAuth);

// Private routes
app.use(prefix, authRouter);
app.use(prefix, customersRouter);
app.use(prefix, resourcesRouter);
app.use(prefix, reservationsRouter);

// Error handling middleware
app.use(errorHandler);

app.listen(3000, () => {
  console.log("API listening on port 3000");
});
