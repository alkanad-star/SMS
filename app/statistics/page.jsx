'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import EnrollmentChart from '@/components/statistics/EnrollmentChart';
import TopCoursesChart from '@/components/statistics/TopCoursesChart';
import GradeDistributionChart from '@/components/statistics/GradeDistributionChart';
import MajorGPAChart from '@/components/statistics/MajorGPAChart';
import EnrollmentCategoryChart from '@/components/statistics/EnrollmentCategoryChart';
import CourseSuccessChart from '@/components/statistics/CourseSuccessChart';
import EnrollmentStatusChart from '@/components/statistics/EnrollmentStatusChart';
import TopInstructorsChart from '@/components/statistics/TopInstructorsChart';
import EnrollmentTrendsChart from '@/components/statistics/EnrollmentTrendsChart';
import ClassSizeChart from '@/components/statistics/ClassSizeChart';

// Import Server Actions
import * as statsActions from '@/app/actions/statisticsActions';

export default function StatisticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    studentsByYear: [],
    studentsByMajor: [],
    studentsByGender: [],
    topCourses: [],
    enrollmentsByCategory: [],
    gpaByMajor: [],
    gradeDistribution: [],
    courseSuccessRates: [],
    enrollmentStatus: [],
    topInstructors: [],
    enrollmentTrends: [],
    classSize: []
  });

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      loadAllStats();
    }
  }, [status, router]);

  const loadAllStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all statistics in parallel
      const [
        studentsByYear,
        studentsByMajor,
        studentsByGender,
        topCourses,
        enrollmentsByCategory,
        gpaByMajor,
        gradeDistribution,
        courseSuccessRates,
        enrollmentStatus,
        topInstructors,
        enrollmentTrends,
        classSize
      ] = await Promise.all([
        statsActions.getStudentsByYear(),
        statsActions.getStudentsByMajor(),
        statsActions.getStudentsByGender(),
        statsActions.getTopCourses(),
        statsActions.getEnrollmentsByCategory(),
        statsActions.getAverageGPAByMajor(),
        statsActions.getGradeDistribution(),
        statsActions.getCourseSuccessRates(),
        statsActions.getEnrollmentStatusDistribution(),
        statsActions.getTopInstructors(),
        statsActions.getEnrollmentTrends(),
        statsActions.getClassSizeByCategory()
      ]);
      
      setStats({
        studentsByYear,
        studentsByMajor,
        studentsByGender,
        topCourses,
        enrollmentsByCategory,
        gpaByMajor,
        gradeDistribution,
        courseSuccessRates,
        enrollmentStatus,
        topInstructors,
        enrollmentTrends,
        classSize
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError('Failed to load statistics. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Student Management Dashboard</h1>
        <div className="text-sm text-gray-600">
          {session?.user?.name && <span>Welcome, {session.user.name}</span>}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="spinner w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-700">Loading statistics...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EnrollmentChart data={stats.studentsByYear} />
          <TopCoursesChart data={stats.topCourses} />
          <GradeDistributionChart data={stats.gradeDistribution} />
          <MajorGPAChart data={stats.gpaByMajor} />
          <EnrollmentCategoryChart data={stats.enrollmentsByCategory} />
          <EnrollmentStatusChart data={stats.enrollmentStatus} />
          <TopInstructorsChart data={stats.topInstructors} />
          <EnrollmentTrendsChart data={stats.enrollmentTrends} />
          <ClassSizeChart data={stats.classSize} />
          
          <div className="md:col-span-2 lg:col-span-3">
            <CourseSuccessChart data={stats.courseSuccessRates} />
          </div>
        </div>
      )}
    </div>
  );
}