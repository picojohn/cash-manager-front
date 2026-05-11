import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { AuthenticationService } from '../../service/authentication.service';
import { Router } from '@angular/router';
import { ErrorService } from '../../../shared/services/error.service';
import jwt_decode from 'jwt-decode';
import { ETitleMessages } from 'src/app/shared/enums/error.service.eum';
import { IDatosUsuario } from '../../interface/authentication';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService, Lang } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  loadingSession = false;
  textIniSesssion = '';
  currentLang: Lang = 'es';
  showPassword: boolean = false;
  langDropdownOpen = false;

  constructor(
    public toast: ToastrService,
    public authenticationService: AuthenticationService,
    private router: Router,
    private errorService: ErrorService,
    private themeService: ThemeService,
    private translateService: TranslateService,
    private languageService: LanguageService,
  ) { }

  async ngOnInit() {
    const savedLang = localStorage.getItem('lang');
    localStorage.clear();
    if (savedLang) localStorage.setItem('lang', savedLang);
    this.currentLang = this.languageService.currentLang;
    this.buildForm();
    // Esperar a que se carguen las traducciones
    this.translateService.get('AUTH.LOGIN.SUBMIT').subscribe(val => {
      this.textIniSesssion = val;
    });
  }

  toggleLangDropdown(event: Event) {
    event.stopPropagation();
    this.langDropdownOpen = !this.langDropdownOpen;
  }

  switchLang(lang: Lang) {
    this.languageService.switchLang(lang);
    this.currentLang = lang;
    this.langDropdownOpen = false;
    this.translateService.get('AUTH.LOGIN.SUBMIT').subscribe(val => {
      this.textIniSesssion = val;
    });
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.langDropdownOpen = false;
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
      this.toast.info(this.translateService.instant('GENERAL.REQUIRED_FIELDS'), ETitleMessages.LOGIN);
    }
    else {
      this.loadingSession = true;
      this.textIniSesssion = this.translateService.instant('AUTH.LOGIN.LOGGING_IN');
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
            companyName: decodedJSON['userLogin']['companyName'],
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
          // Cargar preferencias de tema del usuario
          this.themeService.initFromLogin(decodedJSON['userLogin']['themePreferences']);
          this.router.navigate(['gestiones'])
        } else {
          this.toast.error(this.translateService.instant('AUTH.LOGIN.WRONG_CREDENTIALS'), ETitleMessages.LOGIN);
        }

      }, err => {
        const errorObject = this.errorService.showNotification(err);
        this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
        this.loadingSession = false;
        this.textIniSesssion = this.translateService.instant('AUTH.LOGIN.SUBMIT');
      })
    }
  }

}
