import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { firstValueFrom } from 'rxjs';
import { ICargo } from '../interface/cargos.interface';
import { CargosService } from '../services/cargos.service';

@Component({
  selector: 'app-editar-cargos',
  templateUrl: './editar-cargos.component.html',
  styleUrls: ['./editar-cargos.component.css']
})
export class EditarCargosComponent {
  public title: string;

  public cargo: ICargo;
  public categoriasCargo: Array<any> = []

  public formCargos: FormGroup;

  public cargarFormularioBooleam: boolean = false

  constructor(
    public bsModalRef: BsModalRef,
    private cargosService: CargosService,
    public toast: ToastrService,
    private errorService: ErrorService,
  ) {

  }

  ngOnInit(): void {
      this.loadData()
    setTimeout(() => {
         this.cargarFormularios()
      this.cargarFormularioBooleam = true
    }, 100);
  }

  /**
 * carga inicial de datos
 */
  loadData() {

  }

  cargarFormularios() {
    this.formCargos = new FormGroup({
      id: new FormControl(this.cargo ? this.cargo.id : null),
      nombres: new FormControl(this.cargo ? this.cargo.nombres : null, [Validators.required]),
      estado: new FormControl(this.cargo ? this.cargo.estado : 1, [Validators.required]),
    })
  }

  // guardarDatos() {
  //   this.formCargos.markAllAsTouched();
  //   if (this.formCargos.invalid) return this.toast.info('Debes llenar todos los datos requiridos del formulario', 'Cargo')
  //     const rawValue: ICargo = this.formCargos.value;


  //     firstValueFrom( this.cargo? this.cargosService.editarCargo(rawValue) : this.cargosService.nuevoCargo(rawValue)).then(item => {
  //       this.toast.success(` Cargo ${this.cargo? 'modificado' : 'creado'} correctamente`, 'Cargo')
  //       this.bsModalRef.hide()
  //     }, err => {
  //       const errorObject = this.errorService.showNotification(err);
  //       this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
  //     })

  //  }



}
