
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import { Transaction, Category, FinanceData } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

const Index = () => {
  // Local storage for persisting data
  const [financeData, setFinanceData] = useLocalStorage<FinanceData>('finance-tracker-data', {
    transactions: [],
    categories: [],
  });

  // Initialize state from localStorage
  const [transactions, setTransactions] = useState<Transaction[]>(financeData.transactions);
  const [categories, setCategories] = useState<Category[]>(financeData.categories);

  // Update localStorage when state changes
  useEffect(() => {
    setFinanceData({
      transactions,
      categories,
    });
  }, [transactions, categories, setFinanceData]);

  // Handle deleting a transaction
  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
    toast.success('Transaction deleted');
  };

  return (
    <Layout>
      <section id="dashboard" className="mb-10">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <Dashboard 
          transactions={transactions} 
          categories={categories}
          onDeleteTransaction={handleDeleteTransaction}
        />
      </section>
    </Layout>
  );
};

export default Index;
