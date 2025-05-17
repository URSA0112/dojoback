"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getstudentWithStudents = exports.addStudent = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const addStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const student = req.body.studentId;
    const { firstName, lastName, email, phoneNumber, emergencyNumber } = req.body;
    // ⚠️ Сурагчийн ID-г өөрөө өгөхгүй — шинэ сурагч бүрт Prisma автоматаар шинэ ID үүсгэнэ
    // // 🤔 Төсөөл дөө, хамгийнанхны сурагч нэмэх гэж байхад — ямар ID-г нь хаанаас олох юм бэ?
    try {
        const student = yield client_1.default.student.findUnique({
            where: { id: studentId },
        });
        if (!student) {
            res.status(404).json({ error: "student not found" });
            return;
        }
        const student = yield client_1.default.student.create({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add student" });
    }
});
exports.addStudent = addStudent;
const getstudentWithStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId } = req.params;
    try {
        const student = yield client_1.default.student.findUnique({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch student and students" });
    }
});
exports.getstudentWithStudents = getstudentWithStudents;
