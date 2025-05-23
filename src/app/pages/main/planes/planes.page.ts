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
  isProcessing: boolean = false; // Flag para controlar el estado de procesamiento de la compra
  isPlanDisabled: boolean = false; // Variable para controlar el estado de deshabilitación del botón
  
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
    // Si el usuario ya tiene este plan, no proceder al pago
    if (this.user.planNombre === plan.name) {
      this.isPlanDisabled = true; // Deshabilitar el botón
      this.utilsSvc.presentToast({
        message: 'Ya tienes este plan.',
        duration: 1500,
        color: 'success',
        position: 'middle',
      });
      return; // Detener el proceso si el usuario ya tiene el plan
    }

    this.selectedPlan = plan;
    this.isPlanDisabled = false; // Habilitar el botón si el usuario no tiene este plan
    this.startPaymentProcess(plan);
  }

  async startPaymentProcess(plan: any) {
    this.isProcessing = true; // Activar el estado de procesamiento
    try {
      // Iniciar el proceso de pago con PayPal
      const paymentData = await this.paypalService.createPayment(plan);

      // Si el pago fue exitoso
      if (paymentData) {
        // Aquí se actualizan los datos del usuario con los valores del plan seleccionado

        

        const updatedUser: User = { ...this.user };

        updatedUser.planNombre = plan.name;
        updatedUser.cargoMensual = plan.price;
        updatedUser.tokens = plan.tokens;
        updatedUser.gp = plan.gyms;
        updatedUser.ga = plan.additionalGyms;

        const today = new Date();

        // Crear una nueva fecha para el próximo cobro
        let nextChargeDate = new Date(today); // Usar la fecha actual
  
        // Ajustar la fecha de cobro según la duración del plan
        if (plan.duration.includes('Mensual')) {
          nextChargeDate.setMonth(today.getMonth() + 1); // Pago mensual, sumar 1 mes
        } else if (plan.duration.includes('3 Meses')) {
          nextChargeDate.setMonth(today.getMonth() + 3); // Pago por 3 meses, sumar 3 meses
        }
  
        // Formatear la fecha para solo incluir año/mes/día
        const year = nextChargeDate.getFullYear();
        const month = String(nextChargeDate.getMonth() + 1).padStart(2, '0'); 
        const day = String(nextChargeDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        // Actualiza el documento del usuario en Firebase
        await this.firebaseSvc.updateDocument(`users/${this.user.uid}`, updatedUser);

        // Muestra el mensaje de éxito
        this.utilsSvc.presentToast({
          message: 'Pago realizado con éxito',
          duration: 1500,
          color: 'success',
          position: 'middle',
        });

        // Redirige a la página principal o de inicio
        this.router.navigate(['/main/payment']); // Puedes cambiar la ruta de acuerdo a tu flujo

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
      price: 1500,
      gyms: 1,
      additionalGyms: 2,
      tokens: 8,
      image: 'assets/icon/Imagen1.png',
    },
    {
      name: 'Pulse Básico',
      duration: '(Mensual)',
      price: 800,
      gyms: 1,
      additionalGyms: 3,
      tokens: 12,
      image: 'assets/icon/Imagen2.png',
    },
    {
      name: 'Pulse Premium',
      duration: '(Mensual)',
      price: 1200,
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
