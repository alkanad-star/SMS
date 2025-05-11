'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TopCoursesChart({ data }) {
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    if (data && data.length > 0) {
      // Format data for chart
      const formatted = data.map(course => ({
        name: course.courseCode,
        enrollments: Number(course.enrollmentCount),
        title: course.title
      }));
      setChartData(formatted);
    }
  }, [data]);

  if (!chartData || chartData.length === 0) {
    return <div className="text-center p-6">Loading course data...</div>;
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const course = chartData.find(c => c.name === label);
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow-sm">
          <p className="font-medium">{course.title}</p>
          <p>{`${course.name}: ${payload[0].value} enrollments`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Top Courses by Enrollment</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="enrollments" fill="#10B981" name="Enrollments" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}