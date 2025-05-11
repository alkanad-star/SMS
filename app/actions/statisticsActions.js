'use server'

import * as statisticsRepo from '@/lib/repository/statisticsRepository';

export async function getStudentsByYear() {
  try {
    return await statisticsRepo.getStudentsByEnrollmentYear();
  } catch (error) {
    console.error('Error fetching students by year:', error);
    throw error;
  }
}

export async function getStudentsByMajor() {
  try {
    return await statisticsRepo.getStudentsByMajor();
  } catch (error) {
    console.error('Error fetching students by major:', error);
    throw error;
  }
}

export async function getStudentsByGender() {
  try {
    return await statisticsRepo.getStudentsByGender();
  } catch (error) {
    console.error('Error fetching students by gender:', error);
    throw error;
  }
}

export async function getTopCourses(limit = 10) {
  try {
    return await statisticsRepo.getTopCoursesByEnrollment(limit);
  } catch (error) {
    console.error('Error fetching top courses:', error);
    throw error;
  }
}

export async function getEnrollmentsByCategory() {
  try {
    return await statisticsRepo.getEnrollmentsByCategory();
  } catch (error) {
    console.error('Error fetching enrollments by category:', error);
    throw error;
  }
}

export async function getAverageGPAByMajor() {
  try {
    return await statisticsRepo.getAverageGPAByMajor();
  } catch (error) {
    console.error('Error fetching GPA by major:', error);
    throw error;
  }
}

export async function getGradeDistribution() {
  try {
    return await statisticsRepo.getGradeDistribution();
  } catch (error) {
    console.error('Error fetching grade distribution:', error);
    throw error;
  }
}

export async function getCourseSuccessRates() {
  try {
    return await statisticsRepo.getCourseSuccessRates();
  } catch (error) {
    console.error('Error fetching course success rates:', error);
    throw error;
  }
}

export async function getEnrollmentStatusDistribution() {
  try {
    return await statisticsRepo.getEnrollmentStatusDistribution();
  } catch (error) {
    console.error('Error fetching enrollment status distribution:', error);
    throw error;
  }
}

export async function getTopInstructors(limit = 10) {
  try {
    return await statisticsRepo.getTopInstructorsByClassCount(limit);
  } catch (error) {
    console.error('Error fetching top instructors:', error);
    throw error;
  }
}

export async function getEnrollmentTrends() {
  try {
    return await statisticsRepo.getEnrollmentTrendsBySemester();
  } catch (error) {
    console.error('Error fetching enrollment trends:', error);
    throw error;
  }
}

export async function getClassSizeByCategory() {
  try {
    return await statisticsRepo.getAverageClassSizeByCategory();
  } catch (error) {
    console.error('Error fetching class size by category:', error);
    throw error;
  }
}