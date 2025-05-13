import express from "express";
import {
  addStudent,
  getTeacherWithStudents,
} from "../controllers/teacherController";

const router = express.Router();

router
  .post("/add-student", addStudent)
  .get("/:teacherId/students", getTeacherWithStudents);

export default router;
