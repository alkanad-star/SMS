'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MajorGPAChart({ data }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      // Format and sort data by GPA
      const formatted = data
        .map(item => ({
          major: item.major,
          gpa: parseFloat(item.averageGPA).toFixed(2),
          students: Number(item.studentCount)
        }))
        .sort((a, b) => b.gpa - a.gpa);
      
      setChartData(formatted);
    }
  }, [data]);

  if (!chartData || chartData.length === 0) {
    return <div className="text-center p-6">Loading GPA data...</div>;
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow-sm">
          <p className="font-medium">{label}</p>
          <p>{`Average GPA: ${payload[0].value}`}</p>
          <p>{`Number of Students: ${payload[0].payload.students}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Average GPA by Major</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 4]} tickCount={5} />
            <YAxis type="category" dataKey="major" width={100} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="gpa" fill="#8884d8" name="Average GPA" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}