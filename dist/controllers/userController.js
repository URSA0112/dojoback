"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestAllUsers = exports.instantCreateUser = exports.createUser = exports.getAllUsers = exports.checkUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../prisma/client"));
// 📌 CHECK User (LOGIN)
const checkUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await client_1.default.user.findFirst({
            where: { email, password },
        });
        if (!user) {
            res.status(401).json({ error: "❌ Invalid credentials" });
            return;
        }
        const payload = {
            userId: user.id,
            role: user.role,
            id: user.role === "teacher"
                ? user.teacherId
                : user.role === "student"
                    ? user.studentId
                    : user.role === "parent"
                        ? user.parentId
                        : undefined,
        };
        if (!payload.id) {
            res.status(400).json({ error: "❌ Profile ID not linked for this user" });
            return;
        }
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h",
        });
        res.status(200).json({
            message: user.role,
            token,
            ...payload,
        });
    }
    catch (err) {
        console.log("❌ Login error:", err.response.data);
        res.status(500).json({ message: "❌ Failed to check user", error: err });
    }
};
exports.checkUser = checkUser;
// 📌 GET ALL Users
const getAllUsers = async (req, res) => {
    try {
        const users = await client_1.default.user.findMany();
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};
exports.getAllUsers = getAllUsers;
//Create User ➕
const createUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const user = await client_1.default.user.create({
            data: { email, password, role },
        });
        res.status(201).json(user);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to create user" });
    }
};
exports.createUser = createUser;
//instant create user 4 button with role TESTUSER
const instantCreateUser = async (req, res) => {
    console.log("📩 Received req.body:", req.body);
    try {
        const { id, email, fullName, avatarUrl, provider, role } = req.body;
        if (!id || !email) {
            res.status(400).json({ error: "❗ 'id' and 'email' are required." });
            return;
        }
        // 1️⃣ Ensure default Grade 10 exists
        let grade = await client_1.default.grade.findFirst({ where: { number: 10 } });
        if (!grade) {
            grade = await client_1.default.grade.create({ data: { number: 10 } });
            console.log("✅ Created default grade 10");
        }
        // 2️⃣ Ensure default Group B exists under Grade 10
        let group = await client_1.default.group.findFirst({
            where: { name: "B", gradeId: grade.id },
        });
        if (!group) {
            group = await client_1.default.group.create({
                data: { name: "B", gradeId: grade.id },
            });
            console.log("✅ Created group B under grade 10");
        }
        // 3️⃣ Check if user exists
        const existingUser = await client_1.default.testUser.findUnique({
            where: { id },
        });
        if (existingUser) {
            const updated = await client_1.default.testUser.update({
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
            });
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
            });
            return;
        }
        // 4️⃣ Create new user
        const created = await client_1.default.testUser.create({
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
        });
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
        });
        return;
    }
    catch (err) {
        console.error("❌ Failed to create/update user:", err);
        res.status(500).json({
            success: false,
            message: "🚨 Failed to create or update user",
            error: err instanceof Error ? err.message : err,
        });
        return;
    }
};
exports.instantCreateUser = instantCreateUser;
// Send all test users
const getTestAllUsers = async (req, res) => {
    try {
        console.log("📥 Incoming request to /allTestUsers");
        const testUsers = await client_1.default.testUser.findMany({
            include: {
                grade: true,
                group: true,
            },
        });
        console.log("✅ Found testUsers:", testUsers.length);
        res.status(200).json(testUsers);
    }
    catch (err) {
        console.error("❌ Failed to fetch test users:", err);
        res.status(500).json({ error: "Failed to fetch test users" });
    }
};
exports.getTestAllUsers = getTestAllUsers;
//# sourceMappingURL=userController.js.map