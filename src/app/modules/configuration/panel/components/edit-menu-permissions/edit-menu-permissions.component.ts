import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from '../../../../../shared/services/error.service';
import { IMenuModuleFormArray, IMenuPermissions, IRole } from '../../interface/panel.interface';
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
  public applicationTabs = [];
  // public modulosUnicos = [];
  public idRole: number;
  public role: IRole
  public guardarSolicitudBoleano: boolean = false;

  public menuPermisosBackend: Array<IMenuModuleFormArray> = []


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

    await firstValueFrom(this.panelService.getAllApplicationTabs()).then(ApplicationTabsBack => {
      console.log(ApplicationTabsBack, 'datos del backend');

      //   this.modulosUnicos = this.obtenerModulosUnicos(subModulosBack);
      //  this.applicationTabs = ApplicationTabsBack
      ApplicationTabsBack.forEach(item => {
        item.mostrarAdicionales = false,
          item.actions = [
            {
              name: 'Crear',
              action: "INSERT",
              codeAction: "I",
              status: false
            },
            {
              name: 'Editar',
              action: "UPDATE",
              codeAction: "U",
              status: false
            },
            {
              name: 'Estado',
              action: "STATUS",
              codeAction: "S",
              status: false
            },
            {
              name: 'Borrar',
              action: "DELETE",
              codeAction: "D",
              status: false
            }
          ]
      })


      const groupedByModule = ApplicationTabsBack.reduce((modules, item) => {
        if (!modules[item.idModule]) {
          modules[item.idModule] = {
            idModule: item.idModule,
            nameModule: item.nameModule,
            iconModule: item.iconModule,
            subModules: []
          };
        }

        let subModule = modules[item.idModule].subModules.find(
          sub => sub.idSubModule === item.idSubModule
        );

        if (!subModule) {
          subModule = {
            idSubModule: item.idSubModule,
            nameSubModule: item.nameSubModule,
            iconSubModule: item.iconSubModule,
            applicationTabs: []
          };
          modules[item.idModule].subModules.push(subModule);
        }

        subModule.applicationTabs.push({
          id: item.id,
          name: item.name,
          icon: item.icon,
          state: item.state,
          mostrarAdicionales: item.mostrarAdicionales,
          actions: item.actions
        });

        return modules;
      }, {});

      // const result = Object.values(groupedByModule);
      this.menuPermisosBackend = Object.values(groupedByModule);
      console.log(this.menuPermisosBackend, 'data arreglada');




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
      setTimeout(() => {
        this.buildForms()
        this.cargarFormularioMenuPermiso = true
      }, 1000);
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })

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

  // obtenerModulosUnicos(subModulos) {
  //   const modulosMap = new Map();
  //   subModulos.forEach(subModulo => {
  //     if (!modulosMap.has(subModulo.idModule)) {
  //       modulosMap.set(subModulo.idModule, subModulo.idModule);
  //     }
  //   });
  //   return Array.from(modulosMap.values());
  // }

  /**
   *  metodo para la creacion del formulario
   */
  buildForms() {
    this.formMenuPermisos = new FormGroup({
      id: new FormControl(this.menuPermiso ? this.menuPermiso.id : null),
      idRole: new FormControl(this.menuPermiso ? this.menuPermiso.idRole : this.role.id, [Validators.required]),
      options: this.fb.array([])
    })
    this.agregarCheckboxesPrincipales();
  }

  private agregarCheckboxesPrincipales() {
    const checkboxesPrincipalesArray = this.formMenuPermisos.get('options') as FormArray;

    this.menuPermisosBackend.forEach(itemModule => {
      console.log(itemModule, 'check principal');

      // Nivel principal: módulo
      const checkboxPrincipalGroup = this.fb.group({
        idModule: itemModule.idModule,
        iconModule: itemModule.iconModule,
        nameModule: itemModule.nameModule,
        subModules: this.fb.array([])
      });

      // Nivel secundario: submódulo
      itemModule.subModules.forEach(itemSubmodule => {
        const subModuleGroup = this.fb.group({
          idSubModule: itemSubmodule.idSubModule,
          iconSubModule: itemSubmodule.iconSubModule,
          nameSubModule: itemSubmodule.nameSubModule,
          applicationTabs: this.fb.array([])
        });
        console.log(itemSubmodule, 'sub');

        // Nivel terciario: pestañas de aplicación
        itemSubmodule.applicationTabs.forEach(itemApplicationTab => {
          const applicationTabGroup = this.fb.group({
            idApplicationTab: itemApplicationTab.id,
            nameApplicationTab: itemApplicationTab.name,
            icon: itemApplicationTab.icon,
            state: itemApplicationTab.state,
            mostrarAdicionales: itemApplicationTab.mostrarAdicionales,
            actions: this.fb.array([])
          });

          // Nivel adicional: permisos
          itemApplicationTab.actions.forEach(permission => {
            (applicationTabGroup.get('actions') as FormArray).push(
              this.fb.group({
                name: permission.name,
                action: permission.action,
                codeAction: permission.codeAction,
                status: permission.status
              })
            );
          });

          (subModuleGroup.get('applicationTabs') as FormArray).push(applicationTabGroup);
        });

        (checkboxPrincipalGroup.get('subModules') as FormArray).push(subModuleGroup);
      });

      checkboxesPrincipalesArray.push(checkboxPrincipalGroup);
    });

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
