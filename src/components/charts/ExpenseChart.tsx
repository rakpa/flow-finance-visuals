
import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Transaction, Category, ChartData } from '@/types';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
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

interface ExpenseChartProps {
  transactions: Transaction[];
  categories: Category[];
  type: 'income' | 'expense';
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ transactions, categories, type }) => {
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('all');

  const chartData = useMemo(() => {
    const dateRange = getDateRangeFromFilter(dateFilter);
    
    // Filter transactions by type and date
    const filteredTransactions = transactions.filter(t => 
      t.type === type && isDateInRange(t.date, dateRange)
    );
    
    if (!filteredTransactions.length) return [];
    
    // Group by category and sum amounts
    const categoryTotals: Record<string, number> = {};
    
    for (const transaction of filteredTransactions) {
      const { categoryId, amount } = transaction;
      categoryTotals[categoryId] = (categoryTotals[categoryId] || 0) + amount;
    }
    
    // Format for chart with category details
    return Object.entries(categoryTotals).map(([categoryId, value]) => {
      const category = categories.find(c => c.id === categoryId);
      return {
        name: category ? category.name : 'Unknown',
        value,
        color: category ? category.color : '#888888',
        icon: category ? category.icon : '❓',
      };
    }).sort((a, b) => b.value - a.value); // Sort by value descending
  }, [transactions, categories, type, dateFilter]);

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  // Get total amount
  const totalAmount = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

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

  // Custom legend
  const renderLegend = () => {
    return (
      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs justify-center mt-4">
        {chartData.map((entry, index) => (
          <li key={`legend-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-1" 
              style={{ backgroundColor: entry.color }} 
            />
            <span className="mr-1">{entry.icon}</span>
            <span>{entry.name}</span>
            <span className="ml-1 font-medium">${entry.value.toFixed(0)}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
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
      </div>

      <div className="h-[250px] w-full">
        {!chartData.length ? (
          <div className="h-full w-full flex items-center justify-center">
            <p className="text-muted-foreground">No {type} data to display for the selected period</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={60}
                  paddingAngle={1}
                  label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} 
                />
              </PieChart>
            </ResponsiveContainer>
            {renderLegend()}
          </>
        )}
      </div>
    </div>
  );
};

export default ExpenseChart;
