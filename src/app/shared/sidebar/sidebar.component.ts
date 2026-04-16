import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { IDatosUsuario } from 'src/app/authentication/interface/authentication';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IMenuSidebar } from '../interface/menu.interface';
import { UserStateService } from '../services/user-state.service';
import { SettingsPanelComponent } from '../settings-panel/settings-panel.component';
import jwt_decode from 'jwt-decode';
import { ProfileComponent } from './profile/profile.component';
import { ThemeService } from '../services/theme.service';
import { LanguageService, Lang } from '../services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  public datosUsuario: IDatosUsuario;
  public menuSidebar: Array<IMenuSidebar> = []
  private bsModalRef!: BsModalRef;
  private userSub: Subscription;

  @ViewChild('settingsPanel') settingsPanel: SettingsPanelComponent;
  public isMenuOpen = true;
  public isDropdownOpen = false;
  public menuOrientation: string = 'vertical';
  public currentLang: Lang = 'es';
  public langDropdownOpen = false;
  private themeSub: Subscription;
  private langSub: Subscription;


  notifications = [];

  constructor(
    private modalService: BsModalService,
    private userStateService: UserStateService,
    private themeService: ThemeService,
    private languageService: LanguageService,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.userSub = this.userStateService.usuario$.subscribe(datos => {
      this.datosUsuario = datos;
    });
    this.themeSub = this.themeService.config$.subscribe(config => {
      this.menuOrientation = config.menuOrientation;
    });
    this.langSub = this.languageService.lang$.subscribe(lang => {
      this.currentLang = lang;
      this.loadNotifications();
    });
    this.menuSidebar = JSON.parse(localStorage.getItem('menu'))
    this.menuSidebar = this.menuSidebar.map(menu => ({
      ...menu,
      isOpen: false
    }));
  }

  ngOnDestroy(): void {
    if (this.userSub) this.userSub.unsubscribe();
    if (this.themeSub) this.themeSub.unsubscribe();
    if (this.langSub) this.langSub.unsubscribe();
  }

  /**
   * metodo de toogle del menu
   */
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    console.info('Menu estado: ', this.isMenuOpen);
  }

  /**
   * metodo para el toogle de los modulos
   * @param idModule
   */
  toggleDropdown(idModule: number) {
    this.menuSidebar = this.menuSidebar.map(menu => ({
      ...menu,
      isOpen: menu.idModule === idModule ? !menu.isOpen : false // Cierra los demás menús
    }));
  }

  /**
   * metodo para cargar la barra en el mobil
   * @returns
   */
  isMobile(): boolean {
    return window.innerWidth < 768;
  }

  /**
   * metodo para cambiar el pass del usuario
   * @param id
   */
  openProfile() {
    const user = this.datosUsuario;
    const role = JSON.parse(localStorage.getItem('role'));
    this.bsModalRef = this.modalService.show(ProfileComponent, {
      backdrop: 'static',
      class: 'modal-lg p-5',
    });
    this.bsModalRef.content.title = 'Mi Perfil';
    const decodedToken: any = jwt_decode(localStorage.getItem('token'));
    this.bsModalRef.content.user = {
      ...user,
      idRole: decodedToken?.userLogin?.idRole,
      idCompany: decodedToken?.userLogin?.idCompany,
      address: decodedToken?.userLogin?.address,
      roleName: role?.name,
    };
  }

  openSettings() {
    this.settingsPanel.toggle();
  }

  loadNotifications() {
    this.notifications = [
      { icon: 'fas fa-info-circle', message: this.translateService.instant('NOTIFICATIONS.NEW_MESSAGE') },
      { icon: 'fas fa-check-circle', message: this.translateService.instant('NOTIFICATIONS.TASK_COMPLETED') },
      { icon: 'fas fa-exclamation-triangle', message: this.translateService.instant('NOTIFICATIONS.ACCOUNT_PROBLEM') },
      { icon: 'fas fa-users', message: this.translateService.instant('NOTIFICATIONS.NEW_USER_REGISTERED') }
    ];
  }

  toggleLangDropdown(event: Event) {
    event.stopPropagation();
    this.langDropdownOpen = !this.langDropdownOpen;
  }

  switchLang(lang: Lang) {
    this.languageService.switchLang(lang);
    this.langDropdownOpen = false;
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.langDropdownOpen = false;
  }

  changePassword(id: number) {
    this.bsModalRef = this.modalService.show(ChangePasswordComponent, {
      backdrop: 'static',
      class: 'modal-lg p-5',
    });
    this.bsModalRef.content.idColaborador = id;
    this.bsModalRef.content.title = 'Cambiar Contraseña';
    this.bsModalRef.onHidden?.subscribe((_) => {
    });
  }

}
