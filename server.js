import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import apiRoutes from "./api/routes.js";
import { connectMongo } from "./config/mongo.js";
import errorHandler from "./middleware/errorhandler.js";
import limiter from "./middleware/rateLimiter.js";

dotenv.config();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
  ],
  credentials: true,
};

const app = express();

app.use(limiter);
app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/", apiRoutes);
app.get("/", (req, res) => {
  res.send("ObsidianSip");
});
app.use(errorHandler);

const PORT = process.env.PORT || 4444;

(async () => {
  try {
    await connectMongo();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup error:", err);
    process.exit(1);
  }
})();
