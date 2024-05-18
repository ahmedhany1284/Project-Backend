import Restaurant from "../../../DB/models/restaurant.model.js";
import Product from "../../../DB/models/product.model.js";

// get all restaurants
export const getRestaurants = async (req, res, next) => {
  const restaurants = await Restaurant.find();
  return res.json({
    success: true,
    results: restaurants,
  });
};

// get all products in each restaurant
export const getProducts = async (req, res, next) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findById(id).populate("products");
  return res.json({
    success: true,
    results: restaurant.products,
  });
};
/*
get distance and directions between your current location and the selected restaurant
export const getDistance = async (req, res, next) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findById(id);
  const { location } = restaurant;
  const { lat, lng } = location.coordinates;
  const { lat: userLat, lng: userLng } = req.query;
  const distance = Math.sqrt(
    Math.pow(lat - userLat, 2) + Math.pow(lng - userLng, 2)
  );
  return res.json({
    success: true,
    results: { distance },
  });
};
*/

//get a product from a list
export const getProduct = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  return res.json({
    success: true,
    results: product,
  });
};

// get list of all restaurants that provides this product
export const searchProduct = async (req, res, next) => {
  const { name } = req.query;
  const product = await Product.findOne({ name: { $regex: new RegExp(name) } });
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  const restaurants = await Restaurant.find({
    products: { $in: [product._id] },
  });
  console.log(restaurants);
  return res.json({
    success: true,
    results: restaurants,
  });
};

// add a new product to a restaurant
export const addProduct = async (req, res, next) => {
  const { id } = req.params;
  const { prodID } = req.body;

  const restaurant = await Restaurant.findOne({ _id: id });
  if (!restaurant) {
    return res
      .status(404)
      .json({ success: false, message: "Restaurant not found" });
  }
  const product = await Product.findById(prodID);
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }
  restaurant.products.push(product._id);
  await restaurant.save();
  return res.json({
    success: true,
    results: product,
  });
};
export const getDistance = async (req, res, next) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findById(id);
  const { location } = restaurant;
  const { lat, lng } = location.coordinates;
  const { lat: userLat, lng: userLng } = req.query;

  const radiusInMeters = 6371e3;
  const restaurantLatitudeInRadians = (lat * Math.PI) / 180;
  const userLatitudeInRadians = (userLat * Math.PI) / 180;
  const differenceInLatitudeInRadians = ((userLat - lat) * Math.PI) / 180;
  const differenceInLongitudeInRadians = ((userLng - lng) * Math.PI) / 180;

  const a =
    Math.sin(differenceInLatitudeInRadians / 2) *
      Math.sin(differenceInLatitudeInRadians / 2) +
    Math.cos(restaurantLatitudeInRadians) *
      Math.cos(userLatitudeInRadians) *
      Math.sin(differenceInLongitudeInRadians / 2) *
      Math.sin(differenceInLongitudeInRadians / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = radiusInMeters * c;

  return res.json({
    success: true,
    results: { distance },
  });
};
