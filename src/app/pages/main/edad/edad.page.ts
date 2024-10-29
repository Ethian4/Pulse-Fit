import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-edad',
  templateUrl: './edad.page.html',
  styleUrls: ['./edad.page.scss'],
})
export class EdadPage implements OnInit {
  ages: number[] = [];
  selectedAge: number = 18; // Edad inicial
  displayCount: number = 4; // Cantidad de números a mostrar a cada lado
  transitionClass: string = ''; // Clase para transición

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  constructor() {
    this.initAges();
  }

  initAges() {
    for (let i = 13; i <= 99; i++) {
      this.ages.push(i);
    }
  }

  nextAge() {
    this.transitionClass = 'slide-left'; // Clase para la animación
    const currentIndex = this.ages.indexOf(this.selectedAge);
    const nextIndex = (currentIndex + 1) % this.ages.length;
    this.selectedAge = this.ages[nextIndex];
    setTimeout(() => {
      this.transitionClass = ''; // Quitar la clase después de la animación
    }, 500); // Debe coincidir con la duración de la transición CSS
  }

  prevAge() {
    this.transitionClass = 'slide-right'; // Clase para la animación
    const currentIndex = this.ages.indexOf(this.selectedAge);
    const prevIndex = (currentIndex - 1 + this.ages.length) % this.ages.length;
    this.selectedAge = this.ages[prevIndex];
    setTimeout(() => {
      this.transitionClass = ''; // Quitar la clase después de la animación
    }, 500); // Debe coincidir con la duración de la transición CSS
  }



  ngOnInit() {}

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  } 
	}