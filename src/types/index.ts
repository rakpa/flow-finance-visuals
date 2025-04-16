
import { LucideIcon } from "lucide-react";

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
  type: TransactionType;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType | 'both';
  created_at?: string;
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

// Database types
export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string;
          amount: number;
          description: string;
          date: string;
          category_id: string;
          type: TransactionType;
          created_at?: string;
        };
        Insert: Omit<Transaction, 'id' | 'created_at' | 'categoryId'> & { category_id: string };
        Update: Partial<Omit<Transaction, 'id' | 'created_at' | 'categoryId'> & { category_id: string }>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          icon: string;
          color: string;
          type: TransactionType | 'both';
          created_at?: string;
        };
        Insert: Omit<Category, 'id' | 'created_at'>;
        Update: Partial<Omit<Category, 'id' | 'created_at'>>;
      };
    };
  };
}
