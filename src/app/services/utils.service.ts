import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingcCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  router = inject(Router);

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
