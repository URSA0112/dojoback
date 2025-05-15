import express from "express";
import { addStudent, getTeacherWithStudents } from "../controllers/studentController";


const router = express.Router();

router
  .post("/add-student", addStudent)
  .get("/:teacherId/students", getTeacherWithStudents);

export default router;
