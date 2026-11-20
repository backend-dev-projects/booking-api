import express from "express";
import { resourcesRouter } from "./modules/resources/resources.routes.js";

const app = express();

app.use("/api", resourcesRouter);

app.listen(3000, () => {
  console.log("API listening on port 3000");
});
