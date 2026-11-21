import express from "express";
import { resourcesRouter } from "./modules/resources/resources.routes.js";
import { customersRouter } from "./modules/customers/customers.routes.js";

const prefix = "/api";

const app = express();

app.use(express.json());
app.use(prefix, resourcesRouter);
app.use(prefix, customersRouter);

app.listen(3000, () => {
  console.log("API listening on port 3000");
});
