import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookioParser from "cookie-parser";

dotenv.config();

import { authRouter } from "./routes/auth";
import { trim } from "./middlewares/trim";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(trim);
app.use(cookioParser());
app.get("/", (_, response) => response.send("Hello World"));
app.use("/api/auth", authRouter);

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
