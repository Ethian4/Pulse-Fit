import { Component, inject, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular'; // Importación del AlertController
import { Ejercicios } from 'src/app/models/ejercicios.model';
import { Rutinas } from 'src/app/models/rutinas.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-rutinas',
  templateUrl: './add-update-rutinas.component.html',
  styleUrls: ['./add-update-rutinas.component.scss'],
})
export class AddUpdateRutinasComponent implements OnInit {
  @Input() Rutina: Rutinas;

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    nota: new FormControl(''),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  alertCtrl = inject(AlertController); // Inyectar AlertController

  user = {} as User;
  Ejercicios: Ejercicios[] = []; // Lista de ejercicios para la rutina actual

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    if (this.Rutina) {
      this.form.setValue(this.Rutina);
      this.getEjercicios(); // Obtener ejercicios si ya existe la rutina
    }
  }

  getEjercicios() {
    const path = `users/${this.user.uid}/Rutinas/${this.Rutina.id}/Ejercicios`;
    this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        this.Ejercicios = res;
      },
      error: (err) => console.error('Error al obtener ejercicios:', err),
    });
  }

  

  submit() {
    if (this.form.valid) {
      if (this.Rutina) this.updateRutina();
      else this.createRutina();
    }
  }


  
  
  // CREAR RUTINA
  async createRutina() {
    const path = `users/${this.user.uid}/Rutinas`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    delete this.form.value.id;

    this.firebaseSvc.addDocument(path, this.form.value).then(async (res) => {
      const rutinaId = res.id;

      this.utilsSvc.dismissModal({ success: true });

      this.utilsSvc.presentToast({
        message: 'Rutina Creada Exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    }).catch((error) => {
      console.log(error);
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    }).finally(() => {
      loading.dismiss();
    });
  }

  // Abrir alerta para agregar un ejercicio manualmente
  async agregarEjercicio() {
    if (!this.Rutina || !this.Rutina.id) {
      this.utilsSvc.presentToast({
        message: 'Primero crea o selecciona una rutina.',
        duration: 2000,
        color: 'warning',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Agregar Ejercicio',
      inputs: [
        {
          name: 'nameE',
          type: 'text',
          placeholder: 'Nombre del ejercicio',
        },
        {
          name: 'pesoE',
          type: 'number',
          placeholder: 'Peso (kg)',
        },
        {
          name: 'tiempoE',
          type: 'number',
          placeholder: 'Tiempo (min)',
        },
        {
          name: 'repeticionesE',
          type: 'text',
          placeholder: 'Repeticiones',
        },
        
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Agregar',
          handler: (data) => this.guardarEjercicio(data),
        },
      ],
    });

    await alert.present();
  }

  // Guardar ejercicio en la subcolección
  async guardarEjercicio(data: { nameE: string; pesoE: number; tiempoE: number; repeticionesE: string; }) {
    const path = `users/${this.user.uid}/Rutinas/${this.Rutina.id}/Ejercicios`;

    const nuevoEjercicio: Ejercicios = {
      nameE: data.nameE,
      pesoE: data.pesoE,
      tiempoE: data.tiempoE,
      repeticionesE: data.repeticionesE,
    };

    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      await this.firebaseSvc.addDocument(path, nuevoEjercicio);

      this.utilsSvc.presentToast({
        message: 'Ejercicio agregado exitosamente.',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    } catch (error) {
      console.error(error);
      this.utilsSvc.presentToast({
        message: 'Error al agregar ejercicio.',
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    } finally {
      loading.dismiss();
    }
  }

  // ACTUALIZAR RUTINA
  async updateRutina() {
    const path = `users/${this.user.uid}/Rutinas/${this.Rutina.id}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    delete this.form.value.id;

    this.firebaseSvc.updateDocument(path, this.form.value).then(async () => {
      this.utilsSvc.dismissModal({ success: true });

      this.utilsSvc.presentToast({
        message: 'Rutina Actualizada Exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    }).catch((error) => {
      console.log(error);
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    }).finally(() => {
      loading.dismiss();
    });
  }
}
