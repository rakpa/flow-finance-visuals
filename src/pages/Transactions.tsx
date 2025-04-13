
import { useState } from 'react';
import Layout from '@/components/Layout';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import { Transaction, Category } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

const Transactions = () => {
  // Local storage for persisting data
  const [financeData, setFinanceData] = useLocalStorage<{
    transactions: Transaction[];
    categories: Category[];
  }>('finance-tracker-data', {
    transactions: [],
    categories: [],
  });

  // Initialize state from localStorage
  const [transactions, setTransactions] = useState<Transaction[]>(financeData.transactions);
  const categories = financeData.categories;

  // Handle adding a new transaction
  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      id: uuidv4(),
      ...newTransaction,
    };
    const updatedTransactions = [transaction, ...transactions];
    setTransactions(updatedTransactions);
    
    // Update localStorage
    setFinanceData({
      ...financeData,
      transactions: updatedTransactions,
    });
    
    toast.success('Transaction added');
  };

  // Handle deleting a transaction
  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
    setTransactions(updatedTransactions);
    
    // Update localStorage
    setFinanceData({
      ...financeData,
      transactions: updatedTransactions,
    });
    
    toast.success('Transaction deleted');
  };

  return (
    <Layout>
      <section id="transactions">
        <h2 className="text-2xl font-bold mb-6">Transactions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TransactionForm 
              categories={categories} 
              onAddTransaction={handleAddTransaction} 
            />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-card p-6 rounded-lg shadow-sm h-full">
              <h3 className="text-xl font-bold mb-4">Transaction History</h3>
              <TransactionList 
                transactions={transactions} 
                categories={categories}
                onDeleteTransaction={handleDeleteTransaction}
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Transactions;
