import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../service/authentication.service';
import { Router } from '@angular/router';
// import { ErrorService } from '../../../shared/services/error.service';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.css'
})
export class RecoverPasswordComponent implements OnInit {
  /** Login form */
  public loginForm: FormGroup;
  /** boleanos para la carga de datos */
  public booleanCode: boolean = false
  public booleanNewPass: boolean = false
  public booleanEmail: boolean = false
  public booleanButtonEmail: boolean = false

  constructor(
    // public toast: ToastrService,
    public authenticationService: AuthenticationService,
    private router: Router,
    private errorService: ErrorService
  ) { }

  ngOnInit(): void {
    this.booleanEmail = true
    this.buildForm();
  }

  /**
   * Metodo que contruye los formularios
   * @returns void
   */
  private buildForm(): void {
    this.loginForm = new FormGroup(({
      email: new FormControl(null, [Validators.required, Validators.email]),
      code: new FormControl(null),
      newPassword: new FormControl(null,  [Validators.minLength(6), Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{6,15}$/)]),
      confirmPassword: new FormControl(null),
    }));
  }

  /**
   * metodo para enviar el codigo de verificacion al correo
   */
  sendCode() {
    // if (this.loginForm.invalid) {
    //   this.toast.info('Ingresa un correo valido', 'Información');
    // } else {
    //   this.booleanButtonEmail = true
    //   firstValueFrom(this.authenticationService.generateCode(this.loginForm.value)).then(item => {
    //     if (item == true) {
    //       this.toast.success('Revisa en tu correo el codigo enviado', 'Información');
    //       this.booleanEmail = false
    //       this.booleanCode = true
    //     }
    //   }, err => {
    //     this.booleanButtonEmail = false
    //     const errorObject = this.errorService.showNotification(err);
    //     this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });

    //   })

    // }
  }

  validateCode() {
    // if (this.loginForm.value.code == (null || '')) {
    //   this.toast.info('Ingresa un codigo valido', 'Información');
    // } else {
    //   firstValueFrom(this.authenticationService.comprobateCode(this.loginForm.value)).then(item => {
    //     this.booleanCode = false
    //     this.booleanNewPass = true
    //   }, err => {
    //     const errorObject = this.errorService.showNotification(err);
    //     this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });

    //   })
    // }

  }

  newPassword() {
    // if (this.loginForm.value.newPassword == (null || '') || this.loginForm.value.confirmPasswordd == (null || '')) {
    //   this.toast.info('Debes colocar la nueva contraseña valida y confirmarla', 'Recuperar contraseña')
    // } else if (this.loginForm.value.newPassword != this.loginForm.value.confirmPassword) {
    //   this.toast.info('Las contraseñas no son iguales', 'Recuperar contraseña')
    // } else {
    //   firstValueFrom(this.authenticationService.updatePassUserName(this.loginForm.value)).then(i => {
    //     this.toast.success(`Contraseña cambiada correctamente`, 'Nueva contraseña');
    //     this.router.navigate(['/'])
    //   }, err => {
    //     const errorObject = this.errorService.showNotification(err);
    //     this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    //     this.router.navigate(['/'])
    //   })
    // }
  }

  exit() {
    this.router.navigate(['/authentication/login']);
  }

}
