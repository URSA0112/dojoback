import prisma from "../prisma/client";

async function createFakeTeacher() {
  try {
    const school = await prisma.school.upsert({
      where: { email: "testschool@example.com" },
      update: {},
      create: {
        name: "Test School",
        email: "testschool@example.com",
      },
    });

    const grade = await prisma.grade.create({
      data: {
        number: 1,
        schoolId: school.id,
      },
    });

    const group = await prisma.group.create({
      data: {
        name: "a",
        gradeId: grade.id,
      },
    });

    const teacher = await prisma.teacher.upsert({
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
  } catch (error) {
    console.log("❌ Failed to create fake teacher:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createFakeTeacher();
