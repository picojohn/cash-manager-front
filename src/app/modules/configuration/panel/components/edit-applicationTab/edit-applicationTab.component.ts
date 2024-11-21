import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { firstValueFrom } from 'rxjs';
import { IApplicationTab, IModule, ISubModule } from '../../interface/panel.interface';
import { PanelService } from '../../services/panel.service';
import { constFreeIcons } from 'src/app/shared/data/const';
import { ETitleMessages } from 'src/app/shared/enums/error.service.eum';


@Component({
  selector: 'app-edit-applicationTab',
  templateUrl: './edit-applicationTab.component.html',
  styleUrls: ['./edit-applicationTab.component.css']
})
export class EditApplicationTabComponent {

  public title: string;
  public applicationTab: IApplicationTab;
  public formApplicationTab: FormGroup;
  public cargarFormularioBooleam: boolean = false
  public freeIcons = constFreeIcons
  public modules: Array<IModule> = []
  public subModules: Array<ISubModule> = []
  public subModulesSelected: Array<ISubModule> = []

  constructor(
    public bsModalRef: BsModalRef,
    private panelService: PanelService,
    public toast: ToastrService,
    private errorService: ErrorService,
  ) {

  }

  ngOnInit(): void {
    this.loadData()
    setTimeout(() => {
      this.buildForms()
      this.cargarFormularioBooleam = true
    }, 500);
  }

  /**
 * carga inicial de datos
 */
async  loadData() {
  await  firstValueFrom(this.panelService.getAllSubModules()).then(itemSubmodule => {
      this.subModulesSelected = itemSubmodule
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })
  await  firstValueFrom(this.panelService.getAllModules()).then(itemModule => {
      this.modules = itemModule
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
    this.formApplicationTab = new FormGroup({
      id: new FormControl(this.applicationTab ? this.applicationTab.id : null),
      name: new FormControl(this.applicationTab ? this.applicationTab.name : null, [Validators.required]),
      icon: new FormControl(this.applicationTab ? this.applicationTab.icon : null, [Validators.required]),
      idModule: new FormControl(this.applicationTab ? this.applicationTab.idModule : null, [Validators.required]),
      idSubModule: new FormControl(this.applicationTab ? this.applicationTab.idSubModule : null, [Validators.required]),
      state: new FormControl(this.applicationTab ? Number(this.applicationTab.state) : 1, [Validators.required]),
    })
    if(this.applicationTab){
      this.subModules = this.subModulesSelected.filter(item => item.idModule == this.applicationTab.idModule)
    }
  }

  selectModule(){
    this.formApplicationTab.controls['idSubModule'].setValue(null)
    if(this.formApplicationTab.value.idModule == null){
      this.subModules = []
    } else {
      this.subModules = this.subModulesSelected.filter(item => item.idModule == this.formApplicationTab.value.idModule)
    }
  }

  saveData() {
    this.formApplicationTab.markAllAsTouched();
    if (this.formApplicationTab.invalid) return this.toast.info('Debes llenar todos los datos requiridos del formulario', ETitleMessages.APPLICATIONTAB)
    const rawValue: IApplicationTab = this.formApplicationTab.value;
    firstValueFrom(this.applicationTab ? this.panelService.editApplicationTab(rawValue) : this.panelService.newApplicationTab(rawValue)).then(_ => {
      this.toast.success(` Pestaña ${this.applicationTab ? 'modificado' : 'creado'} correctamente`, ETitleMessages.APPLICATIONTAB)
      this.bsModalRef.hide()
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })

  }



}
