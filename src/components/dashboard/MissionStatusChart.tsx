import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataItem {
  name: string;
  value: number;
  color: string;
}

interface MissionStatusChartProps {
  data: DataItem[];
}

const MissionStatusChart = ({ data }: MissionStatusChartProps) => {
  // Custom label renderer to prevent text overflow
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // Only show label for segments that are large enough
    return percent > 0.05 ? (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize="12"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <Card className="col-span-1 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Mission Status</CardTitle>
      </CardHeader>
      <CardContent className="h-72"> {/* Increased height for better spacing */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <Pie
              data={data}
              cx="50%"
              cy="45%" /* Moved up slightly to make room for legend */
              labelLine={false}
              outerRadius={70}
              innerRadius={0} /* Make this >0 for a donut chart if preferred */
              fill="#8884d8"
              dataKey="value"
              label={renderCustomizedLabel}
              paddingAngle={2} /* Add small gap between segments */
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke="#fff"
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} missions`, 'Count']}
              contentStyle={{ 
                borderRadius: '8px', 
                padding: '8px', 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                border: '1px solid #f0f0f0'
              }}
              wrapperStyle={{ zIndex: 100 }}
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              wrapperStyle={{ paddingTop: '15px' }}
              formatter={(value) => <span style={{ fontSize: '12px', color: '#666' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MissionStatusChart;