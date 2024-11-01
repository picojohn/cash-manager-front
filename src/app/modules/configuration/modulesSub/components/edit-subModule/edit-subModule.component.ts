import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { firstValueFrom } from 'rxjs';
import { IModule, ISubModule } from '../../interface/modulesSub.interface';
import { ModulesSubService } from '../../services/modulesSub.service';
import { constFreeIcons } from 'src/app/shared/data/const';
import { ETitleMessages } from 'src/app/shared/enums/error.service.eum';


@Component({
  selector: 'app-edit-subModule',
  templateUrl: './edit-subModule.component.html',
  styleUrls: ['./edit-subModule.component.css']
})
export class EditSubModuleComponent {

  public title: string;
  public subModule: ISubModule;
  public formSubModule: FormGroup;
  public cargarFormularioBooleam: boolean = false
  public freeIcons = constFreeIcons
  public modules: Array<IModule> = []

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
      this.buildForms()
      this.cargarFormularioBooleam = true
    }, 100);
  }

  /**
 * carga inicial de datos
 */
  loadData() {
    firstValueFrom(this.modulesSubService.getModulesAll()).then(item => {
      this.modules = item
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })
  }

  /**
   * Medoto que construye los formularios
   * @returns void
   */
  buildForms(): void {
    this.formSubModule = new FormGroup({
      id: new FormControl(this.subModule ? this.subModule.id : null),
      name: new FormControl(this.subModule ? this.subModule.name : null, [Validators.required]),
      path: new FormControl(this.subModule ? this.subModule.path : null, [Validators.required]),
      icon: new FormControl(this.subModule ? this.subModule.icon : null, [Validators.required]),
      idModule: new FormControl(this.subModule ? this.subModule.idModule : null, [Validators.required]),
      state: new FormControl(this.subModule ? Number(this.subModule.state) : 1, [Validators.required]),

    })
  }

  saveData() {
    this.formSubModule.markAllAsTouched();
    if (this.formSubModule.invalid) return this.toast.info('Debes llenar todos los datos requiridos del formulario', ETitleMessages.SUBMODULE)
    const rawValue: ISubModule = this.formSubModule.value;
    firstValueFrom(this.subModule ? this.modulesSubService.editSubModule(rawValue) : this.modulesSubService.newSubModule(rawValue)).then(_ => {
      this.toast.success(` SubModulo ${this.subModule ? 'modificado' : 'creado'} correctamente`, ETitleMessages.SUBMODULE)
      this.bsModalRef.hide()
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })

  }



}
