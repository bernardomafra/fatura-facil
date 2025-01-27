import React from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ComposedChart, Area, Line } from "recharts";
import { Transaction } from "../types/transaction";

interface DailyChartProps {
  transactions: Transaction[];
}

const DailyChart: React.FC<DailyChartProps> = ({ transactions }) => {
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { value: number; payload: { value: number; date: string } }[];
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="text-sm text-gray-500 dark:text-gray-400">{payload[0].payload.date}</p>
          <div className="mt-2">
            <p className="font-medium text-indigo-600 dark:text-indigo-400">
              Gasto do dia: R$ {Math.abs(payload[0].value).toFixed(2)}
            </p>
            <p className="font-medium text-green-600 dark:text-green-400">
              Total acumulado: R$ {Math.abs(payload[1].value).toFixed(2)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Sort transactions by date and aggregate by date
  const aggregatedData = transactions.reduce((acc: { [key: string]: number }, transaction) => {
    const date = transaction.date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += transaction.amount;
    return acc;
  }, {});

  // Convert to array and sort by date
  const chartData = Object.entries(aggregatedData)
    .map(([date, amount]) => ({
      date,
      amount,
      runningTotal: 0, // We'll calculate this next
    }))
    .sort((a, b) => {
      const dateA = new Date(a.date.split("/").reverse().join("-"));
      const dateB = new Date(b.date.split("/").reverse().join("-"));
      return dateA.getTime() - dateB.getTime();
    });

  // Calculate running total
  let runningTotal = 0;
  chartData.forEach((item) => {
    runningTotal += item.amount;
    item.runningTotal = runningTotal;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden h-fit">
      <div className="p-6 bg-gradient-to-r from-indigo-500 to-indigo-600">
        <h2 className="text-2xl font-bold text-white">Resumo diário</h2>
        <p className="text-indigo-100 mt-1">
          Visualização do seu gasto{" "}
          <span className="bg-gray-800 font-bold shadow-xl text-[#4F46E5] rounded-sm px-1 py-0.5">diário</span> e{" "}
          <span className="bg-gray-800 font-bold shadow-xl text-[#22C55E] rounded-sm px-1 py-0.5">acumulado</span>
        </p>
      </div>

      <div className="p-6">
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                tickMargin={12}
                axisLine={{ stroke: "#4B5563" }}
              />
              <YAxis
                yAxisId="left"
                tickMargin={12}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `R$ ${value}`}
              />
              <YAxis
                yAxisId="right"
                tickMargin={12}
                orientation="right"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `R$ ${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="amount"
                fill="#4F46E5"
                fillOpacity={0.1}
                stroke="#4F46E5"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="runningTotal"
                stroke="#22C55E"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DailyChart;
