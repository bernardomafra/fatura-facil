import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { Transaction } from "../types/transaction";
import { detectCategoriesWithPreference } from "../services/category-detector";

GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

export const parsePDF = async (
  file: File,
  useAI: boolean = false
): Promise<{total: number, transactions: Transaction[]}> => {
  const reader = new FileReader();

  const monthMap: { [key: string]: string } = {
    'JAN': '01', 'FEV': '02', 'MAR': '03', 'ABR': '04',
    'MAI': '05', 'JUN': '06', 'JUL': '07', 'AGO': '08',
    'SET': '09', 'OUT': '10', 'NOV': '11', 'DEZ': '12'
  };

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const pdf = await getDocument(arrayBuffer).promise;
      const transactions: Omit<Transaction, 'category'>[] = [];
      let total = 0;

      for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const content = await page.getTextContent();
        const items = content.items as { str: string }[];

        if (page.pageNumber === 1) {
          const totalIndex = items.findIndex(item => item.str.includes("no valor de")) + 1;
          total = parseFloat(items[totalIndex].str.replace('R$', '').replace('.', '').replace(',', '.'));
        }

        const transactionsTitleIndex = items.findIndex(item => item.str === 'TRANSAÇÕES');
        if (transactionsTitleIndex === -1) continue;

        const transactionsListBeginIndex = transactionsTitleIndex + 4;
        const transactionItems = items.slice(transactionsListBeginIndex).filter(item => item.str.trim() !== '');

        let currentTransaction: Partial<Omit<Transaction, 'category'>> = {};

        for (const item of transactionItems) {
          const text = item.str.trim();

          if (text.includes("Estorno")) continue;

          // Match date pattern (DD MMM)
          const dateMatch = text.match(/^(\d{2})\s+([A-Z]{3})$/);
          if (dateMatch) {
            if (currentTransaction.date) {
              if (currentTransaction.name && currentTransaction.amount) {
                transactions.push(currentTransaction as Omit<Transaction, 'category'>);
              }
              currentTransaction = {};
            }
            const [, day, month] = dateMatch;
            if (monthMap[month]) {
              currentTransaction.date = `${day}/${monthMap[month]}/${new Date().getFullYear()}`;
            }
            continue;
          }

          // Amount pattern (R$ X,XX or -R$ X,XX)
          const amountMatch = text.match(/^(-)?R\$\s*(\d+[,.]?\d+)$/);
          if (amountMatch && currentTransaction.date) {
            const isNegative = amountMatch[1] === '-';
            const amountStr = amountMatch[2].replace('.', '').replace(',', '.');
            const amount = parseFloat(amountStr) * (isNegative ? -1 : 1);

            if (!isNaN(amount)) {
              currentTransaction.amount = amount;

              if (currentTransaction.name && currentTransaction.date) {
                transactions.push(currentTransaction as Omit<Transaction, 'category'>);
                currentTransaction = {};
              }
            }
            continue;
          }

          // If we have a date but no amount yet, this is part of the name
          if (currentTransaction.date && !currentTransaction.amount) {
            currentTransaction.name = currentTransaction.name
              ? `${currentTransaction.name} ${text}`
              : text;
          }
        };

        // Push the last transaction if it's complete
        if (currentTransaction.date && currentTransaction.name && currentTransaction.amount) {
          transactions.push(currentTransaction as Omit<Transaction, 'category'>);
        }
      }

      // Now categorize all transactions at once
      const categorizedTransactions = await detectCategoriesWithPreference(transactions, useAI);

      resolve({ total, transactions: categorizedTransactions });
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};
