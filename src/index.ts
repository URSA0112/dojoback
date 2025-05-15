import express from "express";
import cors from "cors";
import { Request, Response } from "express";
import studentRoutes from "./routes/student";
import authRoutes from "./routes/auth";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/teacher", studentRoutes);
app.use("/api/v1/auth", authRoutes);

//Энэ бол сервер ажиллаж байгаа эсэхийг шалгах тест 
app.get("/", (req: Request, res: Response) => {
  try {
    res.send("✅ Server running...")
  }
  catch (error) {
    console.error("Error in root route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server listening at: http://localhost:${PORT}`);
});