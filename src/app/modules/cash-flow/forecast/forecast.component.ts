import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { CashFlowService } from './services/cash-flow.service';
import {
  ICashFlowAccountBlock,
  ICashFlowForecastResponse,
  ICashFlowWeeklyTotal,
} from './interface/cash-flow.interface';

@Component({
  selector: 'app-cash-flow-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css'],
})
export class ForecastComponent implements OnInit {
  public forecast: ICashFlowForecastResponse | null = null;
  public loading: boolean = false;
  public loadError: string | null = null;

  // Fijo en 5 semanas para el MVP. El selector de granularidad
  // (diario/semanal/mensual/anual) viene en una fase posterior.
  private readonly WEEKS_TO_SHOW = 5;

  public expandedAccounts: { [qbId: string]: boolean } = {};

  constructor(
    public toast: ToastrService,
    private errorService: ErrorService,
    private cashFlowService: CashFlowService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.loadForecast();
  }

  async loadForecast(): Promise<void> {
    this.loading = true;
    this.loadError = null;
    this.forecast = null;
    try {
      const res = await firstValueFrom(this.cashFlowService.getForecast(this.WEEKS_TO_SHOW));
      const normalized = this.normalize(res);
      this.expandedAccounts = {};
      for (const a of normalized.accounts) {
        if (a.qbId) this.expandedAccounts[a.qbId] = false;
      }
      this.forecast = normalized;
    } catch (err) {
      this.loadError = this.handleError(err);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Normaliza el response para que TODOS los bloques (cuentas y consolidado)
   * tengan la misma forma esperada por el template. Sin esto, si el backend
   * llegara a omitir algun campo (totals, weeklyTotals, etc) el *ngFor explota.
   */
  private normalize(res: ICashFlowForecastResponse): ICashFlowForecastResponse {
    const weeksCount = (res.weeks || []).length;
    const accounts = (res.accounts || []).map((b) => this.normalizeBlock(b, weeksCount));
    const consolidated = this.normalizeBlock(res.consolidated, weeksCount);
    return {
      ...res,
      weeks: res.weeks || [],
      accounts,
      consolidated,
    };
  }

  private normalizeBlock(b: ICashFlowAccountBlock, weeksCount: number): ICashFlowAccountBlock {
    const safeWeekly: Array<ICashFlowWeeklyTotal> = [];
    for (let i = 0; i < weeksCount; i++) {
      const w = b?.weeklyTotals?.[i];
      safeWeekly.push({
        weekIndex: i,
        totalIncome: w?.totalIncome ?? 0,
        totalExpense: w?.totalExpense ?? 0,
        net: w?.net ?? 0,
      });
    }
    const padCategoryWeeks = (cat: any) => ({
      categoryKey: cat?.categoryKey ?? '',
      categoryLabel: cat?.categoryLabel ?? '',
      weeks: Array.from({ length: weeksCount }, (_, i) => cat?.weeks?.[i] ?? 0),
      total: cat?.total ?? 0,
    });
    return {
      qbId: b?.qbId ?? null,
      name: b?.name ?? '',
      accountType: b?.accountType ?? null,
      accountSubType: b?.accountSubType ?? null,
      openingBalance: b?.openingBalance ?? 0,
      incomeCategories: (b?.incomeCategories || []).map(padCategoryWeeks),
      expenseCategories: (b?.expenseCategories || []).map(padCategoryWeeks),
      weeklyTotals: safeWeekly,
      totals: {
        income: b?.totals?.income ?? 0,
        expense: b?.totals?.expense ?? 0,
        net: b?.totals?.net ?? 0,
      },
      closingBalance: b?.closingBalance ?? 0,
    };
  }

  toggleAccount(qbId: string | null): void {
    if (!qbId) return;
    this.expandedAccounts[qbId] = !this.expandedAccounts[qbId];
  }

  isAccountExpanded(qbId: string | null): boolean {
    if (!qbId) return true;
    return !!this.expandedAccounts[qbId];
  }

  /** Clase CSS para resaltar negativos en rojo. */
  amountClass(n: number): string {
    if (n > 0.001) return 'amount-positive';
    if (n < -0.001) return 'amount-negative';
    return 'amount-zero';
  }

  /** Suma por columna a lo largo de las semanas del bloque (helper para template). */
  trackByWeekIndex(i: number, w: { weekIndex: number }): number {
    return w.weekIndex;
  }

  trackByCategoryKey(i: number, c: { categoryKey: string }): string {
    return c.categoryKey;
  }

  trackByAccountQbId(i: number, a: ICashFlowAccountBlock): string {
    return a.qbId || 'consolidated';
  }

  private handleError(err: any): string {
    const e = this.errorService.showNotification(err);
    this.toast[e.typeToast](e.message, e.typeMessage, { timeOut: e.timeOut });
    return e.message || 'Error';
  }
}
