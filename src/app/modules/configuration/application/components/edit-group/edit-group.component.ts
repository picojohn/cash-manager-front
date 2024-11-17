import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { firstValueFrom } from 'rxjs';
import { IGroup } from '../../interface/application.interface';
import { ApplicationService } from '../../services/application.service';
import { ETitleMessages } from 'src/app/shared/enums/error.service.eum';
import { IDatosUsuario } from 'src/app/authentication/interface/authentication';


@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.css']
})
export class EditGroupComponent {

  public title: string;
  public group: IGroup;
  public formGroup: FormGroup;
  public cargarFormularioBooleam: boolean = false
  public datosUsuario: IDatosUsuario

  constructor(
    public bsModalRef: BsModalRef,
    private applicationService: ApplicationService,
    public toast: ToastrService,
    private errorService: ErrorService,
  ) {

  }

  ngOnInit(): void {
    this.datosUsuario = JSON.parse(localStorage.getItem('datosUsuario'))
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
    this.formGroup = new FormGroup({
      id: new FormControl(this.group ? this.group.id : null),
      name: new FormControl(this.group ? this.group.name : null, [Validators.required]),
      idCompany: new FormControl(this.group ? this.group.idCompany : this.datosUsuario.idCompany, [Validators.required]),
    })
  }

  /**
   * metodo para guardar los datos en el backend
   * @returns IGroup
   */
  saveData() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) return this.toast.info('Debes llenar todos los datos requeridos del formulario', ETitleMessages.GROUPS)
    const rawValue: IGroup = this.formGroup.value;
    firstValueFrom(this.group ? this.applicationService.editGroup(rawValue) : this.applicationService.newGroup(rawValue)).then(_ => {
      this.toast.success(`Grupo ${this.group ? 'modificado' : 'creado'} correctamente`, ETitleMessages.GROUPS)
      this.bsModalRef.hide()
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })

  }



}
