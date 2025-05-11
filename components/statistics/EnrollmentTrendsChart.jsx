'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function EnrollmentTrendsChart({ data }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      // Group by year and semester for proper chronological order
      const formatted = data.map(item => ({
        term: item.term,
        enrollments: Number(item.enrollmentCount),
        // Use a sortable key for proper sequence
        sortKey: `${item.year}-${item.semester === 'Spring' ? '1' : item.semester === 'Summer' ? '2' : '3'}`
      }))
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey));
      
      setChartData(formatted);
    }
  }, [data]);

  if (!chartData || chartData.length === 0) {
    return <div className="text-center p-6">Loading enrollment trends data...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Enrollment Trends by Semester</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="term" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="enrollments" 
              stroke="#3B82F6" 
              activeDot={{ r: 8 }}
              name="Enrollments"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}