import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { CashFlowService } from './services/cash-flow.service';
import {
  ICashFlowAccountBlock,
  ICashFlowCategoryRow,
  ICashFlowForecastResponse,
  ICashFlowSubgroupRow,
  ICashFlowWeekValue,
  ICashFlowWeeklyTotal,
} from './interface/cash-flow.interface';
import { InvoiceDetailsModalComponent } from './components/invoice-details-modal/invoice-details-modal.component';

@Component({
  selector: 'app-cash-flow-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css'],
})
export class ForecastComponent implements OnInit {
  public forecast: ICashFlowForecastResponse | null = null;
  public loading: boolean = false;
  public loadError: string | null = null;

  // Mes seleccionado para la vista. Default: mes actual.
  public selectedYear: number;
  public selectedMonth: number; // 1-12

  public expandedAccounts: { [qbId: string]: boolean } = {};
  // Expansion de categoria por bloque: clave `${blockKey}__${categoryKey}`
  public expandedCategories: { [k: string]: boolean } = {};

  private bsModalRef: BsModalRef;

  constructor(
    public toast: ToastrService,
    private errorService: ErrorService,
    private cashFlowService: CashFlowService,
    private modalService: BsModalService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.selectedYear = today.getFullYear();
    this.selectedMonth = today.getMonth() + 1;
    this.loadForecast();
  }

  async loadForecast(): Promise<void> {
    this.loading = true;
    this.loadError = null;
    this.forecast = null;
    try {
      const res = await firstValueFrom(
        this.cashFlowService.getForecast(this.selectedYear, this.selectedMonth),
      );
      const normalized = this.normalize(res);
      this.expandedAccounts = {};
      for (const a of normalized.accounts) {
        if (a.qbId) this.expandedAccounts[a.qbId] = false;
      }
      this.expandedCategories = {};
      this.forecast = normalized;
    } catch (err) {
      this.loadError = this.handleError(err);
    } finally {
      this.loading = false;
    }
  }

  /** Avanza/retrocede un mes y recarga. */
  changeMonth(delta: number): void {
    let y = this.selectedYear;
    let m = this.selectedMonth + delta;
    if (m < 1) {
      m = 12;
      y -= 1;
    } else if (m > 12) {
      m = 1;
      y += 1;
    }
    this.selectedYear = y;
    this.selectedMonth = m;
    this.loadForecast();
  }

  goToCurrentMonth(): void {
    const today = new Date();
    this.selectedYear = today.getFullYear();
    this.selectedMonth = today.getMonth() + 1;
    this.loadForecast();
  }

  /** Texto "Mayo 2026" o similar segun idioma. */
  get selectedMonthLabel(): string {
    if (!this.selectedYear || !this.selectedMonth) return '';
    const date = new Date(this.selectedYear, this.selectedMonth - 1, 1);
    const lang = this.translate.currentLang || 'es';
    return date.toLocaleDateString(lang === 'es' ? 'es-PA' : 'en-US', {
      month: 'long',
      year: 'numeric',
    });
  }

  get isCurrentMonth(): boolean {
    const today = new Date();
    return (
      this.selectedYear === today.getFullYear() &&
      this.selectedMonth === today.getMonth() + 1
    );
  }

  // ============== Toggles de expansion ==============

  toggleAccount(qbId: string | null): void {
    if (!qbId) return;
    this.expandedAccounts[qbId] = !this.expandedAccounts[qbId];
  }

  isAccountExpanded(qbId: string | null): boolean {
    if (!qbId) return true;
    return !!this.expandedAccounts[qbId];
  }

  toggleCategory(blockKey: string, categoryKey: string): void {
    const k = `${blockKey}__${categoryKey}`;
    this.expandedCategories[k] = !this.expandedCategories[k];
  }

  isCategoryExpanded(blockKey: string, categoryKey: string): boolean {
    return !!this.expandedCategories[`${blockKey}__${categoryKey}`];
  }

  openInvoicesModal(subgroup: ICashFlowSubgroupRow): void {
    if (!subgroup.plannedInvoices || subgroup.plannedInvoices.length === 0) return;
    this.bsModalRef = this.modalService.show(InvoiceDetailsModalComponent, {
      backdrop: 'static',
      class: 'modal-xl p-5',
    });
    this.bsModalRef.content.customerName = subgroup.subgroupLabel;
    this.bsModalRef.content.invoices = subgroup.plannedInvoices;
    this.bsModalRef.content.weeks = this.forecast?.weeks || [];
  }

