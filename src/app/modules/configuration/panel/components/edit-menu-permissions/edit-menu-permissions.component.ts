import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom, forkJoin } from 'rxjs';
import { ErrorService } from '../../../../../shared/services/error.service';
import { IMenuPermissions, IRole } from '../../interface/panel.interface';
import { PanelService } from '../../services/panel.service';
import { ETitleMessages } from 'src/app/shared/enums/error.service.eum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-menu-permissions',
  templateUrl: './edit-menu-permissions.component.html',
  styleUrls: ['./edit-menu-permissions.component.css'],
})
export class EditMenuPermissionsComponent implements OnInit {
  public title: string;
  public formMenuPermisos: FormGroup;
  public cargarFormularioMenuPermiso: boolean = false;
  public menuPermission: any;
  public role: IRole;
  public guardarSolicitudBoleano: boolean = false;
  public menuPermisosBackend: Array<any> = [];

  constructor(
    public bsModalRef: BsModalRef,
    public toast: ToastrService,
    private errorService: ErrorService,
    private panelService: PanelService,
    private fb: FormBuilder,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.cargaDatos();
  }

  async cargaDatos() {
    forkJoin({
      modules: this.panelService.getAllModules(),
      subModules: this.panelService.getAllSubModules(),
    }).subscribe(({ modules, subModules }) => {
      // Construir estructura Module > SubModules
      const grouped = modules.map(mod => ({
        idModule: mod.id,
        nameModule: mod.name,
        iconModule: mod.icon,
        subModules: subModules
          .filter(sm => sm.idModule === mod.id)
          .map(sm => {
            // Buscar si ya tiene permiso asignado
            let existingActions = null;
            let mostrar = false;
            if (this.menuPermission && this.menuPermission.options) {
              const match = this.menuPermission.options.find(
                o => o.idModule === mod.id && o.idSubModule === sm.id
              );
              if (match) {
                const actionNames = {
                  INSERT: this.translateService.instant('PANEL.PERMISSIONS.ACTION_CREATE'),
                  UPDATE: this.translateService.instant('PANEL.PERMISSIONS.ACTION_EDIT'),
                  STATUS: this.translateService.instant('PANEL.PERMISSIONS.ACTION_STATUS'),
                  DELETE: this.translateService.instant('PANEL.PERMISSIONS.ACTION_DELETE')
                };
                existingActions = JSON.parse(atob(match.actions)).permision.map(a => ({
                  ...a,
                  name: actionNames[a.action] || a.action
                }));
                mostrar = true;
              }
            }
            return {
              idSubModule: sm.id,
              nameSubModule: sm.name,
              iconSubModule: sm.icon,
              path: sm.path,
              mostrarAdicionales: mostrar,
              actions: existingActions || [
                { name: this.translateService.instant('PANEL.PERMISSIONS.ACTION_CREATE'), action: 'INSERT', codeAction: 'I', status: false },
                { name: this.translateService.instant('PANEL.PERMISSIONS.ACTION_EDIT'), action: 'UPDATE', codeAction: 'U', status: false },
                { name: this.translateService.instant('PANEL.PERMISSIONS.ACTION_STATUS'), action: 'STATUS', codeAction: 'S', status: false },
                { name: this.translateService.instant('PANEL.PERMISSIONS.ACTION_DELETE'), action: 'DELETE', codeAction: 'D', status: false },
              ]
            };
          })
      }));

      this.menuPermisosBackend = grouped;
      this.buildForms();
      this.cargarFormularioMenuPermiso = true;
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });
  }

  buildForms() {
    this.formMenuPermisos = new FormGroup({
      idRole: new FormControl(this.role.id, [Validators.required]),
      opciones: this.fb.array([])
    });

    const opcionesArray = this.formMenuPermisos.get('opciones') as FormArray;
    this.menuPermisosBackend.forEach(mod => {
      const moduleGroup = this.fb.group({
        idModule: mod.idModule,
        nameModule: mod.nameModule,
        iconModule: mod.iconModule,
        subModules: this.fb.array([])
      });

      mod.subModules.forEach(sm => {
        const subModuleGroup = this.fb.group({
          idSubModule: sm.idSubModule,
          nameSubModule: sm.nameSubModule,
          iconSubModule: sm.iconSubModule,
          path: sm.path,
          mostrarAdicionales: sm.mostrarAdicionales,
          actions: this.fb.array([])
        });

        sm.actions.forEach(action => {
          (subModuleGroup.get('actions') as FormArray).push(
            this.fb.group({
              name: action.name,
              action: action.action,
              codeAction: action.codeAction,
              status: action.status
            })
          );
        });

        (moduleGroup.get('subModules') as FormArray).push(subModuleGroup);
      });

      opcionesArray.push(moduleGroup);
    });
  }

  guardarDatos() {
    const data = this.formMenuPermisos.value;
    let countMostrar = 0;

    // Aplanar los submodules seleccionados para enviar al backend
    const opciones = [];
    data.opciones.forEach(mod => {
      mod.subModules.forEach(sm => {
        if (sm.mostrarAdicionales) {
          countMostrar++;
          opciones.push({
            idModule: mod.idModule,
            idSubModule: sm.idSubModule,
            path: sm.path,
            actions: sm.actions,
          });
        }
      });
    });

    if (countMostrar < 1) {
      return this.toast.info(this.translateService.instant('PANEL.PERMISSIONS.SELECT_PERMISSION'), ETitleMessages.ROLES);
    }

    const payload = {
      idRole: data.idRole,
      opciones,
    };

    this.guardarSolicitudBoleano = true;
    firstValueFrom(
      this.menuPermission
        ? this.panelService.editMenuPermissions(payload)
        : this.panelService.newMenuPermissions(payload)
    ).then(_ => {
      this.bsModalRef.hide();
      this.toast.success(this.translateService.instant(this.menuPermission ? 'PANEL.PERMISSIONS.PERMISSIONS_UPDATED' : 'PANEL.PERMISSIONS.PERMISSIONS_CREATED'), ETitleMessages.ROLES);
    }, err => {
      this.guardarSolicitudBoleano = false;
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });
  }
}
