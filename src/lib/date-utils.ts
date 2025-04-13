
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear, isWithinInterval } from 'date-fns';

export type DateFilterOption = 'all' | 'today' | 'yesterday' | 'this-week' | 'this-month' | 'last-month' | 'this-year';

export const getDateRangeFromFilter = (filter: DateFilterOption): { start: Date, end: Date } | null => {
  const now = new Date();
  
  switch (filter) {
    case 'today':
      return {
        start: startOfDay(now),
        end: endOfDay(now)
      };
    case 'yesterday':
      const yesterday = subDays(now, 1);
      return {
        start: startOfDay(yesterday),
        end: endOfDay(yesterday)
      };
    case 'this-week':
      return {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 })
      };
    case 'this-month':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now)
      };
    case 'last-month':
      const lastMonth = subMonths(now, 1);
      return {
        start: startOfMonth(lastMonth),
        end: endOfMonth(lastMonth)
      };
    case 'this-year':
      return {
        start: startOfYear(now),
        end: endOfYear(now)
      };
    case 'all':
    default:
      return null;
  }
};

export const isDateInRange = (dateString: string, dateRange: { start: Date, end: Date } | null): boolean => {
  if (!dateRange) return true;
  
  const date = new Date(dateString);
  return isWithinInterval(date, dateRange);
};
