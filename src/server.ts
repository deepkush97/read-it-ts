import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { trim } from "./middlewares/trim";
import { authRoutes } from "./routes/auth";
import { miscRoutes } from "./routes/misc";
import { postRoutes } from "./routes/posts";
import { subRoutes } from "./routes/subs";
import { userRoutes } from "./routes/user";
dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(trim);
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);
app.use(express.static("public"));
app.get("/", (_, response) => response.send("Hello World"));
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/subs", subRoutes);
app.use("/api/misc", miscRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  try {
    await createConnection();
    console.log("Database Connected");
  } catch (error) {
    console.error(error);
  }
});
