import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { UsersService } from '../../services/users.service';
import { UserStateService } from 'src/app/shared/services/user-state.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit {
  public title: string;
  public user: any;
  public roles: Array<any> = [];
  public companies: Array<any> = [];
  public formUser: FormGroup;
  public cargarFormulario: boolean = false;

  constructor(
    public bsModalRef: BsModalRef,
    public toast: ToastrService,
    private errorService: ErrorService,
    private usersService: UsersService,
    private userStateService: UserStateService,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.buildForm();
      this.cargarFormulario = true;
    }, 100);
  }

  buildForm() {
    this.formUser = new FormGroup({
      id: new FormControl(this.user ? this.user.id : null),
      name: new FormControl(this.user ? this.user.name : null, [Validators.required]),
      email: new FormControl(this.user ? this.user.email : null, [Validators.required, Validators.email]),
      phone: new FormControl(this.user ? this.user.phone : null),
      address: new FormControl(this.user ? this.user.address : null),
      idRole: new FormControl(this.user ? this.user.idRole : null, [Validators.required]),
      idCompany: new FormControl(this.user ? this.user.idCompany : null, [Validators.required]),
      status: new FormControl(this.user ? this.user.status : 1),
    });
  }

  save() {
    if (this.formUser.invalid) {
      this.formUser.markAllAsTouched();
      return this.toast.info(this.translateService.instant('GENERAL.REQUIRED_FIELDS'));
    }
    firstValueFrom(
      this.user
        ? this.usersService.editUser(this.formUser.value)
        : this.usersService.newUser(this.formUser.value)
    ).then(_ => {
      // Si editó el usuario actual, actualizar el header
      const currentUser = this.userStateService.usuarioActual;
      const formData = this.formUser.value;
      if (currentUser && currentUser.id === formData.id) {
        this.userStateService.updateUsuario({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          idCompany: formData.idCompany,
        });
      }
      this.bsModalRef.hide();
      this.toast.success(this.translateService.instant(this.user ? 'USERS.USER_UPDATED' : 'USERS.USER_CREATED'));
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });
  }
}
