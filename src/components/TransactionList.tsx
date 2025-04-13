
import { useMemo, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Search, Calendar, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Transaction, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onDeleteTransaction: (id: string) => void;
}

const TransactionList = ({
  transactions,
  categories,
  onDeleteTransaction,
}: TransactionListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((transaction) => {
        // Type filter
        if (filter !== 'all' && transaction.type !== filter) {
          return false;
        }
        
        // Search filter
        if (searchTerm) {
          const category = categories.find(cat => cat.id === transaction.categoryId);
          const searchTermLower = searchTerm.toLowerCase();
          
          return (
            transaction.description.toLowerCase().includes(searchTermLower) ||
            (category && category.name.toLowerCase().includes(searchTermLower))
          );
        }
        
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, categories, searchTerm, filter]);

  const getCategoryById = (id: string) => {
    return categories.find(cat => cat.id === id);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2 mt-2 md:mt-0">
          <Button
            size="sm"
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={filter === 'income' ? 'default' : 'outline'}
            onClick={() => setFilter('income')}
          >
            Income
          </Button>
          <Button
            size="sm"
            variant={filter === 'expense' ? 'default' : 'outline'}
            onClick={() => setFilter('expense')}
          >
            Expenses
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => {
            const category = getCategoryById(transaction.categoryId);
            return (
              <div 
                key={transaction.id} 
                className={cn(
                  "transaction-item flex items-center justify-between p-4 rounded-lg border",
                  "hover:shadow-sm transition-all duration-200"
                )}
              >
                <div className="flex items-center">
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full mr-4",
                    transaction.type === 'income' ? 'bg-finance-income/10' : 'bg-finance-expense/10'
                  )}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="h-5 w-5 text-finance-income" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5 text-finance-expense" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{transaction.description}</h4>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      {category && (
                        <span className="flex items-center mr-3">
                          <span className="mr-1" role="img" aria-label={category.name}>
                            {category.icon}
                          </span>
                          {category.name}
                        </span>
                      )}
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(parseISO(transaction.date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={cn(
                    "text-lg font-medium mr-4",
                    transaction.type === 'income' ? 'text-finance-income' : 'text-finance-expense'
                  )}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteTransaction(transaction.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No transactions match your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
