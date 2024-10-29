import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-genero',
  templateUrl: './genero.page.html',
  styleUrls: ['./genero.page.scss'],
})
export class GeneroPage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  genderSelected: string | null = null;
  userData: User;

  ngOnInit() {
    // Obtener los datos del usuario desde el localStorage
    this.userData = this.utilsSvc.getFromLocalStorage('user');
  }

  selectGender(gender: string) {
    this.genderSelected = gender;
  }

  saveGender() {
    if (!this.genderSelected) {
      this.utilsSvc.presentToast({
        message: 'Por favor selecciona un género.',
        duration: 2000,
        color: 'warning',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
      return;
    }

    // Actualizamos el género del usuario y guardamos en localStorage
    this.userData.genero = this.genderSelected;
    this.utilsSvc.saveInLocalStorage('user', this.userData);

    // Actualizar en Firebase (opcional)
    this.firebaseSvc.updateDocument(`users/${this.userData.uid}`, { genero: this.genderSelected })
      .then(() => {
        console.log('Género actualizado correctamente.');
      })
      .catch((error) => {
        console.error('Error al actualizar el género:', error);
      });
  }
}
