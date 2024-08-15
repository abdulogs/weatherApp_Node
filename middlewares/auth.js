import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({
      msg: "No token, authorization denied"
    });
  }

  try {
    const decoded = jwt.verify(token, "weather");
    req.user = await User.findByPk(decoded.user.id);
    next();
  } catch (err) {
    res.status(401).json({
      msg: "Token is not valid"
    });
  }
};

async function isloggedIn(request, resposne, next) {
  if (request.session.auth == undefined) {
    next();
  } else {
    resposne.redirect("/");
  }
}

async function isloggedOut(request, resposne, next) {
  if (request.session.auth == undefined) {
    resposne.redirect("/login");
  } else {
    next();
  }
}

export {
  isloggedIn,
  isloggedOut
};