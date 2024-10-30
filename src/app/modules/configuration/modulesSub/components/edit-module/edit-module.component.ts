import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { firstValueFrom } from 'rxjs';
import { IModule } from '../../interface/modulesSub.interface';
import { ModulesSubService } from '../../services/modulesSub.service';
import { constFreeIcons } from 'src/app/shared/data/const';


@Component({
  selector: 'app-edit-module',
  templateUrl: './edit-module.component.html',
  styleUrls: ['./edit-module.component.css']
})
export class EditModuleComponent {

  public title: string;
  public module: IModule;
  public formModule: FormGroup;
  public cargarFormularioBooleam: boolean = false
  public freeIcons = constFreeIcons

  constructor(
    public bsModalRef: BsModalRef,
    private modulesSubService: ModulesSubService,
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
    // firstValueFrom(this.currencyService.getCurrencies()).then(item => {
    //   this.currencies = item
    // })
  }

  cargarFormularios() {
    this.formModule = new FormGroup({
      id: new FormControl(this.module ? this.module.id : null),
      name: new FormControl(this.module ? this.module.name : null, [Validators.required]),
      path: new FormControl(this.module ? this.module.path : null, [Validators.required]),
      icon: new FormControl(this.module ? this.module.icon : null, [Validators.required]),

    })
  }

  saveData() {
    this.formModule.markAllAsTouched();
    if (this.formModule.invalid) return this.toast.info('Debes llenar todos los datos requiridos del formulario', 'Modulos')
    const rawValue: IModule = this.formModule.value;
    firstValueFrom(this.module ? this.modulesSubService.editModule(rawValue) : this.modulesSubService.newModule(rawValue)).then(item => {
      this.toast.success(` Modulos ${this.module ? 'modificado' : 'creado'} correctamente`, 'Modulo')
      this.bsModalRef.hide()
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })

  }



}
