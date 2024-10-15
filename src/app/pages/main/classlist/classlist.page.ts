import { Component, inject, OnInit } from '@angular/core';
import { Rutinas } from 'src/app/models/rutinas.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateRutinasComponent } from 'src/app/shared/components/add-update-rutinas/add-update-rutinas.component';


@Component({
  selector: 'app-classlist',
  templateUrl: './classlist.page.html',
  styleUrls: ['./classlist.page.scss'],
})
export class ClasslistPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);


  Rutinas: Rutinas[] = [];
  ngOnInit() {
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getRutinas();
  }

  //OBTENER LAS RUTINAS 
  getRutinas() {
    let path = `users/${this.user().uid}/Rutinas`

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.Rutinas = res;
        sub.unsubscribe();
      } 
    })
  }

  // ELIMINAR RUTINA
  async deleteRutina(Rutina: Rutinas) {

    let path = `users/${this.user().uid}/Rutinas/${Rutina.id}`

    const loading = await this.utilsSvc.loading();
    await loading.present();


    this.firebaseSvc.deleteDocument(path).then(async res => {

      this.Rutinas = this.Rutinas.filter(r => r.id !== Rutina.id);
 
      this.utilsSvc.presentToast({
        message: 'Rutina Eliminada Exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'

      })

    }).catch(error => {
      console.log(error);

      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'

      })

    }).finally(() => {
      loading.dismiss();
    })

  }




  //Agregar Rutina
  async addUpdateRutinas(Rutina?: Rutinas) {

    let success = await this.utilsSvc.presentModal({
      component: AddUpdateRutinasComponent,
      cssClass: 'add-update-modal',
      componentProps: { Rutina }
    })

    if (success) this.getRutinas();
  }





}
