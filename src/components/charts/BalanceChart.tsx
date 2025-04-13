
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Transaction } from '@/types';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

interface BalanceChartProps {
  transactions: Transaction[];
}

const BalanceChart: React.FC<BalanceChartProps> = ({ transactions }) => {
  const chartData = useMemo(() => {
    if (!transactions.length) return [];

    // Get date range (current month)
    const today = new Date();
    const start = startOfMonth(today);
    const end = endOfMonth(today);
    
    // Create array of all days in the month
    const days = eachDayOfInterval({ start, end });
    
    // Initialize data with running balance
    let runningBalance = 0;
    
    // Calculate initial balance (from before this month)
    const previousTransactions = transactions.filter(
      t => parseISO(t.date) < start
    );
    
    for (const transaction of previousTransactions) {
      if (transaction.type === 'income') {
        runningBalance += transaction.amount;
      } else {
        runningBalance -= transaction.amount;
      }
    }
    
    // Process each day
    return days.map(day => {
      // Find transactions for this day
      const dayTransactions = transactions.filter(transaction => 
        isSameDay(parseISO(transaction.date), day)
      );
      
      // Calculate income and expenses for the day
      let income = 0;
      let expense = 0;
      
      for (const transaction of dayTransactions) {
        if (transaction.type === 'income') {
          income += transaction.amount;
          runningBalance += transaction.amount;
        } else {
          expense += transaction.amount;
          runningBalance -= transaction.amount;
        }
      }
      
      return {
        date: format(day, 'MMM dd'),
        income,
        expense,
        balance: Math.max(0, runningBalance) // Ensure balance doesn't go negative for visual purposes
      };
    });
  }, [transactions]);

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 10 }} 
            tickFormatter={(value) => value.split(' ')[1]}
          />
          <YAxis 
            tick={{ fontSize: 10 }} 
            tickFormatter={(value) => `$${value}`} 
          />
          <Tooltip 
            formatter={(value: number) => [`$${value.toFixed(2)}`, '']} 
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="balance" 
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorBalance)" 
            name="Balance"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BalanceChart;
