
import { useState } from 'react';
import Layout from '@/components/Layout';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import { Transaction } from '@/types';
import { useTransactions } from '@/hooks/useTransactions';
import { Skeleton } from '@/components/ui/skeleton';

const Transactions = () => {
  const {
    transactions,
    categories,
    isLoading,
    addTransaction,
    deleteTransaction
  } = useTransactions();

  // Handle adding a new transaction
  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    addTransaction(newTransaction);
  };

  // Handle deleting a transaction
  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id);
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
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-card p-6 rounded-lg shadow-sm h-full">
              <h3 className="text-xl font-bold mb-4">Transaction History</h3>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="w-full h-20" />
                  ))}
                </div>
              ) : (
                <TransactionList 
                  transactions={transactions} 
                  categories={categories}
                  onDeleteTransaction={handleDeleteTransaction}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Transactions;
