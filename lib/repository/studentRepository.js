import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getStudents({ page = 1, limit = 10, search = '', sortBy = 'lastName', sortOrder = 'asc' } = {}) {
  const skip = (page - 1) * limit;
  const where = search 
    ? {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { studentId: { contains: search, mode: 'insensitive' } }
        ]
      } 
    : {};

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.student.count({ where })
  ]);

  return {
    students,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function getStudentById(id) {
  return prisma.student.findUnique({
    where: { id: Number(id) },
    include: {
      enrollments: {
        include: {
          class: {
            include: {
              course: true,
              instructor: true
            }
          }
        }
      }
    }
  });
}

export async function getStudentByStudentId(studentId) {
  return prisma.student.findUnique({
    where: { studentId },
    include: {
      enrollments: {
        include: {
          class: {
            include: {
              course: true,
              instructor: true
            }
          }
        }
      }
    }
  });
}

export async function createStudent(data) {
  return prisma.student.create({ data });
}

export async function updateStudent(id, data) {
  return prisma.student.update({
    where: { id: Number(id) },
    data
  });
}

export async function deleteStudent(id) {
  return prisma.student.delete({
    where: { id: Number(id) }
  });
}

export async function enrollStudent(studentId, classId) {
  return prisma.enrollment.create({
    data: {
      studentId: Number(studentId),
      classId: Number(classId),
      status: 'ENROLLED'
    }
  });
}

export async function updateEnrollment(enrollmentId, data) {
  return prisma.enrollment.update({
    where: { id: Number(enrollmentId) },
    data
  });
}

export async function unenrollStudent(enrollmentId) {
  return prisma.enrollment.delete({
    where: { id: Number(enrollmentId) }
  });
}