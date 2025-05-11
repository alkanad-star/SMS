import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getCourses({ page = 1, limit = 10, search = '', category = '', level = '', sortBy = 'courseCode', sortOrder = 'asc' } = {}) {
  const skip = (page - 1) * limit;
  let where = {};
  
  if (search) {
    where = {
      OR: [
        { courseCode: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    };
  }
  
  if (category) {
    where.category = category;
  }
  
  if (level) {
    where.level = level;
  }

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        prerequisite: true,
        followupCourses: true
      }
    }),
    prisma.course.count({ where })
  ]);

  return {
    courses,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function getCourseById(id) {
  return prisma.course.findUnique({
    where: { id: Number(id) },
    include: {
      prerequisite: true,
      followupCourses: true,
      classes: {
        include: {
          instructor: true,
          enrollments: true
        }
      }
    }
  });
}

export async function getCourseByCode(courseCode) {
  return prisma.course.findUnique({
    where: { courseCode },
    include: {
      prerequisite: true,
      followupCourses: true,
      classes: {
        include: {
          instructor: true,
          enrollments: true
        }
      }
    }
  });
}

export async function createCourse(data) {
  return prisma.course.create({ 
    data: {
      ...data,
      prerequisiteId: data.prerequisiteId ? Number(data.prerequisiteId) : null
    } 
  });
}

export async function updateCourse(id, data) {
  return prisma.course.update({
    where: { id: Number(id) },
    data: {
      ...data,
      prerequisiteId: data.prerequisiteId ? Number(data.prerequisiteId) : null
    }
  });
}

export async function deleteCourse(id) {
  return prisma.course.delete({
    where: { id: Number(id) }
  });
}

export async function getClasses({ 
  page = 1, 
  limit = 10, 
  courseId = null, 
  instructorId = null, 
  semester = null, 
  year = null 
} = {}) {
  const skip = (page - 1) * limit;
  let where = {};
  
  if (courseId) {
    where.courseId = Number(courseId);
  }
  
  if (instructorId) {
    where.instructorId = Number(instructorId);
  }
  
  if (semester) {
    where.semester = semester;
  }
  
  if (year) {
    where.year = Number(year);
  }

  const [classes, total] = await Promise.all([
    prisma.class.findMany({
      where,
      skip,
      take: limit,
      include: {
        course: true,
        instructor: true,
        enrollments: {
          include: {
            student: true
          }
        }
      }
    }),
    prisma.class.count({ where })
  ]);

  return {
    classes,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function getClassById(id) {
  return prisma.class.findUnique({
    where: { id: Number(id) },
    include: {
      course: true,
      instructor: true,
      enrollments: {
        include: {
          student: true
        }
      }
    }
  });
}

export async function createClass(data) {
  return prisma.class.create({
    data: {
      ...data,
      courseId: Number(data.courseId),
      instructorId: Number(data.instructorId)
    }
  });
}

export async function updateClass(id, data) {
  return prisma.class.update({
    where: { id: Number(id) },
    data: {
      ...data,
      courseId: data.courseId ? Number(data.courseId) : undefined,
      instructorId: data.instructorId ? Number(data.instructorId) : undefined
    }
  });
}

export async function deleteClass(id) {
  return prisma.class.delete({
    where: { id: Number(id) }
  });
}

export async function getInstructors(options = {}) {
  const { page = 1, limit = 10, search = '', department = '' } = options;
  const skip = (page - 1) * limit;
  let where = {};
  
  if (search) {
    where = {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search, mode: 'insensitive' } }
      ]
    };
  }
  
  if (department) {
    where.department = department;
  }

  const [instructors, total] = await Promise.all([
    prisma.instructor.findMany({
      where,
      skip,
      take: limit,
      include: {
        classes: {
          include: {
            course: true
          }
        }
      }
    }),
    prisma.instructor.count({ where })
  ]);

  return {
    instructors,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}