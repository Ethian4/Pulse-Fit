import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingcCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
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

}
