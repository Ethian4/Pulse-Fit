import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-metas',
  templateUrl: './metas.page.html',
  styleUrls: ['./metas.page.scss'],
})
export class MetasPage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  router = inject(Router);

  rutinasMes: number | null = null; // Almacena las sesiones al mes
  rutinasSemana: number | null = null; // Almacena las sesiones a la semana
  userData: User;

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    // Obtener los datos del usuario desde el localStorage
    this.userData = this.utilsSvc.getFromLocalStorage('user');

    // Asegurarse de que 'PlanNombre' sea siempre "Sin Plan"
    this.userData.planNombre = "Sin Plan";

    // Inicializa rutinasCompletadas en 0 si no está definida
    if (this.userData.rutinasCompletadas === undefined || this.userData.rutinasCompletadas === null) {
      this.userData.rutinasCompletadas = 0; // Inicializa a 0
    }
  }

  // Método para guardar las metas y generar el código QR
  async saveGoals() {
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

    // Generar el código QR con la información del usuario
    const qrData = {
      uid: this.userData.uid,
      name: this.userData.name,
      email: this.userData.email,
    };

    try {
      // Generar el código QR como una URL de imagen (base64)
      const qrUrl = await QRCode.toDataURL(JSON.stringify(qrData));
      this.userData.qr = qrUrl; // Guardar el QR en el campo del usuario

      // Actualizamos las metas del usuario
      this.userData.rutinasMes = this.rutinasMes;
      this.userData.rutinasSemana = this.rutinasSemana;

      // Asegúrate de que rutinasCompletadas esté definida antes de guardar
      this.userData.rutinasCompletadas = this.userData.rutinasCompletadas || 0;

      // Guardar en localStorage
      this.utilsSvc.saveInLocalStorage('user', this.userData);

      // Actualizar en Firebase
      await this.firebaseSvc.updateDocument(`users/${this.userData.uid}`, { 
        rutinasMes: this.rutinasMes, 
        rutinasSemana: this.rutinasSemana,
        rutinasCompletadas: this.userData.rutinasCompletadas, 
        qr: this.userData.qr, // Guardar el QR en Firebase
        planNombre: this.userData.planNombre, // Guardar el PlanNombre en Firebase
      });

      console.log('Metas y QR actualizados correctamente.');

      // Redirigir a la página de "ready"
      this.router.navigate(['/main/ready']);
    } catch (error) {
      console.error('Error al generar el QR o guardar las metas:', error);
      this.utilsSvc.presentToast({
        message: 'Hubo un error al generar el QR o guardar las metas.',
        duration: 2000,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    }
  }
}
