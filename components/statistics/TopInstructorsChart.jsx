'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TopInstructorsChart({ data }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const formatted = data.map(instructor => ({
        name: instructor.name,
        classes: Number(instructor.classCount),
        courses: Number(instructor.uniqueCourseCount),
        department: instructor.department
      }));
      setChartData(formatted);
    }
  }, [data]);

  if (!chartData || chartData.length === 0) {
    return <div className="text-center p-6">Loading instructor data...</div>;
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const instructor = chartData.find(i => i.name === label);
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow-sm">
          <p className="font-medium">{label}</p>
          <p>{`Department: ${instructor.department}`}</p>
          <p>{`Classes Taught: ${instructor.classes}`}</p>
          <p>{`Unique Courses: ${instructor.courses}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Top Instructors by Class Count</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={60}
              interval={0}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="classes" fill="#3B82F6" name="Classes Taught" />
            <Bar dataKey="courses" fill="#8B5CF6" name="Unique Courses" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}