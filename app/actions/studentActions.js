'use server'

import { revalidatePath } from 'next/cache';
import { 
  createStudent, 
  updateStudent, 
  deleteStudent, 
  enrollStudent, 
  updateEnrollment, 
  unenrollStudent 
} from '@/lib/repository/studentRepository';

export async function addStudent(formData) {
  try {
    const data = Object.fromEntries(formData.entries());
    
    // Process and validate data
    if (!data.firstName || !data.lastName || !data.email || !data.studentId) {
      return { error: 'Required fields are missing' };
    }
    
    // Convert date strings to Date objects
    if (data.dateOfBirth) {
      data.dateOfBirth = new Date(data.dateOfBirth);
    }
    
    // Convert numeric values
    if (data.gpa) {
      data.gpa = parseFloat(data.gpa);
    }
    
    const student = await createStudent(data);
    revalidatePath('/students');
    return { success: true, student };
  } catch (error) {
    console.error('Error adding student:', error);
    return { error: error.message };
  }
}

export async function editStudent(formData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const id = data.id;
    
    if (!id) {
      return { error: 'Student ID is required' };
    }
    
    delete data.id; // Remove ID from the update data
    
    // Convert date strings to Date objects
    if (data.dateOfBirth) {
      data.dateOfBirth = new Date(data.dateOfBirth);
    }
    
    // Convert numeric values
    if (data.gpa) {
      data.gpa = parseFloat(data.gpa);
    }
    
    const student = await updateStudent(parseInt(id), data);
    revalidatePath('/students');
    revalidatePath(`/students/${id}`);
    return { success: true, student };
  } catch (error) {
    console.error('Error updating student:', error);
    return { error: error.message };
  }
}

export async function removeStudent(formData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const id = data.id;
    
    if (!id) {
      return { error: 'Student ID is required' };
    }
    
    await deleteStudent(parseInt(id));
    revalidatePath('/students');
    return { success: true };
  } catch (error) {
    console.error('Error deleting student:', error);
    return { error: error.message };
  }
}

export async function addStudentEnrollment(formData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const { studentId, classId } = data;
    
    if (!studentId || !classId) {
      return { error: 'Student ID and Class ID are required' };
    }
    
    const enrollment = await enrollStudent(parseInt(studentId), parseInt(classId));
    revalidatePath(`/students/${studentId}`);
    return { success: true, enrollment };
  } catch (error) {
    console.error('Error enrolling student:', error);
    return { error: error.message };
  }
}

export async function updateStudentGrade(formData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const { enrollmentId, grade, status } = data;
    
    if (!enrollmentId) {
      return { error: 'Enrollment ID is required' };
    }
    
    const updateData = {};
    
    if (grade) {
      updateData.grade = parseFloat(grade);
    }
    
    if (status) {
      updateData.status = status;
    }
    
    const enrollment = await updateEnrollment(parseInt(enrollmentId), updateData);
    revalidatePath(`/students/${enrollment.studentId}`);
    return { success: true, enrollment };
  } catch (error) {
    console.error('Error updating grade:', error);
    return { error: error.message };
  }
}

export async function removeStudentEnrollment(formData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const { enrollmentId, studentId } = data;
    
    if (!enrollmentId) {
      return { error: 'Enrollment ID is required' };
    }
    
    await unenrollStudent(parseInt(enrollmentId));
    if (studentId) {
      revalidatePath(`/students/${studentId}`);
    }
    return { success: true };
  } catch (error) {
    console.error('Error removing enrollment:', error);
    return { error: error.message };
  }
}