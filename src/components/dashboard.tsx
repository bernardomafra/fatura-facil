import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import CategoryChart from "./category-chart";
import { Transaction } from "../types/transaction";

interface DashboardProps {
  transactions: Transaction[];
  total: number;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, total }) => {
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
                    dataKey="name"
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

        <CategoryChart transactions={transactions} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transações</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{transactions.length} transações nesta fatura</p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg">
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Total</p>
              <p className="text-xl font-bold text-indigo-700 dark:text-indigo-300">R$ {total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              {transactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-400">
                    <span
                      className="bg-gray-50 dark:bg-gray-900 rounded-lg px-2 py-1.5 flex items-center gap-4 w-fit"
                      style={{
                        border: `1px solid ${transaction.category.color}`,
                        color: transaction.category.color,
                      }}
                    >
                      {transaction.category.icon}
                      <span className="text-gray-900 dark:text-gray-100">{transaction.name}</span>
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                      transaction.amount < 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    R$ {Math.abs(transaction.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
