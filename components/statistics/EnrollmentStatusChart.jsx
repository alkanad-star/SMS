'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function EnrollmentStatusChart({ data }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const formatted = data.map(item => ({
        name: item.status.charAt(0) + item.status.slice(1).toLowerCase(),
        value: Number(item.count)
      }));
      setChartData(formatted);
    }
  }, [data]);

  // Colors for different status
  const COLORS = {
    'Enrolled': '#3B82F6',  // Blue
    'Completed': '#10B981', // Green
    'Withdrawn': '#F59E0B', // Yellow/Orange
    'Failed': '#EF4444'     // Red
  };

  if (!chartData || chartData.length === 0) {
    return <div className="text-center p-6">Loading enrollment status data...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Enrollment Status Distribution</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#CCCCCC'} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} enrollments`, 'Count']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}