  // ============== Helpers de presentacion ==============

  amountClass(n: number): string {
    if (n > 0.001) return 'amount-positive';
    if (n < -0.001) return 'amount-negative';
    return 'amount-zero';
  }

  /** Devuelve cantidad de columnas para colspans dinamicos. */
  get totalColsCount(): number {
    if (!this.forecast) return 0;
    const weeksCols = this.forecast.weeks.length * 2; // P + E por semana
    return 2 + weeksCols + 2 + 2; // header(account+balance) + weeks*2 + total(2) + closing(2)
  }

  trackByWeekIndex(_: number, w: { weekIndex: number }): number {
    return w.weekIndex;
  }
  trackByIndex(i: number): number {
    return i;
  }
  trackByCategoryKey(_: number, c: { categoryKey: string }): string {
    return c.categoryKey;
  }
  trackBySubgroupKey(_: number, s: { subgroupKey: string }): string {
    return s.subgroupKey;
  }
  trackByAccountQbId(_: number, a: ICashFlowAccountBlock): string {
    return a.qbId || 'consolidated';
  }

  // ============== Normalize del response ==============

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
        plannedIncome: w?.plannedIncome ?? 0,
        actualIncome: w?.actualIncome ?? 0,
        plannedExpense: w?.plannedExpense ?? 0,
        actualExpense: w?.actualExpense ?? 0,
        plannedNet: w?.plannedNet ?? 0,
        actualNet: w?.actualNet ?? 0,
      });
    }
    return {
      qbId: b?.qbId ?? null,
      name: b?.name ?? '',
      accountType: b?.accountType ?? null,
      accountSubType: b?.accountSubType ?? null,
      openingBalance: b?.openingBalance ?? 0,
      incomeCategories: (b?.incomeCategories || []).map((c) => this.normalizeCategory(c, weeksCount)),
      expenseCategories: (b?.expenseCategories || []).map((c) => this.normalizeCategory(c, weeksCount)),
      weeklyTotals: safeWeekly,
      totals: {
        plannedIncome: b?.totals?.plannedIncome ?? 0,
        actualIncome: b?.totals?.actualIncome ?? 0,
        plannedExpense: b?.totals?.plannedExpense ?? 0,
        actualExpense: b?.totals?.actualExpense ?? 0,
        plannedNet: b?.totals?.plannedNet ?? 0,
        actualNet: b?.totals?.actualNet ?? 0,
      },
      closingBalancePlanned: b?.closingBalancePlanned ?? 0,
      closingBalanceActual: b?.closingBalanceActual ?? 0,
    };
  }

  private normalizeCategory(c: ICashFlowCategoryRow, weeksCount: number): ICashFlowCategoryRow {
    return {
      categoryKey: c?.categoryKey ?? '',
      categoryLabel: c?.categoryLabel ?? '',
      weeks: this.padWeekValues(c?.weeks, weeksCount),
      totals: {
        planned: c?.totals?.planned ?? 0,
        actual: c?.totals?.actual ?? 0,
      },
      subgroups: (c?.subgroups || []).map((s) => ({
        subgroupKey: s?.subgroupKey ?? '',
        subgroupLabel: s?.subgroupLabel ?? '',
        weeks: this.padWeekValues(s?.weeks, weeksCount),
        totals: {
          planned: s?.totals?.planned ?? 0,
          actual: s?.totals?.actual ?? 0,
        },
        plannedInvoices: s?.plannedInvoices || [],
      })),
    };
  }

  private padWeekValues(
    arr: Array<ICashFlowWeekValue> | undefined,
    weeksCount: number,
  ): Array<ICashFlowWeekValue> {
    const out: Array<ICashFlowWeekValue> = [];
    for (let i = 0; i < weeksCount; i++) {
      const v = arr?.[i];
      out.push({ planned: v?.planned ?? 0, actual: v?.actual ?? 0 });
    }
    return out;
  }

  private handleError(err: any): string {
    const e = this.errorService.showNotification(err);
    this.toast[e.typeToast](e.message, e.typeMessage, { timeOut: e.timeOut });
    return e.message || 'Error';
  }
}
