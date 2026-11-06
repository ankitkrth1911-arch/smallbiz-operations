import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface MiniChartProps {
  data?: { category: string; amount: number; percentage: number }[];
  accentColor?: string;
}

export const MiniChart: React.FC<MiniChartProps> = ({
  data = [
    { category: 'DevOps', amount: 8200, percentage: 44 },
    { category: 'Infra', amount: 4800, percentage: 26 },
    { category: 'SLA', amount: 3100, percentage: 17 },
    { category: 'Buffer', amount: 2300, percentage: 13 },
  ],
  accentColor = '#5A7AA8',
}) => {
  return (
    <div className="w-full bg-[rgba(20,26,42,0.6)] rounded border border-[rgba(170,182,208,0.18)] p-2 flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between text-[8.5px] font-mono text-[#9FB0D4] mb-1">
        <span className="uppercase tracking-wider font-medium">COST ALLOCATION</span>
        <span className="font-semibold text-[#E8EEFF]">$18.4k TOTAL</span>
      </div>
      
      <div className="w-full h-18 py-0.5">
        <ResponsiveContainer width="100%" height={70}>
          <BarChart data={data} margin={{ top: 2, right: 4, left: -24, bottom: -4 }}>
            <XAxis 
              dataKey="category" 
              stroke="#9FB0D4" 
              fontSize={8} 
              tickLine={false} 
              axisLine={{ stroke: 'rgba(170, 182, 208, 0.2)' }}
            />
            <YAxis 
              stroke="#9FB0D4" 
              fontSize={7} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-[#0A0E1A] text-[#E8EEFF] border border-[rgba(170,182,208,0.28)] px-2 py-1 rounded shadow-md text-[9px] font-mono">
                      <div className="font-semibold">{item.category}</div>
                      <div className="text-[#C8D4F0]">${item.amount.toLocaleString()} ({item.percentage}%)</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="amount" radius={[2, 2, 0, 0]}>
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 0 ? accentColor : index === 1 ? '#7A96C0' : index === 2 ? '#3A4C7A' : '#2A3A66'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default MiniChart;
