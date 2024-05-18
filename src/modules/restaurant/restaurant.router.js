import { Router } from "express";
import * as controller from "./restaurant.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authentication } from "../../middlewares/authentication.js";

const router = Router();

// 1-get all restaurants
router.get("/", authentication, asyncHandler(controller.getRestaurants));
// 2-get all products in a restaurant
router.get(
  "/:id/products",
  authentication,
  asyncHandler(controller.getProducts)
);
// 3-get a product from a list
router.get(
  "/products/:id",
  authentication,
  asyncHandler(controller.getProduct)
);

// 4-search results as a list of all restaurants that provides this product
router.get("/search", authentication, asyncHandler(controller.searchProduct));

// 5-get distance and directions between your current location and the selected restaurant
router.get("/distance/:id", asyncHandler(controller.getDistance));

// 6- add a product to a restaurant
router.post("/products/:id", asyncHandler(controller.addProduct));

//7- get distance and directions between your current location and the selected restaurant
router.get("/distance/:id", asyncHandler(controller.getDistance));

export default router;
