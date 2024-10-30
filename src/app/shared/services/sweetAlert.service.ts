import Swal from 'sweetalert2'
declare var require: any;
import { Injectable } from '@angular/core';

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

  constructor() { }

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
      title: '¿Estas Seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '<i class="fa-regular fa-trash-can"  style="color: red" ></i> <strong>¡Sí, bórralo!</strong>',
      cancelButtonText: '<i class="fa-solid fa-ban" style="color: red"></i> <strong>Cancelar</strong>'

    }).then((validation: any) => {
      return validation.value ? true : false;
    })
  }
  public async alertStatesMessage(): Promise<boolean> {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    })

    return await swalWithBootstrapButtons.fire({
      title: '¿Estás seguro?',
      text: "¡Vas a cambiar el estado!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Cambiar',
      cancelButtonText: 'Cancelar'
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
      title: '¿Estas Seguro?',
      text: "¡Vas a cambiar el estado de la factura",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Cambiar',
      cancelButtonText: 'Volver'
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
      title: '¿Estas Seguro que deseas cambiar la foto?',
      text: "¡No podrás revertir esto!",
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((validation: any) => {
      return validation.value ? true : false;
    })
  }

  // /**
  //  *
  //  * @returns Promise<any>
  //  */
  // messageLoading(): any {
  //   return Swal.fire({
  //     title: 'Cambio de imagen',
  //     html: 'Cambiando imagen...',
  //     onBeforeOpen: () => {
  //       Swal.showLoading()
  //     },
  //     onClose: () => { }
  //   })
  // }
}
