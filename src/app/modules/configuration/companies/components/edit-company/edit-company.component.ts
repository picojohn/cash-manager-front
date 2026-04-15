import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { PanelService } from '../../../panel/services/panel.service';
import { UserStateService } from 'src/app/shared/services/user-state.service';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.css'],
})
export class EditCompanyComponent implements OnInit {
  public title: string;
  public company: any;
  public formCompany: FormGroup;
  public cargarFormulario: boolean = false;

  constructor(
    public bsModalRef: BsModalRef,
    public toast: ToastrService,
    private errorService: ErrorService,
    private panelService: PanelService,
    private userStateService: UserStateService,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.buildForm();
      this.cargarFormulario = true;
    }, 100);
  }

  buildForm() {
    this.formCompany = new FormGroup({
      id: new FormControl(this.company ? this.company.id : null),
      name: new FormControl(this.company ? this.company.name : null, [Validators.required]),
      status: new FormControl(this.company ? this.company.status : 1),
    });
  }

  save() {
    if (this.formCompany.invalid) {
      this.formCompany.markAllAsTouched();
      return this.toast.info('Todos los campos son obligatorios');
    }
    firstValueFrom(
      this.company
        ? this.panelService.editCompany(this.formCompany.value)
        : this.panelService.newCompany(this.formCompany.value)
    ).then(_ => {
      // Si editó la empresa del usuario actual, actualizar el header
      const currentUser = this.userStateService.usuarioActual;
      const formData = this.formCompany.value;
      if (this.company && currentUser && currentUser.idCompany === formData.id) {
        this.userStateService.updateUsuario({ companyName: formData.name });
      }
      this.bsModalRef.hide();
      this.toast.success(`Empresa ${this.company ? 'modificada' : 'creada'} correctamente`);
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });
  }
}
