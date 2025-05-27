import { TestUser } from './../../node_modules/.prisma/client/index.d';
import { Request, response, Response } from "express"
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";

// 📌 CHECK User (LOGIN)
export const checkUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { email, password },
    });

    if (!user) {
      res.status(401).json({ error: "❌ Invalid credentials" });
      return
    }

    const payload = {
      userId: user.id,
      role: user.role,
      id:
        user.role === "teacher"
          ? user.teacherId
          : user.role === "student"
            ? user.studentId
            : user.role === "parent"
              ? user.parentId
              : undefined,
    };

    if (!payload.id) {
      res.status(400).json({ error: "❌ Profile ID not linked for this user" });
      return
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "2h",
    });

    res.status(200).json({
      message: user.role,
      token,
      ...payload,
    });

  } catch (err: any) {
    console.log("❌ Login error:", err.response.data);
    res.status(500).json({ message: "❌ Failed to check user", error: err });
  }
};

// 📌 GET ALL Users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

//Create User ➕
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body
    const user = await prisma.user.create({
      data: { email, password, role },
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

//instant create user 4 button with role TESTUSER

export const instantCreateUser = async (req: Request, res: Response) => {
  console.log("📩 Received req.body:", req.body);

  try {
    const { id, email, fullName, avatarUrl, provider, role } = req.body;

    if (!id || !email) {
      res.status(400).json({ error: "❗ 'id' and 'email' are required." });
      return
    }

    // 1️⃣ Find or create default Grade 10
    let grade = await prisma.grade.findFirst({ where: { number: 10 } });

    if (!grade) {
      grade = await prisma.grade.create({
        data: { number: 10 },
      });
      console.log("✅ Created default grade 10");
    }

    // 2️⃣ Find or create default Group B for Grade 10
    let group = await prisma.group.findFirst({
      where: { name: "B", gradeId: grade.id },
    });

    if (!group) {
      group = await prisma.group.create({
        data: {
          name: "B",
          gradeId: grade.id,
        },
      });
      console.log("✅ Created group B under grade 10");
    }

    // 3️⃣ Upsert TestUser
    const testUser = await prisma.testUser.upsert({
      where: { id },
      update: {
        email,
        fullName,
        avatarUrl,
        provider,
        role,
        gradeId: grade.id,
        groupId: group.id,
      },
      create: {
        id,
        email,
        fullName,
        avatarUrl,
        provider,
        role,
        gradeId: grade.id,
        groupId: group.id,
      },
      include: {
        grade: true,
        group: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "✅ User created or updated successfully",
      testUser: {
        id: testUser.id,
        email: testUser.email,
        fullName: testUser.fullName,
        avatarUrl: testUser.avatarUrl,
        provider: testUser.provider,
        role: testUser.role,
        grade: testUser.grade?.number ?? null,
        group: testUser.group?.name ?? null,
        createdAt: testUser.createdAt,
        updatedAt: testUser.updatedAt,
      },
    });
  } catch (err) {
    console.error("❌ Failed to create/update user:", err);
    res.status(500).json({
      success: false,
      message: "🚨 Failed to create or update user",
      error: err instanceof Error ? err.message : err,
    });
  }
};