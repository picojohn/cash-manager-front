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

  public loginForm: FormGroup;
  loadingSession = false;
  textIniSesssion = 'Iniciar sesión';

  constructor(
    public toast: ToastrService,
    public authenticationService: AuthenticationService,
    private router: Router,
    private errorService: ErrorService
  ) { }

  async ngOnInit() {
    localStorage.clear()
    this.buildForm();
  }

  private buildForm(): void {
    this.loginForm = new FormGroup(({
      password: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required,
      Validators.pattern(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ),]),
    }));
  }

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
            email: decodedJSON['userLogin']['email'],
            phone: decodedJSON['userLogin']['phone'],
            idCompany: decodedJSON['userLogin']['idCompany'],
          }
          localStorage.setItem('datosUsuario', JSON.stringify(datosUsuario));
          localStorage.setItem('role', JSON.stringify(decodedJSON['userLogin']['role']));
          localStorage.setItem('token', itemLogin.token);
          localStorage.setItem('menu', JSON.stringify(itemLogin.menu));

          // Menú de 2 niveles: Module > children (SubModules)
          itemLogin.menu.forEach(module => {
            module.children.forEach(child => {
              const parsedActions = JSON.parse(atob(child.actions));
              child.permission = parsedActions.permision;
              delete child.actions;
              permission.push(child);
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
