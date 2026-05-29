/**
 * Interfaces del modulo Cash Flow Forecast en el front.
 * Espejo del backend `cash-flow.interface.ts` (Fase 2.1).
 */

export interface ICashFlowWeek {
  weekIndex: number;
  startDate: string;
  endDate: string;
  label: string;
}

export interface ICashFlowCategoryRow {
  categoryKey: string;
  categoryLabel: string;
  weeks: Array<number>;
  total: number;
}

export interface ICashFlowWeeklyTotal {
  weekIndex: number;
  totalIncome: number;
  totalExpense: number;
  net: number;
}

export interface ICashFlowAccountBlock {
  qbId: string | null;
  name: string;
  accountType: string | null;
  accountSubType: string | null;
  openingBalance: number;
  incomeCategories: Array<ICashFlowCategoryRow>;
  expenseCategories: Array<ICashFlowCategoryRow>;
  weeklyTotals: Array<ICashFlowWeeklyTotal>;
  totals: { income: number; expense: number; net: number };
  closingBalance: number;
}

export interface ICashFlowForecastResponse {
  generatedAt: string;
  startDate: string;
  endDate: string;
  weeks: Array<ICashFlowWeek>;
  accounts: Array<ICashFlowAccountBlock>;
  consolidated: ICashFlowAccountBlock;
}
