"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.checkUser = void 0;
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
            return res.status(401).json({ error: "❌ Invalid credentials" });
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
            return res.status(400).json({ error: "❌ Profile ID not linked for this user" });
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
        console.error("❌ Login error:", err);
        res.status(500).json({ error: "❌ Failed to check user" });
    }
};
exports.checkUser = checkUser;
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
//# sourceMappingURL=userController.js.map