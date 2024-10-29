import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router'; // Importa el Router

@Component({
  selector: 'app-metas',
  templateUrl: './metas.page.html',
  styleUrls: ['./metas.page.scss'],
})
export class MetasPage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  router = inject(Router); // Inyecta el Router

  rutinasMes: number | null = null; // Almacena las sesiones al mes
  rutinasSemana: number | null = null; // Almacena las sesiones a la semana
  userData: User;

  ngOnInit() {
    // Obtener los datos del usuario desde el localStorage
    this.userData = this.utilsSvc.getFromLocalStorage('user');
  }

  // Método para guardar las metas
  saveGoals() {
    if (this.rutinasMes === null || this.rutinasSemana === null) {
      this.utilsSvc.presentToast({
        message: 'Por favor ingresa ambas metas.',
        duration: 2000,
        color: 'warning',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
      return;
    }

    // Actualizamos las rutinas del usuario y guardamos en localStorage
    this.userData.rutinasMes = this.rutinasMes;
    this.userData.rutinasSemana = this.rutinasSemana;
    this.utilsSvc.saveInLocalStorage('user', this.userData);

    // Actualizar en Firebase (opcional)
    this.firebaseSvc.updateDocument(`users/${this.userData.uid}`, { 
      rutinasMes: this.rutinasMes, 
      rutinasSemana: this.rutinasSemana 
    })
    .then(() => {
      console.log('Metas actualizadas correctamente.');
      // Redirigir a la página de "ready"
      this.router.navigate(['/main/ready']);
    })
    .catch((error) => {
      console.error('Error al actualizar las metas:', error);
    });
  }
}
