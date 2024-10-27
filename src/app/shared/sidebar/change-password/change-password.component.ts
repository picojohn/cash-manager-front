import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
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
      id: new FormControl(this.idColaborador),
      password: new FormControl(null, [Validators.required]),
      newPassword: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{6,15}$/)]),
      confirmPassword: new FormControl(null, [Validators.required]),
    })
  }

  guardarDatos() {
    // this.formPassword.markAllAsTouched();
    // if (this.formPassword.invalid) return this.toast.info('Debes llenar todos los datos requeridos del formulario', 'Colaboradores')
    // if (this.formPassword.value.newPassword !== this.formPassword.value.confirmPassword) return this.toast.info('Las contraseñas no son iguales', 'Colaboradores')
    // firstValueFrom(this.collaboratorsService.cambiarContraseña(this.formPassword.value)).then(item => {
    //   this.toast.success(`contraseña cambiada correctamente`, 'Cambiar contraseña')
    //   this.bsModalRef.hide()
    // }, err => {
    //   const errorObject = this.errorService.showNotification(err);
    //   this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    // })



  }

}
