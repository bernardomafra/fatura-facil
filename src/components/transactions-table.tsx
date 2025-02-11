import { Transaction } from "../types/transaction";
import { useState } from "react";

interface SortConfig {
  key: keyof Transaction;
  direction: "asc" | "desc";
}

export const TransactionsTable = ({ transactions }: { transactions: Transaction[] }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "date", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Default number of items per page

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortConfig.key === "category") {
      const compareResult = a.category.label.localeCompare(b.category.label);
      return sortConfig.direction === "asc" ? compareResult : -compareResult;
    }

    if (typeof a[sortConfig.key] === "string") {
      const compareResult = (a[sortConfig.key] as string).localeCompare(b[sortConfig.key] as string);
      return sortConfig.direction === "asc" ? compareResult : -compareResult;
    }

    const aValue = a[sortConfig.key] as number;
    const bValue = b[sortConfig.key] as number;
    return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
  });

  const handleSort = (key: keyof Transaction) => {
    setSortConfig((currentConfig) => {
      // If clicking the same column that's already sorted descending, remove sorting
      if (currentConfig.key === key && currentConfig.direction === "desc") {
        return { key: "date", direction: "desc" }; // Reset to default sort
      }
      // If clicking the same column, toggle direction
      if (currentConfig.key === key) {
        return { key, direction: "desc" };
      }
      // If clicking a new column, sort ascending
      return { key, direction: "asc" };
    });
  };

  const getSortIcon = (key: keyof Transaction) => {
    if (sortConfig.key !== key) return "↕️";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed">
        <thead className="bg-gray-50 dark:bg-gray-700/50 select-none">
          <tr>
            <th
              onClick={() => handleSort("date")}
              className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600/50"
            >
              Data {getSortIcon("date")}
            </th>
            <th
              onClick={() => handleSort("category")}
              className="w-48 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600/50"
            >
              Categoria {getSortIcon("category")}
            </th>
            <th
              onClick={() => handleSort("name")}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600/50"
            >
              Descrição {getSortIcon("name")}
            </th>
            <th
              onClick={() => handleSort("amount")}
              className="w-36 px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600/50"
            >
              Valor {getSortIcon("amount")}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
          {currentItems.map((transaction, index) => (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <td className="w-32 px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {transaction.date}
              </td>
              <td className="w-48 px-6 py-4 text-sm text-gray-900 dark:text-gray-400">
                <span
                  className="bg-gray-50 dark:bg-gray-900 rounded-lg px-2 py-1.5 flex items-center gap-4 w-fit"
                  style={{
                    border: `1px solid ${transaction.category.color}`,
                    color: transaction.category.color,
                  }}
                >
                  {transaction.category.icon} {transaction.category.label}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-400 truncate">
                <span className="text-gray-900 dark:text-gray-100">{transaction.name}</span>
              </td>
              <td className="w-36 px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                <span
                  className={
                    transaction.amount < 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                  }
                >
                  R$ {Math.abs(transaction.amount).toFixed(2)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedTransactions.length)} de {sortedTransactions.length}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Anterior
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors
                         ${currentPage === pageNumber 
                           ? 'bg-indigo-500 text-white' 
                           : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                         }`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
};
