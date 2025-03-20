import express, { json, urlencoded } from "express";
import morgan from "morgan";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import config from "./config.js";
import schema from "../graphql/index.js";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

const app = express();

mongoose.connect(process.env.DB_URI);
const mongoDB = mongoose.connection;
mongoDB.on("error", console.error.bind(console, "Connection Error:"));
mongoDB.once("open", () => {
  console.log("Connected to MongoDB...");
});

app.use(morgan("dev"));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);
app.use(
  session({
    saveUninitialized: true,
    resave: false,
    secret: process.env.DB_SESSION_SECRET,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

const startApolloServer = async () => {
  const server = new ApolloServer({
    schema,
  });
  await server.start();

  app.use(
    "/graphql",
    cors({
      origin: config.corsOrigin,
      credentials: true,
    }),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({
        req,
        res,
      }),
    })
  );
};

startApolloServer().catch(console.error);

export default app;
