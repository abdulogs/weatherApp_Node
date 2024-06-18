import express from "express";
import Auth from "../controllers/Auth.js";
import Location from "../controllers/Location.js";
import authenticate from "../middlewares/auth.js";

const route = express.Router();

// Authentication
route.post("/signup", Auth.signup);
route.post("/login", Auth.login);
route.post("/logout", Auth.logout);
route.get("/auth", authenticate, Auth.authenticate);

// Locations
route.get("/locations", Location.listing);
route.get("/locations/:id", Location.single);
route.post("/locations", Location.create);
route.patch("/locations/:id", Location.update);
route.delete("/locations/:id", Location.destroy);

export default route;
