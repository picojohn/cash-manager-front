import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { PanelService } from 'src/app/modules/configuration/panel/services/panel.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  public title: string;
  public idColaborador: number;
  public formPassword: FormGroup;
  public cargarFormularioBoolean: boolean = false;

  constructor(
    public bsModalRef: BsModalRef,
    public toast: ToastrService,
    private errorService: ErrorService,
    private panelService: PanelService,
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.cargarFormularioBoolean = true;
      this.cargarFormularios()
    }, 100);
  }

  cargarFormularios() {
    this.formPassword = new FormGroup({
      password: new FormControl(null, [Validators.required]),
      newPassword: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl(null, [Validators.required]),
    })
  }

  guardarDatos() {
    this.formPassword.markAllAsTouched();
    if (this.formPassword.invalid) return this.toast.info('Debes llenar todos los campos', 'Cambiar contraseña');
    if (this.formPassword.value.newPassword !== this.formPassword.value.confirmPassword) {
      return this.toast.info('Las contraseñas no coinciden', 'Cambiar contraseña');
    }
    firstValueFrom(this.panelService.changePassword({
      password: this.formPassword.value.password,
      newPassword: this.formPassword.value.newPassword,
    })).then(_ => {
      this.toast.success('Contraseña cambiada correctamente', 'Cambiar contraseña');
      this.bsModalRef.hide();
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });
  }
}
