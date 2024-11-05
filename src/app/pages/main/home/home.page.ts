import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  rutinasMes: number = 0;
  rutinasSemana: number = 0; // Añadir esta línea
  rutinasCompletadas: number = 0;
  percentageMes: number = 0;

  ngOnInit() {
    const user: User = this.utilsSvc.getFromLocalStorage('user');

    if (user) {
      this.rutinasMes = user.rutinasMes || 0;
      this.rutinasSemana = user.rutinasSemana || 0; // Obtener rutinas de la semana
      this.rutinasCompletadas = user.rutinasCompletadas || 0;

      // Calcular el porcentaje respecto a rutinasMes
      this.percentageMes = this.calculatePercentage(this.rutinasCompletadas, this.rutinasMes);
      
      // Asegúrate de que el porcentaje esté entre 0 y 100
      this.percentageMes = Math.min(Math.max(this.percentageMes, 0), 100);
    }
  }

  calculatePercentage(completadas: number, total: number): number {
    if (total === 0) return 0; // Evitar división por cero
    return (completadas / total) * 100;
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }
}
