import React, { useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Transaction } from "../types/transaction";

interface CategoryChartProps {
  transactions: Transaction[];
  onCategorySelect: (category: string) => void;
  selectedCategories: Set<string>;
}

const CategoryChart: React.FC<CategoryChartProps> = ({ transactions, onCategorySelect, selectedCategories }) => {
  const categoryData = transactions.reduce(
    (acc: { [key: string]: { value: number; category: Transaction["category"] } }, transaction) => {
      const categoryKey = transaction.category.label;
      if (!acc[categoryKey]) {
        acc[categoryKey] = {
          value: 0,
          category: transaction.category,
        };
      }
      acc[categoryKey].value += Math.abs(transaction.amount);
      return acc;
    },
    {},
  );

  const data = Object.entries(categoryData).map(([key, { value, category }]) => ({
    name: key,
    value,
    category,
    color: category.color,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { category, color } = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <p className="font-medium text-gray-600 dark:text-gray-300">
              {category.icon} {category.label}
            </p>
          </div>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
            R$ {payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  const handleLegendClick = useCallback(
    (entry: any) => {
      const categoryLabel = entry.payload.category.label;
      onCategorySelect(categoryLabel);
    },
    [onCategorySelect],
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-indigo-500 to-indigo-600">
        <h2 className="text-2xl font-bold text-white">Gastos por Categoria</h2>
        <p className="text-indigo-100 mt-1">Distribuição dos seus gastos por categoria</p>
      </div>

      <div className="p-6">
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={140}
                paddingAngle={2}
                dataKey="value"
                label={({ category }) => category.icon}
                labelLine={{ stroke: "#6B7280" }}
              >
                {data.map((entry) => (
                  <Cell
                    key={`cell-${entry.category.label}`}
                    fill={entry.color}
                    onClick={() => handleLegendClick({ payload: entry })}
                    style={{ outline: "none" }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
              <Legend
                iconType="circle"
                iconSize={0}
                formatter={(_value, entry: any) => (
                  <span
                    className={`flex items-center space-x-2 cursor-pointer hover:opacity-75 transition-opacity ${
                      selectedCategories.has(entry.payload.category.label)
                        ? "font-bold ring-2 ring-indigo-500 rounded-lg px-2"
                        : ""
                    }`}
                    onClick={() => handleLegendClick(entry)}
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.payload.color }} />
                    <span className="text-gray-900 dark:text-gray-100">
                      {entry.payload.category.icon} {entry.payload.category.label}
                    </span>
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CategoryChart;
