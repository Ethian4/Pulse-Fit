import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-altura',
  templateUrl: './altura.page.html',
  styleUrls: ['./altura.page.scss'],
})
export class AlturaPage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  router = inject(Router);

  altura: number | null = null; // Variable para almacenar la altura ingresada
  userData: User;

  constructor(private location: Location) {}

  ngOnInit() {
    // Obtener los datos del usuario desde el localStorage
    this.userData = this.utilsSvc.getFromLocalStorage('user');
  }

  goBack() {
    this.location.back();
  }

  // Método para guardar la altura
  saveHeight() {
    if (this.altura === null || this.altura <= 0) {
      this.utilsSvc.presentToast({
        message: 'Por favor ingresa una altura válida.',
        duration: 2000,
        color: 'warning',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
      return;
    }

    // Actualizamos la altura del usuario y guardamos en localStorage
    this.userData.altura = this.altura;
    this.utilsSvc.saveInLocalStorage('user', this.userData);

    // Actualizar en Firebase
    if (this.userData.uid) {
      this.firebaseSvc.updateDocument(`users/${this.userData.uid}`, { altura: this.altura })
        .then(() => {
          console.log('Altura actualizada correctamente.');
          // Redirigir a la página de metas
          this.router.navigate(['/main/metas']);
        })
        .catch((error) => {
          console.error('Error al actualizar la altura:', error);
        });
    }
  }
}
