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
        const school = yield client_1.default.school.create({
            data: {
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
        console.log("Fake group created:", group);
        const teacher = yield client_1.default.teacher.create({
            data: {
                firstName: "Fake",
                lastName: "Teacher",
                email: "faketeacher@example.com",
                password: "securepassword123",
                groupId: group.id,
            },
        });
        console.log("✅ Fake teacher created:", teacher);
    });
}
createFakeTeacher()
    .catch(console.error)
    .finally(() => client_1.default.$disconnect());
