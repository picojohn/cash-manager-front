import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/shared/services/error.service';
import { UserStateService } from 'src/app/shared/services/user-state.service';
import { UsersService } from 'src/app/modules/configuration/users/services/users.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public title: string;
  public user: any;
  public formProfile: FormGroup;
  public cargarFormulario: boolean = false;
  public editMode: boolean = false;

  constructor(
    public bsModalRef: BsModalRef,
    public toast: ToastrService,
    private errorService: ErrorService,
    private usersService: UsersService,
    private userStateService: UserStateService,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.buildForm();
      this.cargarFormulario = true;
    }, 100);
  }

  buildForm() {
    this.formProfile = new FormGroup({
      id: new FormControl(this.user?.id),
      name: new FormControl({ value: this.user?.name, disabled: true }, [Validators.required]),
      email: new FormControl({ value: this.user?.email, disabled: true }),
      phone: new FormControl({ value: this.user?.phone, disabled: true }),
      address: new FormControl({ value: this.user?.address, disabled: true }),
      idRole: new FormControl(this.user?.idRole),
      idCompany: new FormControl(this.user?.idCompany),
    });
  }

  getInitials(): string {
    if (!this.user?.name) return '?';
    return this.user.name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);
  }

  toggleEdit() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.formProfile.get('name').enable();
      this.formProfile.get('phone').enable();
      this.formProfile.get('address').enable();
    } else {
      this.formProfile.get('name').disable();
      this.formProfile.get('phone').disable();
      this.formProfile.get('address').disable();
    }
  }

  save() {
    if (this.formProfile.invalid) {
      this.formProfile.markAllAsTouched();
      return this.toast.info('El nombre es obligatorio');
    }
    const data = this.formProfile.getRawValue();
    data.phone = data.phone ? String(data.phone) : '';
    firstValueFrom(this.usersService.editUser(data)).then(_ => {
      this.userStateService.updateUsuario({
        name: data.name,
        phone: data.phone,
      });
      this.user = { ...this.user, ...data };
      this.editMode = false;
      this.formProfile.get('name').disable();
      this.formProfile.get('phone').disable();
      this.formProfile.get('address').disable();
      this.toast.success('Perfil actualizado correctamente');
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });
  }
}
