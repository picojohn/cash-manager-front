import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from '../../../../../shared/services/error.service';
import { IMenuPermissions, IRole } from '../../interface/panel.interface';
import { PanelService } from '../../services/panel.service';

@Component({
  selector: 'app-edit-menu-permissions',
  templateUrl: './edit-menu-permissions.component.html',
  styleUrls: ['./edit-menu-permissions.component.css'],
})
export class EditMenuPermissionsComponent implements OnInit {
  public title: string;
  public formMenuPermisos: FormGroup;
  public cargarFormularioMenuPermiso: boolean = false;
  public menuPermiso: IMenuPermissions;
  public roles: Array<any> = [];
  public modulos: Array<any> = [];
  public submodulos = [];
  public modulosUnicos = [];
  public idRole: number;
  public role: IRole
  public guardarSolicitudBoleano: boolean = false;


  constructor(
    public bsModalRef: BsModalRef,
    public toast: ToastrService,
    private errorService: ErrorService,
    private panelService: PanelService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.cargaDatos();
  }

  /**
   * metodo para la carga de datos del backend
   */
  async cargaDatos() {

    // await firstValueFrom(this.menuPermisosService.subModulos()).then(subModulosBack => {
    //   this.modulosUnicos = this.obtenerModulosUnicos(subModulosBack);
    //   this.submodulos = subModulosBack
    //   subModulosBack.forEach(item => {
    //     item.mostrarAdicionales = false,
    //       item.actions = [
    //         {
    //           nombre: 'Crear',
    //           action: "INSERT",
    //           codeAction: "I",
    //           status: false
    //         },
    //         {
    //           nombre: 'Editar',
    //           action: "UPDATE",
    //           codeAction: "U",
    //           status: false
    //         },
    //         {
    //           nombre: 'Estado',
    //           action: "STATUS",
    //           codeAction: "S",
    //           status: false
    //         }
    //       ]
    //   })
    //   if (this.menuPermiso) {
    //     let item = this.menuPermiso['submodulos']
    //     for (let i = 0; i < item.length; i++) {
    //       const idSubModule = item[i].idSubModule;
    //       for (let j = 0; j < subModulosBack.length; j++) {
    //         const submodulos1 = subModulosBack[j];
    //         if (submodulos1.id == idSubModule) {
    //           submodulos1.mostrarAdicionales = true
    //           submodulos1.actions = JSON.parse(atob(item[i].actions)).permision

    //         }
    //       }
    //     }
    //   }
    //   setTimeout(() => {
    //     this.buildForms()
    //     this.cargarFormularioMenuPermiso = true
    //   }, 500);
    // }, err => {
    //   const errorObject = this.errorService.showNotification(err);
    //   this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    // })

    // await firstValueFrom(this.menuPermisosService.roles()).then(rolesBack => {
    //   this.roles = rolesBack
    //   // if (this.idRol != 1) this.roles = this.roles.filter(i => i.id != 1) // no muestre el superAdmin
    // }, err => {
    //   const errorObject = this.errorService.showNotification(err);
    //   this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    // })
    // await firstValueFrom(this.menuPermisosService.modulos()).then(modulosBack => {
    //   this.modulos = modulosBack
    //   // if (this.idRol != 1) this.roles = this.roles.filter(i => i.id != 1) // no muestre el superAdmin
    // }, err => {
    //   const errorObject = this.errorService.showNotification(err);
    //   this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    // })
  }

  obtenerModulosUnicos(subModulos) {
    const modulosMap = new Map();
    subModulos.forEach(subModulo => {
      if (!modulosMap.has(subModulo.idModule)) {
        modulosMap.set(subModulo.idModule, subModulo.idModule);
      }
    });
    return Array.from(modulosMap.values());
  }

  /**
   *  metodo para la creacion del formulario
   */
  buildForms() {
    this.formMenuPermisos = new FormGroup({
      // id: new FormControl(this.menuPermiso ? this.menuPermiso.id : null),
      // idRole: new FormControl(this.menuPermiso ? this.menuPermiso.idRole : this.role.id, [Validators.required]),
      opciones: this.fb.array([])
    })
    this.agregarCheckboxesPrincipales();
  }

  private agregarCheckboxesPrincipales() {
    // const checkboxesPrincipalesArray = this.formMenuPermisos.get('opciones') as FormArray;
    // this.submodulos.forEach(checkboxPrincipal => {
    //   const checkboxPrincipalGroup = this.fb.group({
    //     name: checkboxPrincipal.name,
    //     mostrarAdicionales: checkboxPrincipal.mostrarAdicionales,
    //     id: checkboxPrincipal.id,
    //     idModule: checkboxPrincipal.idModule,
    //     path: checkboxPrincipal.path,
    //     actions: this.fb.array([])
    //   });
    //   checkboxPrincipal.actions.forEach(checkboxAdicional => {
    //     (checkboxPrincipalGroup.get('actions') as FormArray).push(
    //       this.fb.group({
    //         action: [checkboxAdicional.action],
    //         nombre: [checkboxAdicional.nombre],
    //         status: [checkboxAdicional.status],
    //         codeAction: [checkboxAdicional.codeAction]
    //       })
    //     );
    //   });
    //   checkboxesPrincipalesArray.push(checkboxPrincipalGroup);
    // });

  }

  onSelectChange(selectedItems: any[], index: number) {
    // const opcionesArray = this.formMenuPermisos.get('opciones') as FormArray;
    // const accionesArray = opcionesArray.at(index).get('actions') as FormArray;

    // accionesArray.controls.forEach(control => {
    //   const codeAction = control.get('codeAction').value;
    //   const isSelected = selectedItems.some(item => item.codeAction === codeAction);
    //   control.get('status').setValue(isSelected);
    // });
  }

  getModulosNombres(id: number) {
    // let modulo = this.modulos.find(i => i.id == id)
    // return modulo ? modulo.name : ''
  }




  /**
   * metodo para guardar los datos en el backend
   * @returns
   */
  guardarDatos() {
    // if (this.formMenuPermisos.invalid) {
    //   this.toast.info('Debes seleccionar un rol', 'Roles')
    // } else {
    //   let data = this.formMenuPermisos.value
    //   // Object.assign(data, { idRole: this.menuPermiso?.idRole ? this.menuPermiso.idRole : this.idRole })
    //   data.opciones = data.opciones.filter(item => item.mostrarAdicionales != false);
    //   if (data.opciones.length < 1) {
    //     this.toast.info('Debes seleccionar una autorizacion', 'Roles')
    //   }
    //   this.guardarSolicitudBoleano = true
    //   firstValueFrom(this.menuPermiso ? this.menuPermisosService.editarMenuPermiso(data) : this.menuPermisosService.nuevoMenuPermiso(data)).then(item => {
    //     this.bsModalRef.hide()
    //     this.toast.success(`Menu Permiso ${this.menuPermiso ? 'modificado' : 'creado'} correctamente`, 'Menu Permisos')
    //   }, err => {
    //     this.guardarSolicitudBoleano = false
    //     const errorObject = this.errorService.showNotification(err);
    //     this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    //   })
    // }

  }


}
