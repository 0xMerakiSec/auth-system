import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./db/db.config.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config({
  path: "./env",
});

const app = express();

//middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cors());

connectDB();
//Routes
app.use("/api/v1/auth", authRoutes);

app.listen(process.env.PORT || 8000, () => {
  console.log(
    `server is successfully running on port: ${process.env.PORT} or by default on 8000`
  );
});
