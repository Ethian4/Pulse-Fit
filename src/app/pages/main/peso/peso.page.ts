import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-peso',
  templateUrl: './peso.page.html',
  styleUrls: ['./peso.page.scss'],
})
export class PesoPage implements OnInit {
  form: FormGroup;
  utilsSvc = inject(UtilsService);

  constructor() {
    // Inicializa el formulario
    this.form = new FormGroup({
      peso: new FormControl('', [Validators.required, Validators.min(1)]),
    });
  }

  ngOnInit() {}

  saveWeight() {
    if (this.form.valid) {
      const peso = this.form.value.peso;
      const user: User = this.utilsSvc.getFromLocalStorage('user') || {};
      user.peso = peso; // Guardar el peso en la variable del usuario
      this.utilsSvc.saveInLocalStorage('user', user); // Actualizar en localStorage
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
