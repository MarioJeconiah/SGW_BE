import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { sequelize } from "./src/models/index.js";

// Import Routes
import authRoutes from "./src/routes/auth.js";
import characterRoutes from "./src/routes/characterRoutes.js";
import weaponRoutes from "./src/routes/weaponRoutes.js";
import postRoutes from "./src/routes/postRoutes.js";
import commentRoutes from "./src/routes/commentRoutes.js";

dotenv.config();

// =======================
//  CORS CONFIG
// =======================
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:5173",
  "https://nama-proyek-frontend-anda.vercel.app" // ganti dengan FE domain Vercel kamu
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
//  ROUTES
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/characters", characterRoutes);
app.use("/api/weapons", weaponRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// =======================
//   DATABASE INITIALIZE
// =======================

let isDatabaseInitialized = false;

async function initDatabase() {
  if (isDatabaseInitialized) return;

  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Neon PostgreSQL");

    await sequelize.sync({ alter: true });
    console.log("📌 Database synced");

    isDatabaseInitialized = true;
  } catch (err) {
    console.error("❌ Database error:", err);
  }
}

// Jalankan init DB di setiap request serverless Vercel
app.use(async (req, res, next) => {
  await initDatabase();
  next();
});

// =======================
//   EXPORT KE VERCEL
// =======================
export default app;
