import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error.service';
import { PanelService } from '../../../panel/services/panel.service';

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

  constructor(
    public bsModalRef: BsModalRef,
    public toast: ToastrService,
    private errorService: ErrorService,
    private panelService: PanelService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
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
      return this.toast.info('Todos los campos son obligatorios');
    }
    firstValueFrom(
      this.user
        ? this.panelService.editUser(this.formUser.value)
        : this.panelService.newUser(this.formUser.value)
    ).then(_ => {
      this.bsModalRef.hide();
      this.toast.success(`Usuario ${this.user ? 'modificado' : 'creado'} correctamente`);
    }, err => {
      const errorObject = this.errorService.showNotification(err);
      this.toast[errorObject.typeToast](errorObject.message, errorObject.typeMessage, { timeOut: errorObject.timeOut });
    });
  }
}
