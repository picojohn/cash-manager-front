import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IDatosUsuario } from 'src/app/authentication/interface/authentication';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IMenuSidebar } from '../interface/menu.interface';
import { UserStateService } from '../services/user-state.service';
import { SettingsPanelComponent } from '../settings-panel/settings-panel.component';
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


  notifications = [
    { icon: 'fas fa-info-circle', message: 'Tienes un nuevo mensaje.' },
    { icon: 'fas fa-check-circle', message: 'Tu tarea ha sido completada.' },
    { icon: 'fas fa-exclamation-triangle', message: 'Hay un problema con tu cuenta.' },
    { icon: 'fas fa-users', message: 'Nuevo usuario se ha registrado.' }
  ];

  constructor(
    private modalService: BsModalService,
    private userStateService: UserStateService,
  ) { }

  ngOnInit(): void {
    this.userSub = this.userStateService.usuario$.subscribe(datos => {
      this.datosUsuario = datos;
    });
    this.menuSidebar = JSON.parse(localStorage.getItem('menu'))
    this.menuSidebar = this.menuSidebar.map(menu => ({
      ...menu,
      isOpen: false
    }));
  }

  ngOnDestroy(): void {
    if (this.userSub) this.userSub.unsubscribe();
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
  openSettings() {
    this.settingsPanel.toggle();
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
