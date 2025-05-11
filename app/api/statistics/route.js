import { NextResponse } from 'next/server';
import * as statisticsRepo from '@/lib/repository/statisticsRepository';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const stat = searchParams.get('stat');
    
    if (!stat) {
      return NextResponse.json({ error: 'Statistic type is required' }, { status: 400 });
    }
    
    let data;
    switch(stat) {
      case 'studentsByYear':
        data = await statisticsRepo.getStudentsByEnrollmentYear();
        break;
      case 'studentsByMajor':
        data = await statisticsRepo.getStudentsByMajor();
        break;
      case 'studentsByGender':
        data = await statisticsRepo.getStudentsByGender();
        break;
      case 'topCourses':
        const limit = parseInt(searchParams.get('limit') || '10');
        data = await statisticsRepo.getTopCoursesByEnrollment(limit);
        break;
      case 'enrollmentsByCategory':
        data = await statisticsRepo.getEnrollmentsByCategory();
        break;
      case 'gpaByMajor':
        data = await statisticsRepo.getAverageGPAByMajor();
        break;
      case 'gradeDistribution':
        data = await statisticsRepo.getGradeDistribution();
        break;
      case 'courseSuccessRates':
        data = await statisticsRepo.getCourseSuccessRates();
        break;
      case 'enrollmentStatus':
        data = await statisticsRepo.getEnrollmentStatusDistribution();
        break;
      case 'topInstructors':
        data = await statisticsRepo.getTopInstructorsByClassCount();
        break;
      case 'enrollmentTrends':
        data = await statisticsRepo.getEnrollmentTrendsBySemester();
        break;
      case 'classSize':
        data = await statisticsRepo.getAverageClassSizeByCategory();
        break;
      default:
        return NextResponse.json({ error: 'Invalid statistic type' }, { status: 400 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}