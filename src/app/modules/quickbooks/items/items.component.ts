import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SweetAlertService } from 'src/app/shared/services/sweetAlert.service';
import { ItemsService } from './services/items.service';
import { IQbItem } from './interface/item.interface';
import { EditItemComponent } from './components/edit-item/edit-item.component';
import { AdjustStockComponent } from './components/adjust-stock/adjust-stock.component';

type FilterStatus = 'all' | 'active' | 'inactive';

@Component({
  selector: 'app-qb-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
})
export class ItemsComponent implements OnInit {
  public items: Array<IQbItem> = [];
  public loading: boolean = false;
  public loadError: string | null = null;
  public syncing: boolean = false;

  public filterStatus: FilterStatus = 'all';
  public statusOptions: Array<{ value: FilterStatus; label: string }> = [];

  public filterType: string = 'all';
  public typeOptions: Array<{ value: string; label: string }> = [];

  public nPaginas = [10, 25, 50, 100];
  public totalPaginas = 10;
  public page: number = 1;
  public _buscador: string = '';

  private bsModalRef: BsModalRef;

  constructor(
    public toast: ToastrService,
    private errorService: ErrorService,
    private itemsService: ItemsService,
    private modalService: BsModalService,
    private sweetAlertService: SweetAlertService,
    private translate: TranslateService,
  ) {}

  async toggleActive(item: IQbItem): Promise<void> {
    const willActivate = item.active !== 1;
    const confirmed = await this.sweetAlertService.alertStatesMessage();
    if (!confirmed) return;

    try {
      await firstValueFrom(
        this.itemsService.updateItem(item.qbId, { active: willActivate }),
      );
      const toastKey = willActivate ? 'QUICKBOOKS.TOAST_ITEM_ACTIVATED' : 'QUICKBOOKS.TOAST_ITEM_DEACTIVATED';
      this.toast.success(this.translate.instant(toastKey));
      await this.loadItems();
    } catch (err) {
      this.handleError(err);
    }
  }

  newItem(): void {
    this.bsModalRef = this.modalService.show(EditItemComponent, {
      backdrop: 'static',
      class: 'modal-lg p-5',
    });
    this.bsModalRef.content.title = this.translate.instant('QUICKBOOKS.MODAL_CREATE_ITEM');
    this.bsModalRef.content.item = null;
    this.bsModalRef.onHidden?.subscribe(() => this.loadItems());
  }

  editItem(item: IQbItem): void {
    this.bsModalRef = this.modalService.show(EditItemComponent, {
      backdrop: 'static',
      class: 'modal-lg p-5',
    });
    this.bsModalRef.content.title = this.translate.instant('QUICKBOOKS.MODAL_EDIT_ITEM');
    this.bsModalRef.content.item = item;
    this.bsModalRef.onHidden?.subscribe(() => this.loadItems());
  }

  adjustStock(item: IQbItem): void {
    this.bsModalRef = this.modalService.show(AdjustStockComponent, {
      backdrop: 'static',
      class: 'modal-lg p-5',
    });
    this.bsModalRef.content.item = item;
    this.bsModalRef.onHidden?.subscribe(() => this.loadItems());
  }

  ngOnInit(): void {
    this.buildOptions();
    this.translate.onLangChange.subscribe(() => this.buildOptions());
    this.loadItems();
  }

  private buildOptions(): void {
    this.statusOptions = [
      { value: 'all', label: this.translate.instant('QUICKBOOKS.FILTER_ALL') },
      { value: 'active', label: this.translate.instant('QUICKBOOKS.FILTER_ACTIVE') },
      { value: 'inactive', label: this.translate.instant('QUICKBOOKS.FILTER_INACTIVE') },
    ];
    this.typeOptions = [
      { value: 'all', label: this.translate.instant('QUICKBOOKS.FILTER_ALL') },
      { value: 'Service', label: 'Service' },
      { value: 'Inventory', label: 'Inventory' },
      { value: 'NonInventory', label: 'NonInventory' },
    ];
  }

  async loadItems(): Promise<void> {
    const isInitialLoad = this.items.length === 0;
    if (isInitialLoad) this.loading = true;
    this.loadError = null;
    try {
      const res = await firstValueFrom(this.itemsService.getItems(0, 1000));
      this.items = (res.items || []).sort(
        (a, b) => Number(b.qbId || 0) - Number(a.qbId || 0),
      );
    } catch (err) {
      this.loadError = this.handleError(err);
    } finally {
      if (isInitialLoad) this.loading = false;
    }
  }

  async syncNow(): Promise<void> {
    if (this.syncing) return;
    this.syncing = true;
    try {
      const result = await firstValueFrom(this.itemsService.syncItems());
      const msg = `${this.translate.instant('QUICKBOOKS.TOAST_SYNC_OK')}: ${result.recordsCreated} ${this.translate.instant('QUICKBOOKS.RESULT_NEW')}, ${result.recordsUpdated} ${this.translate.instant('QUICKBOOKS.RESULT_UPDATED')}`;
      this.toast.success(msg);
      await this.loadItems();
    } catch (err) {
      this.handleError(err);
    } finally {
      this.syncing = false;
    }
  }

  filterData(): Array<IQbItem> {
    let list = this.items;
    if (this.filterStatus === 'active') {
      list = list.filter((x) => x.active === 1);
    } else if (this.filterStatus === 'inactive') {
      list = list.filter((x) => x.active !== 1);
    }
    if (this.filterType !== 'all') {
      list = list.filter((x) => x.type === this.filterType);
    }
    if (this._buscador) {
      const q = this._buscador.toLowerCase();
      list = list.filter(
        (x) =>
          x.name?.toLowerCase().includes(q) ||
          x.sku?.toLowerCase().includes(q) ||
          x.qbId?.toLowerCase().includes(q),
      );
    }
    return list;
  }

  onFilterChange(): void {
    this.page = 1;
  }

  typeClass(type: string): string {
    switch (type) {
      case 'Service':
        return 'type-service';
      case 'Inventory':
        return 'type-inventory';
      case 'NonInventory':
        return 'type-noninventory';
      case 'Group':
        return 'type-group';
      default:
        return '';
    }
  }

  numeroPaginas($event: any) {
    this.totalPaginas = parseInt($event.target.value, 10);
    this.page = 1;
  }

  set buscador(value: string) {
    this._buscador = value;
    this.page = 1;
  }
  get buscador(): string {
    return this._buscador;
  }

  private handleError(err: any): string {
    const e = this.errorService.showNotification(err);
    this.toast[e.typeToast](e.message, e.typeMessage, { timeOut: e.timeOut });
    return e.message || 'Error';
  }
}
