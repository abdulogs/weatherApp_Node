import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sequelize from "./config/db.js";
import api from "./routes/api.js";
import pages from "./routes/pages.js";
import nunjucks from "nunjucks";
import session from "express-session";
import SequelizeStoreInit from "connect-session-sequelize";
import { join } from "path";
import AppendRequest from "./middlewares/request.js"; // Middleware

const SequelizeStore = SequelizeStoreInit(session.Store);
const app = express();

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
      db: sequelize,
    }),
    cookie: { secure: false }, // In production, set this to true
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/static", express.static(join(process.cwd(), "assets")));

nunjucks.configure("templates", {
  autoescape: true,
  express: app,
  watch: true,
});

app.set("view engine", "html");

app.use(AppendRequest);

app.use("/api", api);
app.use("/", pages);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log("Listening at : http://localhost:" + PORT + "/");
  });
});
