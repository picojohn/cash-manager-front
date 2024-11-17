import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { firstValueFrom } from 'rxjs';
import { IModule } from '../../interface/panel.interface';
import { PanelService } from '../../services/panel.service';
import { constFreeIcons } from 'src/app/shared/data/const';
import { ETitleMessages } from 'src/app/shared/enums/error.service.eum';


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
    private panelService: PanelService,
    public toast: ToastrService,
    private errorService: ErrorService,
  ) {

  }

  /**
   * carga datos angular
   */
  ngOnInit(): void {
    setTimeout(() => {
      this.buildForms()
      this.cargarFormularioBooleam = true
    }, 100);
  }

  /**
   * Medoto que construye los formularios
   * @returns void
   */
  buildForms(): void {
    this.formModule = new FormGroup({
      id: new FormControl(this.module ? this.module.id : null),
      name: new FormControl(this.module ? this.module.name : null, [Validators.required]),
      path: new FormControl(this.module ? this.module.path : null, [Validators.required]),
      icon: new FormControl(this.module ? this.module.icon : null, [Validators.required]),
    })
  }

  /**
   * metodo para guardar los datos en el backend
   * @returns IModule
   */
  saveData() {
    this.formModule.markAllAsTouched();
    if (this.formModule.invalid) return this.toast.info('Debes llenar todos los datos requiridos del formulario', ETitleMessages.MODULE)
    const rawValue: IModule = this.formModule.value;
    firstValueFrom(this.module ? this.panelService.editModule(rawValue) : this.panelService.newModule(rawValue)).then(item => {
      this.toast.success(` Modulos ${this.module ? 'modificado' : 'creado'} correctamente`, ETitleMessages.MODULE)
      this.bsModalRef.hide()
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })

  }



}
