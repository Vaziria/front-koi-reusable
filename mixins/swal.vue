<script lang="ts">

import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class CustomSwal extends Vue {
  get topedPosition (): 'bottom' | 'top' {
    return window.innerWidth < 768 ? 'bottom' : 'top'
  }

  dismiss (): void {
    setTimeout(() => { Swal.close() }, 100)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  swal (config: SweetAlertOptions<any, any>): Promise<SweetAlertResult<any>> {
    return Swal.fire(config)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toastSwal (config: SweetAlertOptions<any, any>): Promise<SweetAlertResult<any>> {
    return this.swal({ ...config, toast: true })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public topedToast (title: string, confirmText = ''): Promise<SweetAlertResult<any>> {
    const config = {
      position: this.topedPosition,
      timer: 5000,
      timerProgressBar: true,
      title: title,
      showConfirmButton: !!confirmText.length,
      confirmButtonText: confirmText,
      showClass: {
        popup: '',
        icon: ''
      }
    }

    return this.toastSwal(config)
  }
}

// export default {
//   methods: {
//     // swal
//     // dismiss() {
//     //   setTimeout(() => { delete Swal.close() }, 100)
//     // },
//     swal(config) {
//       return Swal.fire(config)
//     },
//     toastSwal(config) {
//       return this.swal(_.merge(config, { toast: true }))
//     },

//     // new
//     topedToast(title, confirmText='') {
//       const config = {
//         position: this.topedPosition,
//         timer: 5000,
//         timerProgressBar: true,
//         title: title,
//         showConfirmButton: confirmText.length,
//         confirmButtonText: confirmText,
//         showClass: {
//           popup: '',
//           icon: ''
//         }
//       }

//       return this.toastSwal(config)
//     },

//     // old
//     containToastSwal(id, config) {
//       return this.toastSwal(_.merge(config, {
//         position: 'top-end',
//         target: document.getElementById(id),
//         willOpen: () => { Swal.getContainer().style.position = 'absolute' }
//       }))
//     },
//     swalChoose(toast, contain, config, id) {
//       return (toast && contain && this.containToastSwal(id, config)) ||
//         (toast && this.toastSwal(config)) ||
//         this.swal(config)
//     },
//     // action
//     errorAlertSwal(title, text) {
//       this.swal({
//         icon: 'error',
//         title: title,
//         text: text,
//         showConfirmButton: false
//       })
//     },
//     deleteSwal(func, title, text, id=null, toast=false, contain=false) {
//       const config = {
//         title: title,
//         text: text,
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonText: 'Hapus',
//         cancelButtonText: 'Batal'
//       }
//       this.swalChoose(toast, contain, config, id).then(func)
//     },
//     pushSwal(func, title, text, id=null, toast=false, contain=false) {
//       const config = {
//         title: title,
//         text: text,
//         icon: 'info',
//         showCancelButton: true,
//         confirmButtonText: 'Push',
//         cancelButtonText: 'Batal'
//       }
//       this.swalChoose(toast, contain, config, id).then(func)
//     }
//   }
// }

</script>
