import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.page.html',
  styleUrls: ['./datos.page.scss'],
})
export class DatosPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  constructor(private location: Location) {}

  userData: User;

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.userData = this.utilsSvc.getFromLocalStorage('user');
    console.log('Datos del usuario:', this.userData); // Verificar en consola
  }
  
  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  goBack() {
    this.location.back();
  }

}

