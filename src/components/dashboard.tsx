import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import CategoryChart from "./category-chart";
import { Transaction } from "../types/transaction";
import { TransactionsTable } from "./transactions-table";

interface DashboardProps {
  transactions: Transaction[];
  total: number;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, total }) => {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  const filteredTransactions =
    selectedCategories.size > 0 ? transactions.filter((t) => selectedCategories.has(t.category.label)) : transactions;

  const filteredTotal = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  const handleCategorySelect = (category: string) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
            <p className="font-medium text-gray-600 dark:text-gray-300">{payload[0].payload.name}</p>
          </div>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
            R$ {Math.abs(payload[0].value).toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{payload[0].payload.date}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden h-fit">
          <div className="p-6 bg-gradient-to-r from-indigo-500 to-indigo-600">
            <h2 className="text-2xl font-bold text-white">Resumo da Fatura</h2>
            <p className="text-indigo-100 mt-1">Visualização detalhada dos seus gastos</p>
          </div>

          <div className="p-6">
            <div className="h-[500px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactions} margin={{ top: 20, right: 30, left: 20, bottom: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: "#4B5563" }}
                  />
                  <YAxis
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `R$ ${value}`}
                    domain={["dataMin", "dataMax"]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="amount" fill="#4F46E5" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <CategoryChart
          transactions={transactions}
          onCategorySelect={handleCategorySelect}
          selectedCategories={selectedCategories}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedCategories.size > 0
                  ? `Transações - ${Array.from(selectedCategories).join(", ")}`
                  : "Todas as Transações"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filteredTransactions.length} transações
                {selectedCategories.size > 0 && (
                  <button
                    onClick={() => setSelectedCategories(new Set())}
                    className="ml-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 cursor-pointer"
                  >
                    (Limpar filtros)
                  </button>
                )}
              </p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg">
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Total</p>
              <p className="text-xl font-bold text-indigo-700 dark:text-indigo-300">R$ {filteredTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <TransactionsTable transactions={filteredTransactions} />
      </div>
    </div>
  );
};

export default Dashboard;
