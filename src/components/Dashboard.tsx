
import { useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart4,
  ArrowRight
} from 'lucide-react';
import { Transaction, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BalanceChart from './charts/BalanceChart';
import ExpenseChart from './charts/ExpenseChart';
import TransactionList from './TransactionList';

interface DashboardProps {
  transactions: Transaction[];
  categories: Category[];
  onDeleteTransaction: (id: string) => void;
}

const Dashboard = ({ transactions, categories, onDeleteTransaction }: DashboardProps) => {
  // Calculate summary data
  const summary = useMemo(() => {
    let totalIncome = 0;
    let totalExpenses = 0;
    
    // Current month transactions
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const currentMonthTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });
    
    for (const transaction of currentMonthTransactions) {
      if (transaction.type === 'income') {
        totalIncome += transaction.amount;
      } else {
        totalExpenses += transaction.amount;
      }
    }
    
    const balance = totalIncome - totalExpenses;
    
    return {
      income: totalIncome,
      expenses: totalExpenses,
      balance,
      trend: balance >= 0 ? 'positive' : 'negative',
    };
  }, [transactions]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Get recent transactions
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Balance Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Balance</CardDescription>
            <CardTitle className="text-3xl">
              {formatCurrency(summary.balance)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {summary.trend === 'positive' ? (
                <TrendingUp className="mr-2 h-4 w-4 text-finance-income" />
              ) : (
                <TrendingDown className="mr-2 h-4 w-4 text-finance-expense" />
              )}
              <span className={summary.trend === 'positive' ? 'text-finance-income' : 'text-finance-expense'}>
                {summary.trend === 'positive' ? 'Positive' : 'Negative'} balance
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Income Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Monthly Income</CardDescription>
            <CardTitle className="text-3xl text-finance-income">
              {formatCurrency(summary.income)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-finance-income" />
              <span className="text-muted-foreground">Money coming in</span>
            </div>
          </CardContent>
        </Card>

        {/* Expense Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Monthly Expenses</CardDescription>
            <CardTitle className="text-3xl text-finance-expense">
              {formatCurrency(summary.expenses)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingDown className="mr-2 h-4 w-4 text-finance-expense" />
              <span className="text-muted-foreground">Money going out</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
          <CardDescription>Track your balance, income, and expenses over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="balance">
            <TabsList className="mb-4">
              <TabsTrigger value="balance">Balance Trend</TabsTrigger>
              <TabsTrigger value="income">Income Breakdown</TabsTrigger>
              <TabsTrigger value="expenses">Expense Breakdown</TabsTrigger>
            </TabsList>
            <TabsContent value="balance">
              <BalanceChart transactions={transactions} />
            </TabsContent>
            <TabsContent value="income">
              <ExpenseChart 
                transactions={transactions} 
                categories={categories} 
                type="income" 
              />
            </TabsContent>
            <TabsContent value="expenses">
              <ExpenseChart 
                transactions={transactions} 
                categories={categories} 
                type="expense" 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest financial activities</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => document.getElementById('transactions')?.scrollIntoView({ behavior: 'smooth' })}>
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <TransactionList 
            transactions={recentTransactions} 
            categories={categories}
            onDeleteTransaction={onDeleteTransaction}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
