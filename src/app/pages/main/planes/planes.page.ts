import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular'; // Importar NavController

@Component({
  selector: 'app-planes',
  templateUrl: './planes.page.html',
  styleUrls: ['./planes.page.scss'],
})
export class PlanesPage implements OnInit {
  userId: string;  // Definir userId
  planSeleccionado: string;

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private afAuth: AngularFireAuth,  // Servicio para obtener usuario autenticado
    private navCtrl: NavController  // Inyectar NavController
  ) {}

  ngOnInit() {
    // Obtén el UID del usuario autenticado
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid; // Asigna el UID a userId
      } else {
        console.log('No hay usuario autenticado');
      }
    });
  }

  async contratarPlan(planName: string) {
    if (!this.userId) {
      console.error('No se ha encontrado un usuario autenticado');
      this.utilsSvc.presentToast({
        message: 'Por favor inicia sesión para contratar un plan.',
        duration: 2000,
        color: 'warning',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
      return;
    }

    try {
      // Verifica si el documento del usuario existe
      const userDoc = await this.firebaseSvc.getDocument(`users/${this.userId}`);

      if (!userDoc) {
        // Si no existe, crea el documento con datos básicos
        const newUser = {
          uid: this.userId,
          name: 'Usuario Ejemplo', // Coloca los datos correctos aquí
          email: 'usuario@example.com',
          planNombre: planName,
          // Otros campos pueden ser necesarios según tu modelo
        };
        await this.firebaseSvc.addDocument(`users/${this.userId}`, newUser);
        console.log('Documento de usuario creado con éxito');
      } else {
        // Si existe, actualiza el documento
        await this.firebaseSvc.updateDocument(`users/${this.userId}`, { planNombre: planName });
        console.log('Plan contratado con éxito');
      }

      // Muestra un mensaje de éxito
      this.utilsSvc.presentToast({
        message: 'Plan contratado con éxito',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    } catch (error) {
      console.error('Error al contratar el plan:', error);
      this.utilsSvc.presentToast({
        message: 'Error al contratar el plan: ' + error.message,
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    }
  }

  // Método para retroceder a la pantalla anterior
  goBack() {
    this.navCtrl.back();  // Usa NavController para navegar hacia atrás
  }
}
