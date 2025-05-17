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
const client_1 = __importDefault(require("../prisma/client"));
function createFakeTeacher() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const school = yield client_1.default.school.upsert({
                where: { email: "testschool@example.com" },
                update: {},
                create: {
                    name: "Test School",
                    email: "testschool@example.com",
                },
            });
            const grade = yield client_1.default.grade.create({
                data: {
                    number: 1,
                    schoolId: school.id,
                },
            });
            const group = yield client_1.default.group.create({
                data: {
                    name: "a",
                    gradeId: grade.id,
                },
            });
            const teacher = yield client_1.default.teacher.upsert({
                where: { email: "faketeacher@example.com" },
                update: {
                    gradeId: grade.id,
                    groupId: group.id,
                },
                create: {
                    firstName: "Fake",
                    lastName: "Teacher",
                    email: "faketeacher@example.com",
                    emergencyNumber: "12345678",
                    phoneNumber: "11223344",
                    password: "securepassword123",
                    gradeId: grade.id,
                    groupId: group.id,
                },
            });
            console.log("✅ Fake data created:");
            console.log("School ID:", school.id);
            console.log("Grade ID:", grade.id);
            console.log("Group ID:", group.id);
            console.log("Teacher ID:", teacher.id);
        }
        catch (error) {
            console.error("❌ Failed to create fake teacher:", error);
        }
        finally {
            yield client_1.default.$disconnect();
        }
    });
}
createFakeTeacher();
