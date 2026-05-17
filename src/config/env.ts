import dotenv from "dotenv";
import path from "path";

// Load .env from backend root before any other config modules run.
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
