import prisma from "../prisma/client";

async function createFakeTeacher() {
  const school = await prisma.school.create({
    data: {
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

  console.log("Fake group created:", group);

  const teacher = await prisma.teacher.create({
    data: {
      firstName: "Fake",
      lastName: "Teacher",
      email: "faketeacher@example.com",
      password: "securepassword123",
      groupId: group.id,
    },
  });

  console.log("✅ Fake teacher created:", teacher);
}

createFakeTeacher()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
