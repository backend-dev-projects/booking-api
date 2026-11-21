import { Router } from "express";
import { CustomersController } from "./customers.controller.js";
import {
  Delete,
  Get,
  Patch,
  Post,
} from "../../shared/http/routing/registers.routing.js";

export const customersRouter = Router();

const controller = new CustomersController();

Get(customersRouter, "/customers", controller, controller.listCustomers);

Post(customersRouter, "/customers", controller, controller.createCustomer);

Patch(
  customersRouter,
  "/customers/:id_customer",
  controller,
  controller.updateCustomer,
);

Delete(
  customersRouter,
  "/customers/:id_customer",
  controller,
  controller.deleteCustomer,
);
