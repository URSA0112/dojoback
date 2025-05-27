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
  console.log("📩 Received req.body:", req.body)

  try {
    const { id, email, fullName, avatarUrl, provider, role } = req.body

    if (!id || !email) {
      res.status(400).json({ error: "❗ 'id' and 'email' are required." })
      return
    }

    // 1️⃣ Ensure default Grade 10 exists
    let grade = await prisma.grade.findFirst({ where: { number: 10 } })
    if (!grade) {
      grade = await prisma.grade.create({ data: { number: 10 } })
      console.log("✅ Created default grade 10")
    }

    // 2️⃣ Ensure default Group B exists under Grade 10
    let group = await prisma.group.findFirst({
      where: { name: "B", gradeId: grade.id },
    })
    if (!group) {
      group = await prisma.group.create({
        data: { name: "B", gradeId: grade.id },
      })
      console.log("✅ Created group B under grade 10")
    }

    // 3️⃣ Check if user exists
    const existingUser = await prisma.testUser.findUnique({
      where: { id },
    })

    if (existingUser) {
      const updated = await prisma.testUser.update({
        where: { id },
        data: {
          email,
          fullName,
          avatarUrl,
          provider,
          role,
          gradeId: grade.id,
          groupId: group.id,
        },
        include: { grade: true, group: true },
      })

      res.status(200).json({
        success: true,
        message: "🔁 Existing user updated",
        updated: true,
        testUser: {
          id: updated.id,
          email: updated.email,
          fullName: updated.fullName,
          avatarUrl: updated.avatarUrl,
          provider: updated.provider,
          role: updated.role,
          grade: updated.grade?.number ?? null,
          group: updated.group?.name ?? null,
          createdAt: updated.createdAt,
          updatedAt: updated.updatedAt,
        },
      })
      return
    }

    // 4️⃣ Create new user
    const created = await prisma.testUser.create({
      data: {
        id,
        email,
        fullName,
        avatarUrl,
        provider,
        role,
        gradeId: grade.id,
        groupId: group.id,
      },
      include: { grade: true, group: true },
    })

    res.status(201).json({
      success: true,
      message: "✅ New user created",
      created: true,
      testUser: {
        id: created.id,
        email: created.email,
        fullName: created.fullName,
        avatarUrl: created.avatarUrl,
        provider: created.provider,
        role: created.role,
        grade: created.grade?.number ?? null,
        group: created.group?.name ?? null,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
      },
    })
    return
  } catch (err) {
    console.error("❌ Failed to create/update user:", err)
    res.status(500).json({
      success: false,
      message: "🚨 Failed to create or update user",
      error: err instanceof Error ? err.message : err,
    })
    return
  }
}


// Send all test users
export const getTestAllUsers = async (req: Request, res: Response) => {
  try {
    console.log("📥 Incoming request to /allTestUsers")

    const testUsers = await prisma.testUser.findMany({
      include: {
        grade: true,
        group: true,
      },
    });

    console.log("✅ Found testUsers:", testUsers.length)

    res.status(200).json(testUsers);
  } catch (err) {
    console.error("❌ Failed to fetch test users:", err);
    res.status(500).json({ error: "Failed to fetch test users" });
  }
}