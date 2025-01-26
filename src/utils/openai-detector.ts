import { OpenAI } from "openai";
import {  Transaction } from '../types/transaction';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const systemPrompt = `You are a transaction categorizer. You will receive multiple transactions and should categorize each one.

For each transaction, respond with the category icon and label on a new line. For example:
"🍽️ Alimentação"
If unsure about any transaction, use "💳 Outros".`;

export const detectCategoriesWithAI = async (
  transactions: Omit<Transaction, 'category'>[]
): Promise<Transaction[]> => {
  try {
    const transactionsText = transactions
      .map(t => `Transaction: "${t.name}" - Amount: R$ ${t.amount.toFixed(2)}`)
      .join('\n');

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: transactionsText }
      ],
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content?.trim() || "";
    const categories = response.split('\n').map(line => {
      const [icon, ...labelParts] = line.trim().split(' ');
      return { icon: icon, label: labelParts.join(' ') };
    });

    console.log(categories)

    return transactions.map((transaction, index) => ({
      ...transaction,
      category: categories[index] || { icon: '💳', label: 'Outros' }
    }));
  } catch (error) {
    console.error('Error detecting categories with AI:', error);
    return transactions.map(transaction => ({
      ...transaction,
      category: { icon: '💳', label: 'Outros' }
    }));
  }
};