import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { firstValueFrom } from 'rxjs';
import { ETitleMessages } from 'src/app/shared/enums/error.service.eum';
import { IRole } from '../../interface/panel.interface';
import { PanelService } from '../../services/panel.service';



@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.css']
})
export class EditRoleComponent {

  public title: string;
  public role: IRole;
  public formRole: FormGroup;
  public cargarFormularioBooleam: boolean = false


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
    }, 100);
  }

  /**
 * carga inicial de datos
 */
  loadData() {
  }

  /**
   * Medoto que construye los formularios
   * @returns void
   */
  buildForms(): void {
    this.formRole = new FormGroup({
      id: new FormControl(this.role ? this.role.id : null),
      name: new FormControl(this.role ? this.role.name : null, [Validators.required]),
      state: new FormControl(this.role ? this.role.state : 1, [Validators.required]),
    })
  }

  /**
   * metodo para guardar los datos ne le backend
   * @returns IRole
   */
  saveData() {
    this.formRole.markAllAsTouched();
    if (this.formRole.invalid) return this.toast.info('Debes llenar todos los datos requiridos del formulario', ETitleMessages.ROLES)
    const rawValue: IRole = this.formRole.value;
    firstValueFrom(this.role ? this.panelService.editRol(rawValue) : this.panelService.newRol(rawValue)).then(item => {
      this.toast.success(` Rol ${this.role ? 'modificado' : 'creado'} correctamente`, ETitleMessages.ROLES)
      this.bsModalRef.hide()
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })

  }



}
