'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CourseSuccessChart({ data }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      // Take top 10 and bottom 10 courses by success rate
      const sorted = [...data].sort((a, b) => b.successRate - a.successRate);
      const top10 = sorted.slice(0, 10);
      const bottom10 = sorted.slice(-10).reverse();
      
      // Format for chart
      const formatted = [...top10, ...bottom10].map(course => ({
        name: course.courseCode,
        successRate: parseFloat(course.successRate),
        title: course.title,
        pass: Number(course.passCount),
        fail: Number(course.failCount),
        total: Number(course.totalCount)
      }));
      
      setChartData(formatted);
    }
  }, [data]);

  if (!chartData || chartData.length === 0) {
    return <div className="text-center p-6">Loading course success data...</div>;
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const course = chartData.find(c => c.name === label);
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow-sm">
          <p className="font-medium">{course.title}</p>
          <p>{`Success Rate: ${payload[0].value.toFixed(2)}%`}</p>
          <p>{`Pass: ${course.pass}, Fail: ${course.fail}, Total: ${course.total}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Course Success Rates</h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 75 }}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis label={{ value: 'Success Rate (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="successRate" 
              fill="#10B981" 
              name="Success Rate (%)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}