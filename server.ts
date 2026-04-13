import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import multer from "multer";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const SECRET_KEY = "ml-insight-pro-secret"; 

app.use(express.json());
app.use(cookieParser());

// In-memory user store
const users = [
  { email: "admin@example.com", name: "Admin User", password: "password" },
  { email: "mrraghunandhan2006@gmail.com", name: "Raghu", password: "password" }
];

app.post("/api/register", (req, res) => {
  const { email, name, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }
  const newUser = { email, name, password };
  users.push(newUser);
  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
  res.cookie("token", token, { httpOnly: true });
  res.json({ success: true, user: { email, name } });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true });
    return res.json({ success: true, user: { email: user.email, name: user.name } });
  }
  res.status(401).json({ success: false, message: "Invalid credentials" });
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

app.get("/download-zip", (req, res) => {
  const filePath = path.join(process.cwd(), "project.zip");
  res.download(filePath, "project.zip", (err) => {
    if (err) {
      res.status(404).send("File not found. Please wait a moment and try again.");
    }
  });
});

const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    let text = "";
    if (req.file.mimetype === "application/pdf") {
      const data = await pdf(req.file.buffer);
      text = data.text;
    } else {
      text = req.file.buffer.toString();
    }

    res.json({ success: true, text, filename: req.file.originalname });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to process document." });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
