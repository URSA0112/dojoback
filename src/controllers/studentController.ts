import express from "express";
import { Request, Response } from "express";
import prisma from "../prisma/client";

export const addStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const teacherId = req.body.teacherId;
  const { firstName, lastName, email, phoneNumber, emergencyNumber } = req.body;

  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      res.status(404).json({ error: "Teacher not found" });
      return;
    }

    const student = await prisma.student.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        emergencyNumber,
        teacherId: teacher.id,
        groupId: teacher.groupId,
      },
    });

    res.status(201).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add student" });
  }
};

export const getTeacherWithStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { teacherId } = req.params;

  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: {
        students: true,
      },
    });

    if (!teacher) {
      res.status(404).json({ error: "Teacher not found" });
      return;
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch teacher and students" });
  }
};
