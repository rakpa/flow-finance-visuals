
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import CategoryForm from '@/components/CategoryForm';
import CategoryList from '@/components/CategoryList';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Transaction, Category, FinanceData } from '@/types';
import { toast } from 'sonner';

const defaultCategories: Category[] = [
  { id: uuidv4(), name: 'Groceries', icon: '🍔', color: '#22c55e', type: 'expense' },
  { id: uuidv4(), name: 'Transportation', icon: '🚗', color: '#f97316', type: 'expense' },
  { id: uuidv4(), name: 'Entertainment', icon: '🎮', color: '#a855f7', type: 'expense' },
  { id: uuidv4(), name: 'Shopping', icon: '🛍️', color: '#ec4899', type: 'expense' },
  { id: uuidv4(), name: 'Utilities', icon: '💡', color: '#3b82f6', type: 'expense' },
  { id: uuidv4(), name: 'Salary', icon: '💰', color: '#22c55e', type: 'income' },
  { id: uuidv4(), name: 'Freelance', icon: '💼', color: '#6366f1', type: 'income' },
  { id: uuidv4(), name: 'Gifts', icon: '🎁', color: '#f97316', type: 'income' },
];

const Index = () => {
  // Local storage for persisting data
  const [financeData, setFinanceData] = useLocalStorage<FinanceData>('finance-tracker-data', {
    transactions: [],
    categories: defaultCategories,
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

  // Handle adding a new transaction
  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      id: uuidv4(),
      ...newTransaction,
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  // Handle deleting a transaction
  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
    toast.success('Transaction deleted');
  };

  // Handle adding a new category
  const handleAddCategory = (newCategory: Omit<Category, 'id'>) => {
    const category: Category = {
      id: uuidv4(),
      ...newCategory,
    };
    setCategories(prev => [...prev, category]);
  };

  // Handle deleting a category
  const handleDeleteCategory = (id: string) => {
    // Check if category is in use
    const isInUse = transactions.some(transaction => transaction.categoryId === id);
    
    if (isInUse) {
      toast.error('Cannot delete category in use');
      return;
    }
    
    setCategories(prev => prev.filter(category => category.id !== id));
    toast.success('Category deleted');
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

      <section id="add-transaction" className="mb-10">
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

      <section id="categories" className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Categories</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CategoryForm onAddCategory={handleAddCategory} />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-card p-6 rounded-lg shadow-sm h-full">
              <h3 className="text-xl font-bold mb-4">Category List</h3>
              <CategoryList 
                categories={categories} 
                onDeleteCategory={handleDeleteCategory}
                transactions={transactions}
              />
            </div>
          </div>
        </div>
      </section>

      <section id="reports" className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-4">Income Analysis</h3>
            <ExpenseChart 
              transactions={transactions} 
              categories={categories} 
              type="income" 
            />
          </div>
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-4">Expense Analysis</h3>
            <ExpenseChart 
              transactions={transactions} 
              categories={categories} 
              type="expense" 
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

// Need to include this for the ExpenseChart component
import ExpenseChart from '@/components/charts/ExpenseChart';

export default Index;
