import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
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

  constructor(private location: Location) {
    // Inicializa el formulario
    this.form = new FormGroup({
      peso: new FormControl('', [Validators.required, Validators.min(1)]),
    });
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {}

  saveWeight() {
    if (this.form.valid) {
      const peso = this.form.value.peso;
      const user: User = this.utilsSvc.getFromLocalStorage('user') || {};
      
      console.log("Guardando peso: ", peso); // Verifica el valor del peso

      user.peso = peso; // Guardar el peso en la variable del usuario
      this.utilsSvc.saveInLocalStorage('user', user); // Actualizar en localStorage
      
      console.log("Usuario actualizado en LocalStorage:", user); // Verifica si el usuario se actualiza correctamente
      
      this.utilsSvc.routerLink('/main/altura'); // Navegar a la siguiente página
    } else {
      this.utilsSvc.presentToast({
        message: 'Por favor, ingresa un peso válido.',
        duration: 2000,
        color: 'warning',
      });
    }
}
}
