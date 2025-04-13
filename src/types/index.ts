
import { LucideIcon } from "lucide-react";

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
  type: TransactionType;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType | 'both';
}

export interface FinanceData {
  transactions: Transaction[];
  categories: Category[];
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
}

export interface IconOption {
  value: string;
  label: React.ReactNode;
}
