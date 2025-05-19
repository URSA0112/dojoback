"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllStudents = exports.addStudent = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const addStudent = async (req, res) => {
    try {
        // ✅ 1. Check Authorization header ( check token, token = teacherId , GroupId )
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            res.status(401).json({
                error: "❗ Token is missing. Please login and include the Authorization header like: Bearer <token>",
            });
            return;
        }
        // ✅ 2. Extract token
        const token = authHeader.split(" ")[1];
        // ✅ 3. Decode token
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // ✅ 4. Check user role
        const user = await client_1.default.user.findUnique({
            where: { id: decodedToken.userId },
        });
        if (!user || (user.role !== "teacher" && user.role !== "admin")) {
            res.status(403).json({
                error: "⛔ You are not authorized to add students",
                message: "⛔ Зөвхөн багш эсвэл админ л сурагч нэмэх боломжтой."
            });
            return;
        }
        const teacherId = decodedToken.id;
        // 1. taking teacherId from token
        const teacher = await client_1.default.teacher.findUnique({ where: { id: teacherId }, });
        // 2. finding Teacher by teacherId for groupId
        const groupId = teacher?.groupId; //💎 Group 
        const gradeId = teacher?.gradeId; //💎 Grade (use in 👇🏻 add new student)
        // 3. taking groupId from teacher table
        // ✅ 5. Extract student data
        const { firstName, lastName, email, phoneNumber, emergencyNumber } = req.body;
        if (!teacher || !teacher.groupId || !teacher.gradeId) {
            res.status(400).json({
                error: "❗ Teacher is not assigned to a group, ",
                message: "❗ Зөвхөн ангийн багш л сурагч нэмэх боломжтой. Та бүлэг болон ангид хамааралгүй байна."
            });
            return;
        }
        const newStudent = await client_1.default.student.create({
            data: {
                firstName,
                lastName,
                email,
                phoneNumber,
                emergencyNumber,
                teacherId: teacher.id,
                groupId: teacher.groupId,
                gradeId: teacher.gradeId
            },
        });
        res.status(201).json({
            message: `✅ New Student ${firstName} ${lastName} created`,
            student: newStudent
        });
        return;
    }
    catch (error) {
        console.log("❌ Error adding student:", error);
        if (error.name === "JsonWebTokenError") {
            res.status(401).json({ error: "Invalid token. Please login again." });
        }
        else {
            res.status(500).json({ error: "Failed to add student" });
        }
    }
};
exports.addStudent = addStudent;
// 📌Get All Student 
const getAllStudents = async (req, res) => {
    try {
        const students = await client_1.default.student.findMany({
            include: {
                group: true,
                grade: true,
                teacher: true,
            },
        });
        console.log("📦 All students fetched:", students.length);
        res.status(200).json({ students });
    }
    catch (error) {
        console.log("❌ Failed to fetch students:", error.message);
        res.status(500).json({ error: "Сурагчдын мэдээллийг авахад алдаа гарлаа." });
    }
};
exports.getAllStudents = getAllStudents;
//# sourceMappingURL=studentController.js.map