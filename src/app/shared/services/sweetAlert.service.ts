import Swal from 'sweetalert2'
declare var require: any;
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

interface paramMessage {
  title: string;
  text: string;
  type: string;
  showCancelButton: boolean;
  confirmButtonColor: string;
  cancelButtonColor: string;
  confirmButtonText: string;
}

interface validationResponse {
  dismiss: string;
  isDismissed: boolean;
  isConfirmed: boolean;
  value: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor(private translateService: TranslateService) { }

  /**
   *
   * @param {paramMessage} paramMessage
   * @returns Promise<boolean>
   */
  public async alertDeleteMessage(): Promise<boolean> {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-outline-primary',
        cancelButton: 'btn btn-outline-secondary'
      },
      buttonsStyling: false,
    })

    return await swalWithBootstrapButtons.fire({
      title: this.translateService.instant('SWEET_ALERT.ARE_YOU_SURE'),
      text: this.translateService.instant('SWEET_ALERT.CANNOT_REVERT'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `<i class="fa-regular fa-trash-can"  style="color: red" ></i> <strong>${this.translateService.instant('SWEET_ALERT.YES_DELETE')}</strong>`,
      cancelButtonText: `<i class="fa-solid fa-ban" style="color: red"></i> <strong>${this.translateService.instant('GENERAL.CANCEL')}</strong>`

    }).then((validation: any) => {
      return validation.value ? true : false;
    })
  }
  public async alertStatesMessage(): Promise<boolean> {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-outline-primary',
        cancelButton: 'btn btn-outline-secondary'
      },
      buttonsStyling: false,
    })

    return await swalWithBootstrapButtons.fire({
      title: this.translateService.instant('SWEET_ALERT.CHANGE_STATUS_TITLE'),
      text: this.translateService.instant('SWEET_ALERT.CHANGE_STATUS_TEXT'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translateService.instant('GENERAL.CHANGE'),
      cancelButtonText: this.translateService.instant('GENERAL.CANCEL')
    }).then((validation: any) => {
      return validation.value ? true : false;
    })
  }

  public async alertFacturationMessage(): Promise<boolean> {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    })

    return await swalWithBootstrapButtons.fire({
      title: this.translateService.instant('SWEET_ALERT.ARE_YOU_SURE'),
      text: this.translateService.instant('SWEET_ALERT.CHANGE_INVOICE_STATUS'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translateService.instant('GENERAL.CHANGE'),
      cancelButtonText: this.translateService.instant('GENERAL.BACK')
    }).then((validation: any) => {
      return validation.value ? true : false;
    })
  }


  /**
   *
   * @param {paramMessage} paramMessage
   * @returns Promise<boolean>
   */
  public async messagePhoto(): Promise<boolean> {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    })

    return await swalWithBootstrapButtons.fire({
      title: this.translateService.instant('SWEET_ALERT.CHANGE_PHOTO'),
      text: this.translateService.instant('SWEET_ALERT.CANNOT_REVERT'),
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: this.translateService.instant('GENERAL.YES'),
      cancelButtonText: this.translateService.instant('GENERAL.CANCEL')
    }).then((validation: any) => {
      return validation.value ? true : false;
    })
  }
}
