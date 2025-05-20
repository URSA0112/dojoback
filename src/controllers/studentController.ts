import { Request, Response } from "express";
import prisma from "../prisma/client";
import jwt from "jsonwebtoken";

export const addStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // ✅ 1. Check Authorization header ( check token, token = teacherId , GroupId )
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      res.status(401).json({
        error:
          "❗ Token is missing. Please login and include the Authorization header like: Bearer <token>",
      });
      return;
    }

    // ✅ 2. Extract token
    const token = authHeader.split(" ")[1];

    // ✅ 3. Decode token
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as {
      userId: string;
      role: string;
      id: string;
      // ❗️ For type safety TS
    };

    // ✅ 4. Check user role
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
    });

    if (!user || (user.role !== "teacher" && user.role !== "admin")) {
      res.status(403).json({
        error: "⛔ You are not authorized to add students",
        message: "⛔ Зөвхөн багш эсвэл админ л сурагч нэмэх боломжтой.",
      });
      return;
    }

    const teacherId = decodedToken.id;
    // 1. taking teacherId from token
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
    });
    // 2. finding Teacher by teacherId for groupId
    const groupId = teacher?.groupId; //💎 Group
    const gradeId = teacher?.gradeId; //💎 Grade (use in 👇🏻 add new student)
    // 3. taking groupId from teacher table

    // ✅ 5. Extract student data

    const { firstName, lastName, email, phoneNumber, emergencyNumber } =
      req.body;
    if (!teacher || !teacher.groupId || !teacher.gradeId) {
      res.status(400).json({
        error: "❗ Teacher is not assigned to a group, ",
        message:
          "❗ Зөвхөн ангийн багш л сурагч нэмэх боломжтой. Та бүлэг болон ангид хамааралгүй байна.",
      });
      return;
    }

    const newStudent = await prisma.student.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        emergencyNumber,
        teacherId: teacher.id,
        groupId: teacher.groupId,
        gradeId: teacher.gradeId,
        user: {
          create: {
            email,
            password: "student1234",
            role: "student",
          },
        },
      },
      include: {
        user: true,
      },
    });

    res.status(201).json({
      message: `✅ New Student ${firstName} ${lastName} created`,
      student: newStudent,
    });
    return;
  } catch (error: any) {
    console.log("❌ Error adding student:", error);
    if (error.name === "JsonWebTokenError") {
      res.status(401).json({ error: "Invalid token. Please login again." });
    } else {
      res.status(500).json({ error: "Failed to add student" });
    }
  }
};

// 📌Get All Student
export const getAllStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const students = await prisma.student.findMany({
      include: {
        group: true,
        grade: true,
        teacher: true,
      },
    });

    console.log("📦 All students fetched:", students.length);

    res.status(200).json({ students });
  } catch (error: any) {
    console.log("❌ Failed to fetch students:", error.message);
    res
      .status(500)
      .json({ error: "Сурагчдын мэдээллийг авахад алдаа гарлаа." });
  }
};
