import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ComplaintAnalytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
     api.get('/complaints').then(res => {
         // Transform data to group by category for chart
         const counts = res.data.reduce((acc, curr) => {
             acc[curr.category] = (acc[curr.category] || 0) + 1;
             return acc;
         }, {});
         
         const chartData = Object.keys(counts).map(key => ({ name: key, count: counts[key] }));
         setData(chartData);
     });
  }, []);

  return (
    <div className="h-full">
       <h3 className="text-lg font-semibold mb-4 text-slate-200">Complaints by Category</h3>
       <div className="h-64 w-full bg-slate-900 p-4 rounded-lg border border-slate-700">
          <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickFormatter={(val) => val.split('_')[0]} />
                  <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                  <Tooltip cursor={{fill: '#334155'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
          </ResponsiveContainer>
       </div>
       <p className="mt-4 text-sm text-slate-400">Total processed issues shown. Use Admin management dashboard to assign priorities.</p>
    </div>
  );
}
