import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from '../../../../../shared/services/error.service';
import { IMenuModuleFormArray, IMenuPermissions, IRole } from '../../interface/panel.interface';
import { PanelService } from '../../services/panel.service';
import { ETitleMessages } from 'src/app/shared/enums/error.service.eum';

@Component({
  selector: 'app-edit-menu-permissions',
  templateUrl: './edit-menu-permissions.component.html',
  styleUrls: ['./edit-menu-permissions.component.css'],
})
export class EditMenuPermissionsComponent implements OnInit {
  public title: string;
  public formMenuPermisos: FormGroup;
  public cargarFormularioMenuPermiso: boolean = false;
  public menuPermission: IMenuPermissions;
  public roles: Array<any> = [];
  public modulos: Array<any> = [];
  public applicationTabs = [];
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

      if (this.menuPermission) {
        let options = this.menuPermission['options']
        const updatedArray = ApplicationTabsBack.map(item => {
          const match = options.find(newItem =>
            newItem.idModule === item.idModule &&
            newItem.idSubModule === item.idSubModule &&
            newItem.idApplicationTab === item.id
          );
          if (match) {
            return { ...item, actions: JSON.parse(atob(match.actions)).permision, mostrarAdicionales: true };
          }

          return item;
        });
        this.loadDataFormArray(updatedArray)
      } else {
        this.loadDataFormArray(ApplicationTabsBack)
      }

      setTimeout(() => {
        this.buildForms()
        this.cargarFormularioMenuPermiso = true
      }, 100);
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })
  }

  loadDataFormArray(ApplicationTabsBack) {
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
        actions: item.actions,

      });
      return modules;
    }, {});
    this.menuPermisosBackend = Object.values(groupedByModule);
  }


  /**
   *  metodo para la creacion del formulario
   */
  buildForms() {
    this.formMenuPermisos = new FormGroup({
      id: new FormControl(this.menuPermission ? this.menuPermission.id : null),
      idRole: new FormControl(this.menuPermission ? this.menuPermission.idRole : this.role.id, [Validators.required]),
      options: this.fb.array([])
    })
    this.agregarCheckboxesPrincipales();
  }

  private agregarCheckboxesPrincipales() {
    const checkboxesPrincipalesArray = this.formMenuPermisos.get('options') as FormArray;
    this.menuPermisosBackend.forEach(itemModule => {
      const checkboxPrincipalGroup = this.fb.group({
        idModule: itemModule.idModule,
        iconModule: itemModule.iconModule,
        nameModule: itemModule.nameModule,
        subModules: this.fb.array([])
      });
      itemModule.subModules.forEach(itemSubmodule => {
        const subModuleGroup = this.fb.group({
          idSubModule: itemSubmodule.idSubModule,
          iconSubModule: itemSubmodule.iconSubModule,
          nameSubModule: itemSubmodule.nameSubModule,
          applicationTabs: this.fb.array([])
        });
        itemSubmodule.applicationTabs.forEach(itemApplicationTab => {
          const applicationTabGroup = this.fb.group({
            idApplicationTab: itemApplicationTab.id,
            nameApplicationTab: itemApplicationTab.name,
            icon: itemApplicationTab.icon,
            state: itemApplicationTab.state,
            mostrarAdicionales: itemApplicationTab.mostrarAdicionales,
            actions: this.fb.array([])
          });
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


  /**
   * metodo para guardar los datos en el backend
   * @returns
   */
  guardarDatos() {
    let data = this.formMenuPermisos.value
    let countMostrarAdicionales = 0
    data.options.forEach(module => {
      module.subModules.forEach(submodule => {
        submodule.applicationTabs.forEach(applicationTabs => {
          if (applicationTabs.mostrarAdicionales == true) {
            countMostrarAdicionales = countMostrarAdicionales + 1
          }
        });
      });
    });
    if (countMostrarAdicionales < 1) {
      return this.toast.info('Debes seleccionar al menos un permiso', ETitleMessages.ROLES)

    }

     this.guardarSolicitudBoleano = true
    firstValueFrom(this.menuPermission ? this.panelService.editMenuPermissions(data) : this.panelService.newMenuPermissions(data)).then(item => {
      this.bsModalRef.hide()
      this.toast.success(`Menu Permiso ${this.menuPermission ? 'modificado' : 'creado'} correctamente`, ETitleMessages.ROLES)
    }, err => {
      this.guardarSolicitudBoleano = false
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    })

  }


}
