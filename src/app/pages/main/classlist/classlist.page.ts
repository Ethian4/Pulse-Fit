import { Component, inject, OnInit, Injectable } from '@angular/core';
import { Rutinas } from 'src/app/models/rutinas.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateRutinasComponent } from 'src/app/shared/components/add-update-rutinas/add-update-rutinas.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { addDays, startOfWeek, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatDate } from '@angular/common'; // Importa el módulo para manejar fechas


@Component({
  selector: 'app-classlist',
  templateUrl: './classlist.page.html',
  styleUrls: ['./classlist.page.scss'],
})
export class ClasslistPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  Rutinas: Rutinas[] = [];
  weekDays: { label: string; date: Date }[] = [];

  ngOnInit() {
    this.initializeWeekDays();
  }

  ionViewWillEnter() {
    this.getRutinas();
  }




  initializeWeekDays() {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // Lunes como inicio de semana
    this.weekDays = Array.from({ length: 7 }, (_, i) => ({
      label: format(addDays(start, i), 'EEE', { locale: es }), // Formato de día en 3 letras en español
      date: addDays(start, i),
    }));
  }


  getRoutineLetter(dayIndex: number): string {
    const currentDate = this.weekDays[dayIndex].date;

    const rutina = this.Rutinas.find(r => {
      const rutinaDate = new Date(r.date); // Asegúrate de que 'date' sea una propiedad válida en Rutinas
      return rutinaDate.toDateString() === currentDate.toDateString();
    });

    // Si no hay rutina, devolver un guion "-"
    return rutina ? this.getAlphabetLetter(this.Rutinas.indexOf(rutina)) : '-';
  }


  // Devuelve el usuario desde el localStorage
  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }



  //OBTENER LAS RUTINAS 
  getRutinas() {
    const path = `users/${this.user().uid}/Rutinas`;
    const sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        this.Rutinas = res;
        sub.unsubscribe();
      },
    });
  }

  getAlphabetLetter(index: number): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return alphabet[index % alphabet.length];
  }


  hasRoutine(dayIndex: number): boolean {
    // Verifica si la letra del día es distinta de "-"
    return this.getRoutineLetter(dayIndex) !== '-';
  }

  // ELIMINAR RUTINA
  async deleteRutina(Rutina: Rutinas) {

    let path = `users/${this.user().uid}/Rutinas/${Rutina.id}`

    const loading = await this.utilsSvc.loading();
    await loading.present();


    this.firebaseSvc.deleteDocument(path).then(async res => {

      this.Rutinas = this.Rutinas.filter(r => r.id !== Rutina.id);

      this.utilsSvc.presentToast({
        message: 'Rutina Eliminada Exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'

      })

    }).catch(error => {
      console.log(error);

      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'

      })

    }).finally(() => {
      loading.dismiss();
    })

  }

  // ACTUALIZAR EL ESTADO DEL CHECKBOX EN FIREBASE
  async onCheckboxChange(rutina: Rutinas) {
    console.log(`Estado de ${rutina.name}: ${rutina.checked}`);
  
    const pathRutina = `users/${this.user().uid}/Rutinas/${rutina.id}`;
    const pathUser = `users/${this.user().uid}`;
  
    try {
      // Actualiza el estado del checkbox en Firebase
      await this.firebaseSvc.updateDocument(pathRutina, { checked: rutina.checked });
  
      // Obtener el usuario actual del localStorage
      const user = this.user();
      let nuevasRutinasCompletadas = user.rutinasCompletadas || 0;
  
      // Incrementar o decrementar según el estado del checkbox
      if (rutina.checked) {
        nuevasRutinasCompletadas += 1;
      } else if (nuevasRutinasCompletadas > 0) {
        nuevasRutinasCompletadas -= 1;
      }
  
      // Actualizar el valor en Firebase
      await this.firebaseSvc.updateDocument(pathUser, { rutinasCompletadas: nuevasRutinasCompletadas });
  
      // Actualizar el valor en el localStorage y en el estado local
      user.rutinasCompletadas = nuevasRutinasCompletadas;
      this.utilsSvc.saveInLocalStorage('user', user);
  
      // Actualiza el estado local sin recargar la vista
      this.Rutinas = this.Rutinas.map(r =>
        r.id === rutina.id ? { ...r, checked: rutina.checked } : r
      );
  
      console.log(`Rutinas completadas: ${nuevasRutinasCompletadas}`);
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    }
  }
  
  
  
  



  //Agregar Rutina
  async addUpdateRutinas(Rutina?: Rutinas) {
    const success = await this.utilsSvc.presentModal({
      component: AddUpdateRutinasComponent,
      cssClass: 'add-update-modal',
      componentProps: { Rutina },
    });

    if (success) this.getRutinas();
  }



}
