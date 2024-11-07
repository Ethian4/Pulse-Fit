import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { PayPalService} from 'src/app/services/paypal.service';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.page.html',
  styleUrls: ['./planes.page.scss'],
})
export class PlanesPage implements OnInit {

  user: User = {} as User;
  selectedPlan: any;

 constructor(
    private navController: NavController,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private router: Router,
    private paypalService: PayPalService
  ) {}

  ngOnInit() {
    // Obtener datos del usuario
    this.user = this.utilsSvc.getFromLocalStorage('user');
  }

  selectPlan(plan: any) {
    this.selectedPlan = plan;
    this.startPaymentProcess(plan);
  }

  async startPaymentProcess(plan: any) {
    try {
      // Iniciar el proceso de pago con PayPal
      const paymentData = await this.paypalService.createPayment(plan);
      
      // El SDK de PayPal ya maneja la creación del pago y la ejecución.
      // Si el pago fue aprobado, el SDK de PayPal invoca onApprove y maneja la captura.
      if (paymentData) {
        // Aquí puedes procesar la información de pago recibida, si es necesario
        this.utilsSvc.presentToast({
          message: 'Pago realizado con éxito',
          duration: 1500,
          color: 'success',
          position: 'middle',


          



        });
        this.router.navigate(['/main/payment']); // O cualquier ruta después de un pago exitoso
      }
    } catch (error) {
      console.error('Error al iniciar el pago:', error);
      this.utilsSvc.presentToast({
        message: 'Hubo un problema al iniciar el pago.',
        duration: 1500,
        color: 'danger',
        position: 'middle',
      });
    }
  }

  planes = [
    {
      name: 'Nuevo Usuario',
      duration: '(3 Meses)',
      price: 1,
      gyms: 1,
      additionalGyms: 2,
      tokens: 8,
      image: 'assets/icon/Imagen1.png',
    },
    {
      name: 'Pulse Básico',
      duration: '(Mensual)',
      price: 2,
      gyms: 1,
      additionalGyms: 3,
      tokens: 12,
      image: 'assets/icon/Imagen2.png',
    },
    {
      name: 'Pulse Premium',
      duration: '(Mensual)',
      price: 3,
      gyms: 1,
      additionalGyms: 5,
      tokens: 16,
      image: 'assets/icon/Imagen3.png',
    },
  ];

  goBack() {
    this.navController.back();
  }
}
