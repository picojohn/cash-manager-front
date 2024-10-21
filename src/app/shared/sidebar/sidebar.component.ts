import { Component, OnInit } from '@angular/core';
import { IDatosUsuario } from 'src/app/authentication/interface/authentication';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public datosUsuario: IDatosUsuario
  ngOnInit(): void {
    this.datosUsuario = JSON.parse(localStorage.getItem('datosUsuario'))
  }

   isMenuOpen = true;
   isDropdownOpen = false;

   toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    console.log('Menu estado: ', this.isMenuOpen); // Para depuración
}

toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}

notifications = [
  { icon: 'fas fa-info-circle', message: 'Tienes un nuevo mensaje.' },
  { icon: 'fas fa-check-circle', message: 'Tu tarea ha sido completada.' },
  { icon: 'fas fa-exclamation-triangle', message: 'Hay un problema con tu cuenta.' },
  { icon: 'fas fa-users', message: 'Nuevo usuario se ha registrado.' }
];

isMobile(): boolean {
  return window.innerWidth < 768;
}

}
