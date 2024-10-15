import { Component, inject, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Rutinas } from 'src/app/models/rutinas.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-rutinas',
  templateUrl: './add-update-rutinas.component.html',
  styleUrls: ['./add-update-rutinas.component.scss'],
})
export class AddUpdateRutinasComponent  implements OnInit {

  @Input() Rutina: Rutinas

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    nota: new FormControl(''),
    rutinaInfo: new FormControl(''),

  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;

  ngOnInit() {

    this.user = this.utilsSvc.getFromLocalStorage('user');
    if (this.Rutina) this.form.setValue(this.Rutina)
    
  }

  submit(){
    if (this.form.valid) {

      if(this.Rutina) this.updateRutina();
      else this.createRutina();

    }
  }


  // CREAR RUTINA
  async createRutina() {

      let path = `users/${this.user.uid}/Rutinas`

      const loading = await this.utilsSvc.loading();
      await loading.present();


      delete this.form.value.id

      this.firebaseSvc.addDocument(path, this.form.value).then(async res =>{

        this.utilsSvc.dismissModal({success: true});

        this.utilsSvc.presentToast({
          message: 'Rutina Creada Exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'

        })

      }).catch(error =>{
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'

        })
      }).finally(() =>{
        loading.dismiss();
      })

  }

  // ACTUALIZAR RUTINA
  async updateRutina() {

      let path = `users/${this.user.uid}/Rutinas/${this.Rutina.id}`

      const loading = await this.utilsSvc.loading();
      await loading.present();


      delete this.form.value.id

      this.firebaseSvc.updateDocument(path, this.form.value).then(async res =>{

        this.utilsSvc.dismissModal({success: true});

        this.utilsSvc.presentToast({
          message: 'Rutina Actualizada Exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'

        })

      }).catch(error =>{
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'

        })
      }).finally(() =>{
        loading.dismiss();
      })

  }


  
}
