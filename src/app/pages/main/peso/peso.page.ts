import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-peso',
  templateUrl: './peso.page.html',
  styleUrls: ['./peso.page.scss'],
})
export class PesoPage implements OnInit {
  form: FormGroup;
  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);

  constructor(private location: Location) {
    // Inicializa el formulario
    this.form = new FormGroup({
      peso: new FormControl('', [Validators.required, Validators.min(1)]),
    });
  }

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  async saveWeight() {
    if (this.form.valid) {
      const peso = this.form.value.peso;
      const user: User = this.utilsSvc.getFromLocalStorage('user') || {};
      
      console.log("Guardando peso: ", peso); // Verifica el valor del peso

      // Actualizar el peso en la variable del usuario
      user.peso = peso;

      // Guardar en localStorage
      this.utilsSvc.saveInLocalStorage('user', user); 
      console.log("Usuario actualizado en LocalStorage:", user);

      // Actualizar el peso en Firebase
      if (user.uid) {
        try {
          await this.firebaseSvc.updateDocument(`users/${user.uid}`, { peso });
          console.log("Peso actualizado en Firebase:", peso);
        } catch (error) {
          console.error("Error al actualizar el peso en Firebase:", error);
        }
      }

      // Navegar a la siguiente página
      this.utilsSvc.routerLink('/main/altura');
    } else {
      this.utilsSvc.presentToast({
        message: 'Por favor, ingresa un peso válido.',
        duration: 2000,
        color: 'warning',
      });
    }
  }
}
