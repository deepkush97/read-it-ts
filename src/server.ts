import cookioParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { trim } from "./middlewares/trim";
import { authRoutes } from "./routes/auth";
import { postRoutes } from "./routes/posts";
import { subRoutes } from "./routes/subs";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(trim);
app.use(cookioParser());
app.use(cors());
app.get("/", (_, response) => response.send("Hello World"));
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/subs", subRoutes);

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
