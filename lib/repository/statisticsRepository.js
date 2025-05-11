import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. Total students per year
export async function getStudentsByEnrollmentYear() {
  return prisma.$queryRaw`
    SELECT strftime('%Y', "enrollmentDate") as year, COUNT(*) as count
    FROM "Student"
    GROUP BY year
    ORDER BY year
  `;
}

// 2. Total students per major
export async function getStudentsByMajor() {
  return prisma.$queryRaw`
    SELECT major, COUNT(*) as count
    FROM "Student"
    WHERE major IS NOT NULL
    GROUP BY major
    ORDER BY count DESC
  `;
}

// 3. Students per gender
export async function getStudentsByGender() {
  return prisma.$queryRaw`
    SELECT gender, COUNT(*) as count
    FROM "Student"
    GROUP BY gender
    ORDER BY count DESC
  `;
}

// 4. Top courses by enrollment count
export async function getTopCoursesByEnrollment(limit = 10) {
  return prisma.$queryRaw`
    SELECT c.id, c."courseCode", c.title, COUNT(e.id) as enrollmentCount
    FROM "Course" c
    JOIN "Class" cl ON cl."courseId" = c.id
    JOIN "Enrollment" e ON e."classId" = cl.id
    GROUP BY c.id, c."courseCode", c.title
    ORDER BY enrollmentCount DESC
    LIMIT ${limit}
  `;
}

// 5. Course enrollment by category
export async function getEnrollmentsByCategory() {
  return prisma.$queryRaw`
    SELECT c.category, COUNT(e.id) as enrollmentCount
    FROM "Course" c
    JOIN "Class" cl ON cl."courseId" = c.id
    JOIN "Enrollment" e ON e."classId" = cl.id
    GROUP BY c.category
    ORDER BY enrollmentCount DESC
  `;
}

// 6. Average GPA by major
export async function getAverageGPAByMajor() {
  return prisma.$queryRaw`
    SELECT major, AVG(gpa) as averageGPA, COUNT(*) as studentCount
    FROM "Student"
    WHERE gpa IS NOT NULL AND major IS NOT NULL
    GROUP BY major
    ORDER BY averageGPA DESC
  `;
}

// 7. Grade distribution across all courses
export async function getGradeDistribution() {
  return prisma.$queryRaw`
    SELECT 
      CASE 
        WHEN grade >= 90 THEN 'A'
        WHEN grade >= 80 THEN 'B'
        WHEN grade >= 70 THEN 'C'
        WHEN grade >= 60 THEN 'D'
        ELSE 'F'
      END as gradeLetter,
      COUNT(*) as count
    FROM "Enrollment"
    WHERE grade IS NOT NULL
    GROUP BY gradeLetter
    ORDER BY 
      CASE 
        WHEN gradeLetter = 'A' THEN 1
        WHEN gradeLetter = 'B' THEN 2
        WHEN gradeLetter = 'C' THEN 3
        WHEN gradeLetter = 'D' THEN 4
        WHEN gradeLetter = 'F' THEN 5
      END
  `;
}

// 8. Course success/failure rate
export async function getCourseSuccessRates() {
  return prisma.$queryRaw`
    SELECT 
      c."courseCode", 
      c.title,
      SUM(CASE WHEN e.status = 'COMPLETED' AND e.grade >= 60 THEN 1 ELSE 0 END) as passCount,
      SUM(CASE WHEN e.status = 'FAILED' OR (e.status = 'COMPLETED' AND e.grade < 60) THEN 1 ELSE 0 END) as failCount,
      COUNT(e.id) as totalCount,
      ROUND(SUM(CASE WHEN e.status = 'COMPLETED' AND e.grade >= 60 THEN 1 ELSE 0 END) * 100.0 / COUNT(e.id), 2) as successRate
    FROM "Course" c
    JOIN "Class" cl ON cl."courseId" = c.id
    JOIN "Enrollment" e ON e."classId" = cl.id
    WHERE e.status IN ('COMPLETED', 'FAILED')
    GROUP BY c."courseCode", c.title
    ORDER BY successRate DESC
  `;
}

// 9. Enrollment status distribution
export async function getEnrollmentStatusDistribution() {
  return prisma.$queryRaw`
    SELECT status, COUNT(*) as count
    FROM "Enrollment"
    GROUP BY status
    ORDER BY count DESC
  `;
}

// 10. Top instructors by class count
export async function getTopInstructorsByClassCount(limit = 10) {
  return prisma.$queryRaw`
    SELECT 
      i.id,
      i."firstName" || ' ' || i."lastName" as name,
      i.department,
      COUNT(cl.id) as classCount,
      COUNT(DISTINCT c.id) as uniqueCourseCount
    FROM "Instructor" i
    JOIN "Class" cl ON cl."instructorId" = i.id
    JOIN "Course" c ON c.id = cl."courseId"
    GROUP BY i.id, name, i.department
    ORDER BY classCount DESC
    LIMIT ${limit}
  `;
}

// 11. Enrollment trends by semester
export async function getEnrollmentTrendsBySemester() {
  return prisma.$queryRaw`
    SELECT 
      cl.semester, 
      cl.year, 
      cl.semester || ' ' || cl.year as term,
      COUNT(e.id) as enrollmentCount
    FROM "Class" cl
    JOIN "Enrollment" e ON e."classId" = cl.id
    GROUP BY cl.semester, cl.year, term
    ORDER BY cl.year, 
      CASE 
        WHEN cl.semester = 'Spring' THEN 1
        WHEN cl.semester = 'Summer' THEN 2
        WHEN cl.semester = 'Fall' THEN 3
      END
  `;
}

// 12. Average class size by course category
export async function getAverageClassSizeByCategory() {
  return prisma.$queryRaw`
    SELECT 
      c.category,
      ROUND(AVG(studentCount), 2) as averageClassSize,
      COUNT(cl.id) as classCount
    FROM "Course" c
    JOIN "Class" cl ON cl."courseId" = c.id
    JOIN (
      SELECT "classId", COUNT(*) as studentCount
      FROM "Enrollment"
      GROUP BY "classId"
    ) counts ON counts."classId" = cl.id
    GROUP BY c.category
    ORDER BY averageClassSize DESC
  `;
}