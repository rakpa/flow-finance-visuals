
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Transaction, Category, ChartData } from '@/types';

interface ExpenseChartProps {
  transactions: Transaction[];
  categories: Category[];
  type: 'income' | 'expense';
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ transactions, categories, type }) => {
  const chartData = useMemo(() => {
    // Filter transactions by type
    const filteredTransactions = transactions.filter(t => t.type === type);
    
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
  }, [transactions, categories, type]);

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  // Get total amount
  const totalAmount = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

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

  if (!chartData.length) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">No {type} data to display</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
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
    </div>
  );
};

export default ExpenseChart;
