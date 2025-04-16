import { useMemo, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Search, Calendar, Trash2, FilterIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Transaction, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { DateFilterOption, getDateRangeFromFilter, isDateInRange } from '@/lib/date-utils';

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
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('all');
  
  console.log('Categories in TransactionList:', categories);
  console.log('Transactions in TransactionList:', transactions);

  const filteredTransactions = useMemo(() => {
    const dateRange = getDateRangeFromFilter(dateFilter);
    
    return transactions
      .filter((transaction) => {
        // Type filter
        if (typeFilter !== 'all' && transaction.type !== typeFilter) {
          return false;
        }
        
        // Date filter
        if (!isDateInRange(transaction.date, dateRange)) {
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
  }, [transactions, categories, searchTerm, typeFilter, dateFilter]);

  const getCategoryById = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    console.log('Looking for category with ID:', id, 'Found:', category);
    return category;
  };

  const getDateFilterLabel = (filter: DateFilterOption): string => {
    const labels: Record<DateFilterOption, string> = {
      'all': 'All Time',
      'today': 'Today',
      'yesterday': 'Yesterday',
      'this-week': 'This Week',
      'this-month': 'This Month',
      'last-month': 'Last Month',
      'this-year': 'This Year'
    };
    return labels[filter];
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
        
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{getDateFilterLabel(dateFilter)}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
              <DropdownMenuLabel>Filter by date</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={dateFilter} onValueChange={(value) => setDateFilter(value as DateFilterOption)}>
                <DropdownMenuRadioItem value="all">All Time</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="today">Today</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="yesterday">Yesterday</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="this-week">This Week</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="this-month">This Month</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="last-month">Last Month</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="this-year">This Year</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            size="sm"
            variant={typeFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setTypeFilter('all')}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={typeFilter === 'income' ? 'default' : 'outline'}
            onClick={() => setTypeFilter('income')}
          >
            Income
          </Button>
          <Button
            size="sm"
            variant={typeFilter === 'expense' ? 'default' : 'outline'}
            onClick={() => setTypeFilter('expense')}
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
            <p className="text-muted-foreground">No transactions match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
