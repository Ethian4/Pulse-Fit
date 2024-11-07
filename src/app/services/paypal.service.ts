import { Injectable } from '@angular/core';

declare let paypal: any;

@Injectable({
  providedIn: 'root',
})
export class PayPalService {
  private isPayPalButtonRendered = false; // Bandera para controlar si ya se ha renderizado el botón

  constructor() {}

  // Crear un pago con PayPal
  createPayment(plan: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // Verificar si el botón ya fue renderizado
      if (this.isPayPalButtonRendered) {
        console.log("Botón de PayPal ya renderizado");
        resolve(null); // No hacer nada si el botón ya se ha renderizado
        return;
      }

      const paymentData = {
        amount: plan.price, // Precio del plan seleccionado
        description: `Pago por el plan: ${plan.name}`,
      };

      // Configurar la transacción en PayPal
      paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: paymentData.amount, // Monto a pagar
                },
                description: paymentData.description, // Descripción del pago
              },
            ],
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            // Pago aprobado exitosamente
            this.isPayPalButtonRendered = true; // Cambiar el estado para evitar que se renderice de nuevo
            resolve(details);
            // Opcional: Eliminar o deshabilitar el botón después de completar el pago
            this.removePayPalButton();
          });
        },
        onError: (err: any) => {
          // Manejo de errores
          reject(err);
        },
      }).render('#paypal-button-container'); // Esto renderiza el botón de PayPal en tu página
    });
  }

  // Método para eliminar el botón de PayPal después del pago
  private removePayPalButton() {
    const paypalButtonContainer = document.getElementById('paypal-button-container');
    if (paypalButtonContainer) {
      paypalButtonContainer.innerHTML = ''; // Elimina el botón de PayPal del DOM
    }
  }
}
