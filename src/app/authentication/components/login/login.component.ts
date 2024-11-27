import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { AuthenticationService } from '../../service/authentication.service';
import { Router } from '@angular/router';
import { ErrorService } from '../../../shared/services/error.service';
import jwt_decode from 'jwt-decode';
import { ETitleMessages } from 'src/app/shared/enums/error.service.eum';
import { IDatosUsuario } from '../../interface/authentication';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  /** Login form */
  public loginForm: FormGroup;
  /** Bandera de se indoca cuando se esta iniciando sesion */
  loadingSession = false;
  /**Mensajes de formulario */
  textIniSesssion = 'Iniciar sesión';


  constructor(
    public toast: ToastrService,
    public authenticationService: AuthenticationService,
    private router: Router,
    private errorService: ErrorService
  ) { }

  /** Ciclo de vida ngOnInit */
  async ngOnInit() {
    localStorage.clear()
    this.buildForm();

  }

  /**
   * Metodo que contruye los formularios
   * @returns void
   */
  private buildForm(): void {
    this.loginForm = new FormGroup(({
      password: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required,
      Validators.pattern(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ),]),
    }));
  }

  /**
  * Metodo que hace login al servicio backend
  * @returns void
  */
  login(): void {
    this.loginForm.markAllAsTouched()
    if (this.loginForm.invalid) {
      this.toast.info('Todos los campos son obligatorios', ETitleMessages.LOGIN);
    }
    else {
      this.loadingSession = true;
      this.textIniSesssion = 'Iniciando sesión...';
      firstValueFrom(this.authenticationService.login(this.loginForm.value)).then(itemLogin => {

        if (itemLogin) {
          let permission = []
          const decodedJSON = jwt_decode(itemLogin['token']);
          const datosUsuario: IDatosUsuario = {
            id: decodedJSON['userLogin']['id'],
            name: decodedJSON['userLogin']['name'],
            lastName: decodedJSON['userLogin']['lastName'],
            userName: decodedJSON['userLogin']['userName'],
            email: decodedJSON['userLogin']['email'],
            mobile: decodedJSON['userLogin']['mobile'],
            idCompany: decodedJSON['userLogin']['idCompany'],
          }
          localStorage.setItem('datosUsuario', JSON.stringify(datosUsuario));
          localStorage.setItem('role', JSON.stringify(decodedJSON['userLogin']['role']));
          // localStorage.setItem('token', itemLogin.token);
          localStorage.setItem('menu', JSON.stringify(itemLogin.menu));

          itemLogin.menu.forEach(module => {
            module.subModules.forEach(subModule => {
              permission.push(subModule);
              subModule.applicationTabs.forEach(applicationTab => {
                const parsedActions = JSON.parse(atob(applicationTab.actions));
                applicationTab.permission = parsedActions.permision;
                delete applicationTab.actions
              });
            });
          });

          let permisos = JSON.stringify(permission)
          localStorage.setItem('permission', permisos);
          this.router.navigate(['gestiones'])
        } else {
          this.toast.error('Usuario o contraseña errada', ETitleMessages.LOGIN);
        }

      }, err => {
        const errorObject = this.errorService.showNotification(err);
        this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
        this.loadingSession = false;
        this.textIniSesssion = 'Iniciar sesión -';
      })
    }



  }

}
