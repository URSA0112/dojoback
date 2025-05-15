import express from "express";
import { Request, Response } from "express";
import prisma from "../prisma/client";

export const addStudent = async (req: Request,res: Response)=> {
  const student = req.body.studentId;
  const { firstName, lastName, email, phoneNumber, emergencyNumber } = req.body;

// ⚠️ Сурагчийн ID-г өөрөө өгөхгүй — шинэ сурагч бүрт Prisma автоматаар шинэ ID үүсгэнэ
 // 🤔 Төсөөл дөө, хамгийн анхны сурагч нэмэх гэж байхад — ямар ID-г нь хаанаас олох юм бэ?

  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      res.status(404).json({ error: "student not found" });
      return;
    }

    const student = await prisma.student.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        emergencyNumber,
        studentId: student.id,
        groupId: student.groupId,
      },
    });

    res.status(201).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add student" });
  }
};

export const getstudentWithStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { studentId } = req.params;

  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        students: true,
      },
    });

    if (!student) {
      res.status(404).json({ error: "student not found" });
      return;
    }

    res.status(200).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch student and students" });
  }
};
