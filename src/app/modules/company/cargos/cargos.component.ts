import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EditarCargosComponent } from './editar-cargos/editar-cargos.component';
import { ICargo } from './interface/cargos.interface';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SweetAlertService } from 'src/app/shared/services/sweetAlert.service';
import { firstValueFrom } from 'rxjs';
import { CargosService } from './services/cargos.service';

@Component({
  selector: 'app-cargos',
  templateUrl: './cargos.component.html',
  styleUrls: ['./cargos.component.css'],
})
export class cargosComponent implements OnInit {
  private bsModalRef: BsModalRef;
  public cargos: Array<ICargo> = [];

  // paginador
  public nPaginas = [5, 10, 20, 50, 100];
  public page: number = 1;
  public totalPaginas = 5; // Establece el valor inicial en 5

  // buscador
  public _buscador: string = '';

  constructor(
    private modalService: BsModalService,
    public toast: ToastrService,
    private errorService: ErrorService,
    private cargosService: CargosService,
    private sweetAlertService: SweetAlertService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  /**
   * carga inicial de datos
   */
  loadData() {
    firstValueFrom(this.cargosService.getCargos()).then(
      (cargosBack) => {
        this.cargos = cargosBack;
      },
      (err) => {
        const errorObject = this.errorService.showNotification(err);
        this.toast[errorObject.typeToast](
          errorObject.message,
          errorObject.typeMessage,
          { timeOut: errorObject.timeOut }
        );
      }
    );
  }

  edit(cargo: ICargo) {
    this.bsModalRef = this.modalService.show(EditarCargosComponent, {
      backdrop: 'static',
      class: 'modal-lg p-5',
    });
    this.bsModalRef.content.title = 'Editar Cargo';
    this.bsModalRef.content.cargo = cargo;
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  new() {
    this.bsModalRef = this.modalService.show(EditarCargosComponent, {
      backdrop: 'static',
      class: 'modal-lg p-5',
    });
    this.bsModalRef.content.title = 'Crear Cargo';
    this.bsModalRef.onHidden?.subscribe((_) => {
      this.loadData();
    });
  }

  /**
   * metodo del controlador de colaborador para cambiar el estdo de un colaborador
   * @param id
   */
  async states(id): Promise<void> {
    if (await this.sweetAlertService.alertStatesMessage()) {
      await firstValueFrom(this.cargosService.cambiarEstadosByid(id)).then(
        (_) => {
          this.toast.success('Estado cambiado correctamente', 'Cargo');
          this.loadData();
        },
        (err) => {
          const errorObject = this.errorService.showNotification(err);
          this.toast[errorObject.typeToast](
            errorObject.message,
            errorObject.typeMessage,
            { timeOut: errorObject.timeOut }
          );
        }
      );
    }
  }

  numeroPaginas($event: any) {
    const { value } = $event.target;
    this.totalPaginas = value;
    this.page = 1;
  }

  // Buscador filtro como tambien que siempre retorne a pagina 1

  set buscador(value: string) {
    this._buscador = value;
    this.page = 1;
  }

  get buscador(): string {
    return this._buscador;
  }

  filtroCargos() {
    if (!this.buscador) {
      return this.cargos;
    }
    return this.cargos.filter((cargo) =>
      cargo.nombres.toLowerCase().includes(this.buscador.toLowerCase())
    );
  }
}
