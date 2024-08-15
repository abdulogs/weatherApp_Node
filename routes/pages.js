import express from "express";
import { isloggedIn, isloggedOut } from "../middlewares/auth.js";
const route = express.Router();

route.get("/", isloggedOut, async (request, response) => {
  response.render("pages/index");
});
route.get("/signup", isloggedIn, async (request, response) => {
  response.render("pages/signup");
});
route.get("/login", isloggedIn, async (request, response) => {
  response.render("pages/login");
});
route.get("/locations", isloggedOut, async (request, response) => {
  response.render("pages/locations");
});
route.get("/logout", async (request, response, next) => {
  request.session.destroy();
  response.redirect("/login");
});

export default route;
