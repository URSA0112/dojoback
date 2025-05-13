import express from "express";
import cors from "cors";
import { Request, Response } from "express";
import teacherRoutes from "./routes/teacher";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/teacher", teacherRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
