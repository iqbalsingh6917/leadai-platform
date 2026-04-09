'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { date: 'Mar 10', count: 12 },
  { date: 'Mar 13', count: 18 },
  { date: 'Mar 16', count: 15 },
  { date: 'Mar 19', count: 24 },
  { date: 'Mar 22', count: 20 },
  { date: 'Mar 25', count: 28 },
  { date: 'Mar 28', count: 22 },
  { date: 'Mar 31', count: 35 },
  { date: 'Apr 03', count: 30 },
  { date: 'Apr 06', count: 42 },
];

interface LeadsChartProps {
  data?: { date: string; count: number }[];
}

export function LeadsChart({ data = mockData }: LeadsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#4f46e5"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
