import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edad',
  templateUrl: './edad.page.html',
  styleUrls: ['./edad.page.scss'],
})
export class EdadPage implements OnInit {
  ages: number[] = [];
  selectedAge: number = 18; // Edad inicial
  transitionClass: string = ''; // Clase para la animación de transición

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  constructor(private location: Location) {
    this.initAges();
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {}

  // Inicializa el array de edades
  initAges() {
    for (let i = 13; i <= 99; i++) {
      this.ages.push(i);
    }
  }

  // Cambiar a la edad siguiente
  nextAge() {
    this.transitionClass = 'slide-left';
    const currentIndex = this.ages.indexOf(this.selectedAge);
    const nextIndex = (currentIndex + 1) % this.ages.length;
    this.selectedAge = this.ages[nextIndex];

    setTimeout(() => {
      this.transitionClass = '';
    }, 500); // Debe coincidir con la duración de la transición CSS
  }

  // Cambiar a la edad anterior
  prevAge() {
    this.transitionClass = 'slide-right';
    const currentIndex = this.ages.indexOf(this.selectedAge);
    const prevIndex = (currentIndex - 1 + this.ages.length) % this.ages.length;
    this.selectedAge = this.ages[prevIndex];

    setTimeout(() => {
      this.transitionClass = '';
    }, 500);
  }

  // Guardar la edad seleccionada en el usuario
  saveAge() {
    const user: User = this.utilsSvc.getFromLocalStorage('user');
    user.edad = this.selectedAge;

    // Guardar la edad en localStorage
    this.utilsSvc.saveInLocalStorage('user', user);

    // Actualizar en Firebase (opcional)
    this.firebaseSvc.updateDocument(`users/${user.uid}`, { edad: this.selectedAge })
      .then(() => console.log('Edad guardada correctamente en Firebase'))
      .catch((error) => console.error('Error al guardar la edad:', error));
  }
}
