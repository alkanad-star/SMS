'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function GradeDistributionChart({ data }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data);
    }
  }, [data]);

  // Colors for the different grade levels
  const COLORS = {
    'A': '#10B981', // Green
    'B': '#3B82F6', // Blue
    'C': '#F59E0B', // Yellow
    'D': '#F97316', // Orange
    'F': '#EF4444'  // Red
  };

  if (!chartData || chartData.length === 0) {
    return <div className="text-center p-6">Loading grade distribution data...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Grade Distribution</h3>
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
              dataKey="count"
              nameKey="gradeLetter"
              label={({ gradeLetter, count, percent }) => `${gradeLetter}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.gradeLetter] || '#CCCCCC'} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => [`${value} students`, `Grade ${props.payload.gradeLetter}`]}
            />
            <Legend 
              formatter={(value, entry, index) => `Grade ${entry.payload.gradeLetter}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}