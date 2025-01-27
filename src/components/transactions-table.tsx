import { Transaction } from "../types/transaction";

export const TransactionsTable = ({ transactions }: { transactions: Transaction[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Data
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Categoria
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
                  {transaction.category.icon} {transaction.category.label}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-400">
                <span className="text-gray-900 dark:text-gray-100">{transaction.name}</span>
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
  );
};
