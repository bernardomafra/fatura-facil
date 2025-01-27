import React, { useState } from "react";
import CategoryChart from "./category-chart";
import DailyChart from "./daily-chart";
import { Transaction } from "../types/transaction";
import { TransactionsTable } from "./transactions-table";

interface DashboardProps {
  transactions: Transaction[];
  total: number;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
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

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DailyChart transactions={transactions} />
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
