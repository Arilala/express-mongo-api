import express from "express";
import cookieParser from "cookie-parser";
import logger from "./logger/logger.js";
import httpLogger from "./middlewares/http.middlewares.js";
import rateLimitAndTimeout from "./middlewares/rateLimit.middlewares.js";
import path from "path";
import connectToMongoDB from "./db/connectToMongoDB.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";

import "dotenv/config";
import { app, server } from "./socket/socket.js";
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use(httpLogger);
app.use(rateLimitAndTimeout);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

server.listen(PORT, async () => {
  await connectToMongoDB();
  logger.info(`Server Running on  http://localhost:${PORT}`);
});
