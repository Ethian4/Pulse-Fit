import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingcCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl = inject(ModalController);
  router = inject(Router);


  //CAMARA
  async takePicture(promptLabelHeader: string){
    return await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Prompt,
    promptLabelHeader,
    promptLabelPhoto: 'Selecciona una Imagen',
    promptLabelPicture: 'Toma una foto'
    })
  };



  //LOADING
  loading() {
    return this.loadingcCtrl.create({ spinner: 'crescent' })
  }


  //TOAST

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  //ROUTER
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  //Guardar en el localstorage
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  //Obtener cosas del localstorage
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }


    //MODAL
    async presentModal(opts: ModalOptions) {
      const modal = await this.modalCtrl.create(opts);
      await modal.present();

      const { data } = await modal.onWillDismiss();
      if (data) return data;
    
    }

    dismissModal(data?: any){
      return this.modalCtrl.dismiss(data);
    }
}
