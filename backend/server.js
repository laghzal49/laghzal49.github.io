import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import projectRoutes from "./routes/projects.js";
import contactRoutes from "./routes/contact.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "../")));

// API Routes
app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Serve HTML files for SPA routing
app.get("/:page", (req, res) => {
  const validPages = ["index", "about", "projects", "contact"];
  const page = req.params.page.replace(/\.html?$/i, "");

  if (validPages.includes(page)) {
    res.sendFile(path.join(__dirname, `../${page}.html`));
  } else {
    res.sendFile(path.join(__dirname, "../index.html"));
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║         🚀 Portfolio Backend Running                   ║
║         🔗 http://localhost:${PORT}                         ║
║         📡 API: http://localhost:${PORT}/api            ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
});
