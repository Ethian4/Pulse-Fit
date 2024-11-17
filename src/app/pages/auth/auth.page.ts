import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {}

  async submit() {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      // Solo pasa los campos email y password para la autenticación
      const credentials = {
        email: this.form.value.email,
        password: this.form.value.password
      };

      this.firebaseSvc.signIn(credentials).then((res) => {
        // Accede al UID del usuario autenticado
        this.getUserInfo(res.user.uid); // Pasamos el UID para obtener los datos completos
      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message, 
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });

      }).finally(() => {
        loading.dismiss();
      });
    }
  }

  async getUserInfo(uid: string) {
    if (this.form.valid) {
  
      const loading = await this.utilsSvc.loading();
      await loading.present();
  
      const path = `users/${uid}`; // Ruta de Firestore usando el UID
  
      this.firebaseSvc.getDocument(path).then((user: User) => {
        // Aquí, 'user' es el modelo completo de usuario desde Firestore
        this.utilsSvc.saveInLocalStorage('user', user); // Guarda el usuario en el almacenamiento local
        this.utilsSvc.routerLink('/main/home'); // Redirige al inicio
        this.form.reset();
  
        this.utilsSvc.presentToast({
          message: `Bienvenido ${user.name}`,
          duration: 1500,
          color: 'primary',
          position: 'middle',
          icon: 'person-circle-outline'
        });
  
      }).catch(error => {
        console.log(error);
  
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
  
      }).finally(() => {
        loading.dismiss();
      });
    }
  }
  
}
