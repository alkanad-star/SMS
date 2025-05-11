const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// Helper to generate random dates between two dates
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Random data generators
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomGPA() {
  return parseFloat((Math.random() * 3 + 1).toFixed(2)); // GPA between 1.00 and 4.00
}

function getRandomGrade() {
  return parseFloat((Math.random() * 100).toFixed(1));
}

// Main seeding function
async function seed() {
  console.log('Starting database seeding...');

  // Wipe existing data
  await prisma.enrollment.deleteMany({});
  await prisma.class.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.instructor.deleteMany({});
  await prisma.user.deleteMany({});
  
  console.log('Database cleared. Creating new data...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });
  
  console.log('Admin user created');

  // Create Instructors (60)
  const departments = ['Computer Science', 'Mathematics', 'Physics', 'Engineering', 'Business', 'Arts & Humanities'];
  const specialties = ['Databases', 'Web Development', 'Algorithms', 'Networks', 'AI', 'Machine Learning', 'Data Science', 'HCI', 'Graphics', 'Systems'];
  
  const instructors = [];
  for (let i = 1; i <= 60; i++) {
    const firstName = `Instructor${i}First`;
    const lastName = `Instructor${i}Last`;
    instructors.push({
      employeeId: `EMP${10000 + i}`,
      firstName,
      lastName,
      email: `instructor${i}@university.edu`,
      department: getRandomElement(departments),
      dateOfHire: randomDate(new Date(2010, 0, 1), new Date(2023, 0, 1)),
      specialties: Array.from({length: Math.floor(Math.random() * 3) + 1}, () => getRandomElement(specialties)).join(', ')
    });
  }
  
  await prisma.instructor.createMany({ data: instructors });
  console.log('60 instructors created');
  
  // Create Courses (60)
  const courseCategories = ['Core', 'Elective', 'General Education', 'Major Specific', 'Minor'];
  const courseLevels = ['100', '200', '300', '400', '500'];
  
  const courses = [];
  for (let i = 1; i <= 60; i++) {
    const level = getRandomElement(courseLevels);
    const dept = getRandomElement(['CS', 'MATH', 'PHYS', 'ENG', 'BUS', 'HUM']).substring(0, 4);
    courses.push({
      courseCode: `${dept}${level}-${i}`,
      title: `Course ${i} Title`,
      description: `Detailed description for course ${i}`,
      creditHours: Math.floor(Math.random() * 3) + 1,
      category: getRandomElement(courseCategories),
      level: level
    });
  }
  
  await prisma.course.createMany({ data: courses });
  console.log('60 courses created');
  
  // Add prerequisites (done separately due to self-relation)
  const allCourses = await prisma.course.findMany();
  
  for (let i = 20; i < allCourses.length; i++) {
    // Only higher level courses have prerequisites
    if (Math.random() > 0.5) {
      const potentialPrereqs = allCourses.filter(c => 
        c.level < allCourses[i].level && c.id !== allCourses[i].id);
      
      if (potentialPrereqs.length > 0) {
        const prereq = getRandomElement(potentialPrereqs);
        await prisma.course.update({
          where: { id: allCourses[i].id },
          data: { prerequisiteId: prereq.id }
        });
      }
    }
  }
  
  console.log('Course prerequisites set');
  
  // Create Classes (150-200)
  const semesters = ['Fall', 'Spring', 'Summer'];
  const years = [2023, 2024, 2025];
  const rooms = ['A101', 'B201', 'C301', 'D401', 'E501', 'F601', 'G701'];
  const schedules = ['MWF 09:00-10:15', 'MWF 10:30-11:45', 'TR 13:00-14:15', 'TR 14:30-15:45', 'M 18:00-21:00', 'W 18:00-21:00'];
  
  const classes = [];
  let classCount = 0;
  
  for (const course of allCourses) {
    const instructorsForDept = await prisma.instructor.findMany({
      where: {
        OR: [
          { department: course.category === 'Computer Science' ? 'Computer Science' : undefined },
          { department: course.category === 'Mathematics' ? 'Mathematics' : undefined },
          { department: course.category === 'Engineering' ? 'Engineering' : undefined }
        ]
      }
    });
    
    const numClasses = Math.floor(Math.random() * 3) + 1; // 1-3 classes per course
    
    for (let i = 0; i < numClasses; i++) {
      const semester = getRandomElement(semesters);
      const year = getRandomElement(years);
      let startDate, endDate;
      
      switch(semester) {
        case 'Fall':
          startDate = new Date(year, 8, 1); // September
          endDate = new Date(year, 11, 15); // December
          break;
        case 'Spring':
          startDate = new Date(year, 1, 1); // February
          endDate = new Date(year, 4, 15); // May
          break;
        case 'Summer':
          startDate = new Date(year, 5, 1); // June
          endDate = new Date(year, 7, 15); // August
          break;
      }
      
      classCount++;
      
      classes.push({
        classCode: `${course.courseCode}-${semester.substring(0, 1)}${year.toString().substring(2)}-${i+1}`,
        courseId: course.id,
        instructorId: getRandomElement(instructorsForDept).id,
        semester,
        year,
        startDate,
        endDate,
        schedule: getRandomElement(schedules),
        room: getRandomElement(rooms)
      });
    }
  }
  
  await prisma.class.createMany({ data: classes });
  console.log(`${classCount} classes created`);
  
  // Create Students (500+)
  const genders = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
  const majors = ['Computer Science', 'Information Technology', 'Data Science', 'Software Engineering', 
    'Mathematics', 'Physics', 'Electrical Engineering', 'Mechanical Engineering', 'Business Administration',
    'Finance', 'Marketing', 'Psychology', 'Biology', 'Chemistry', 'English', 'History', 'Art', 'Music'];
  
  const students = [];
  for (let i = 1; i <= 560; i++) {
    const firstName = `Student${i}First`;
    const lastName = `Student${i}Last`;
    students.push({
      studentId: `S${100000 + i}`,
      firstName,
      lastName,
      email: `student${i}@university.edu`,
      dateOfBirth: randomDate(new Date(1990, 0, 1), new Date(2005, 0, 1)),
      gender: getRandomElement(genders),
      enrollmentDate: randomDate(new Date(2018, 0, 1), new Date(2024, 0, 1)),
      major: getRandomElement(majors),
      gpa: getRandomGPA()
    });
  }
  
  await prisma.student.createMany({ data: students });
  console.log('560 students created');
  
  // Create Enrollments (lots)
  const allStudents = await prisma.student.findMany();
  const allClasses = await prisma.class.findMany();
  const statuses = ['ENROLLED', 'COMPLETED', 'WITHDRAWN', 'FAILED'];
  
  const enrollments = [];
  const enrollmentSet = new Set(); // To track unique student-class pairs
  
  // Create around 8000 enrollments
  for (let i = 0; i < 8000; i++) {
    const student = getRandomElement(allStudents);
    const classObj = getRandomElement(allClasses);
    const pairKey = `${student.id}-${classObj.id}`;
    
    // Ensure we don't duplicate enrollments
    if (!enrollmentSet.has(pairKey)) {
      enrollmentSet.add(pairKey);
      
      // Determine status and grade based on class end date
      let status = 'ENROLLED';
      let grade = null;
      
      if (classObj.endDate < new Date()) {
        // Class is finished
        const statusRoll = Math.random();
        if (statusRoll < 0.8) {
          status = 'COMPLETED';
          grade = getRandomGrade();
        } else if (statusRoll < 0.9) {
          status = 'WITHDRAWN';
        } else {
          status = 'FAILED';
          grade = getRandomGrade() * 0.5; // Failed grade (below 50)
        }
      }
      
      enrollments.push({
        studentId: student.id,
        classId: classObj.id,
        status,
        grade
      });
    }
  }
  
  await prisma.enrollment.createMany({ data: enrollments });
  console.log(`${enrollments.length} enrollments created`);
  
  console.log('Database seeding completed successfully!');
}

seed()
  .catch(e => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });