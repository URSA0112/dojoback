import express from "express";
import cors from "cors";
import { Request, Response } from "express";
import teacherRoutes from "./routes/teacher";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/teacher", teacherRoutes);

//Энэ бол сервер ажиллаж байгаа эсэхийг шалгах тест 
app.get("/", (req: Request, res: Response) => {
  try{
  res.send("✅ Server running...")}
  catch (error) {
    console.error("Error in root route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server listening at: http://localhost:${PORT}`);
});