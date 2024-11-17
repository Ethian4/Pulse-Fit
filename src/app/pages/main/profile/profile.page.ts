import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  isLoggingOut = false;  // Nuevo estado para controlar la animación de cierre de sesión

  ngOnInit() {}

  async signOut() {
    this.isLoggingOut = true; // Inicia la animación

    // Espera a que la animación termine antes de cerrar sesión
    setTimeout(() => {
      this.firebaseSvc.signOut();
    }, 500);  // Tiempo igual al de la animación

  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  async takeImage() {
    let user = this.user();
    let path = `users/${user.uid}`;

    const dataUrl = (await this.utilsSvc.takePicture('Imagen de Perfil')).dataUrl;

    let imagePath = `${user.uid}/profile`;
    user.image = await this.firebaseSvc.uploadImage(imagePath, dataUrl);

    this.firebaseSvc.updateDocument(path, { image: user.image }).then(async () => {

      this.utilsSvc.saveInLocalStorage('user', user);

      this.utilsSvc.presentToast({
        message: 'Imagen Actualizada',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
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
    });
  }

}
