import React, { useState, useEffect } from "react";
import Dashboard from "./components/dashboard";
import NavBar from "./components/navbar";
import { parsePDF } from "./utils/parse-pdf";
import { Transaction } from "./types/transaction";

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    // Load saved data from localStorage on component mount
    const savedTransactions = localStorage.getItem("transactions");
    const savedTotal = localStorage.getItem("total");

    if (savedTransactions && savedTotal) {
      try {
        setTransactions(JSON.parse(savedTransactions));
        setTotal(JSON.parse(savedTotal));
      } catch (error) {
        console.error("Error loading saved data:", error);
        // Clear invalid data from localStorage
        localStorage.removeItem("transactions");
        localStorage.removeItem("total");
        localStorage.removeItem("fileName");
      }
    }
  }, []); // Empty dependency array means this runs once on mount

  const handleFileUpload = async (file: File) => {
    const { total, transactions } = await parsePDF(file);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("total", JSON.stringify(total));
    localStorage.setItem("fileName", file.name);
    setTransactions(transactions);
    setTotal(total);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <NavBar onFileUpload={handleFileUpload} />
      <div className="w-full max-w-[1920px] mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {transactions.length > 0 ? (
          <Dashboard transactions={transactions} total={total} />
        ) : (
          <div className="text-center mt-20">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Nenhuma fatura carregada</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Clique no botão "Carregar Fatura" para começar a análise
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
