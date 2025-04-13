
import { useState } from 'react';
import Layout from '@/components/Layout';
import CategoryForm from '@/components/CategoryForm';
import CategoryList from '@/components/CategoryList';
import { Transaction, Category } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

const Categories = () => {
  // Local storage for persisting data
  const [financeData, setFinanceData] = useLocalStorage<{
    transactions: Transaction[];
    categories: Category[];
  }>('finance-tracker-data', {
    transactions: [],
    categories: [],
  });

  // Initialize state from localStorage
  const [categories, setCategories] = useState<Category[]>(financeData.categories);
  const transactions = financeData.transactions;

  // Handle adding a new category
  const handleAddCategory = (newCategory: Omit<Category, 'id'>) => {
    const category: Category = {
      id: uuidv4(),
      ...newCategory,
    };
    const updatedCategories = [...categories, category];
    setCategories(updatedCategories);
    
    // Update localStorage
    setFinanceData({
      ...financeData,
      categories: updatedCategories,
    });
    
    toast.success('Category added');
  };

  // Handle deleting a category
  const handleDeleteCategory = (id: string) => {
    // Check if category is in use
    const isInUse = transactions.some(transaction => transaction.categoryId === id);
    
    if (isInUse) {
      toast.error('Cannot delete category in use');
      return;
    }
    
    const updatedCategories = categories.filter(category => category.id !== id);
    setCategories(updatedCategories);
    
    // Update localStorage
    setFinanceData({
      ...financeData,
      categories: updatedCategories,
    });
    
    toast.success('Category deleted');
  };

  return (
    <Layout>
      <section id="categories">
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
    </Layout>
  );
};

export default Categories;
