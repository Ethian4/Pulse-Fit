import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  userData: User; // Variable para almacenar los datos del usuario

  constructor() {
    // Inicializa la variable userData con los datos del localStorage o inicializa vacío
    this.userData = this.utilsSvc.getFromLocalStorage('user') || {} as User;
  }

  ngOnInit() {
    // Aquí no es necesario hacer nada en ngOnInit, se utilizará ionViewWillEnter
  }

  // Método para cargar los datos del usuario desde Firestore
  async loadUserData() {
    const user = this.utilsSvc.getFromLocalStorage('user');
    if (user && user.uid) {
      const path = `users/${user.uid}`;
      const userDocument = await this.firebaseSvc.getDocument(path);  // Obtener los datos del usuario
      if (userDocument) {
        this.userData = userDocument as User; // Asignar los datos a la variable
        this.utilsSvc.saveInLocalStorage('user', this.userData);  // Actualizar los datos en el localStorage
      }
    }
  }

  // Este método se ejecuta cada vez que la página se va a mostrar
  ionViewWillEnter() {
    this.loadUserData(); // Cargar los datos cuando la página sea visitada
  }
}
