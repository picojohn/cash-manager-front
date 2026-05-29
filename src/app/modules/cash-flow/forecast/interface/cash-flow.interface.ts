/**
 * Interfaces del modulo Cash Flow Forecast en el front.
 * Espejo del backend `cash-flow.interface.ts` (Fase 2.2).
 */

export interface ICashFlowWeek {
  weekIndex: number;
  startDate: string;
  endDate: string;
  label: string;
}

export interface ICashFlowWeekValue {
  planned: number;
  actual: number;
}

export interface ICashFlowInvoiceDetail {
  weekIndex: number;
  qbId: string;
  docNumber: string | null;
  dueDate: string | null;
  termsName: string | null;
  subtotal: number;
  totalTax: number;
  totalAmt: number;
  balance: number;
}

export interface ICashFlowSubgroupRow {
  subgroupKey: string;
  subgroupLabel: string;
  weeks: Array<ICashFlowWeekValue>;
  totals: { planned: number; actual: number };
  plannedInvoices?: Array<ICashFlowInvoiceDetail>;
}

export interface ICashFlowCategoryRow {
  categoryKey: string;
  categoryLabel: string;
  weeks: Array<ICashFlowWeekValue>;
  totals: { planned: number; actual: number };
  subgroups?: Array<ICashFlowSubgroupRow>;
}

export interface ICashFlowWeeklyTotal {
  weekIndex: number;
  plannedIncome: number;
  actualIncome: number;
  plannedExpense: number;
  actualExpense: number;
  plannedNet: number;
  actualNet: number;
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
  totals: {
    plannedIncome: number;
    actualIncome: number;
    plannedExpense: number;
    actualExpense: number;
    plannedNet: number;
    actualNet: number;
  };
  closingBalancePlanned: number;
  closingBalanceActual: number;
}

export interface ICashFlowForecastResponse {
  generatedAt: string;
  startDate: string;
  endDate: string;
  weeks: Array<ICashFlowWeek>;
  accounts: Array<ICashFlowAccountBlock>;
  consolidated: ICashFlowAccountBlock;
}
