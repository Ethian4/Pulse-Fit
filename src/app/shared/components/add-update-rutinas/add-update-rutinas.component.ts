import { Component, inject, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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
    checked: new FormControl(false), // Checkbox para el estado de la rutina
    date: new FormControl(new Date().toISOString().slice(0, 10), [Validators.required]) // Campo de fecha
  });



  firestore = inject(AngularFirestore);
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  alertCtrl = inject(AlertController); 

  user = {} as User;
  Ejercicios: Ejercicios[] = []; 
  

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    if (this.Rutina) {
      this.form.setValue({
        id: this.Rutina.id || '',
        name: this.Rutina.name || '',
        nota: this.Rutina.nota || '',
        checked: this.Rutina.checked || false,
        date: this.Rutina.date || new Date().toISOString().slice(0, 10), // Establece la fecha de la rutina
      });
      this.getEjercicios();
    }
  }

  

  generateId(): string {
    return this.firestore.createId(); // Crea un ID único
  }


  //OBTENER LAS RUTINAS 
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

  //CREAR EJERCICIOS
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


  // GUARDAR EL EJERCICIO
  async guardarEjercicio(data: { nameE: string; pesoE: number; tiempoE: number; repeticionesE: string; }) {
    const path = `users/${this.user.uid}/Rutinas/${this.Rutina.id}/Ejercicios`;

    const nuevoEjercicio: Ejercicios = {
      id: this.generateId(), // Genera un ID único
      nameE: data.nameE,
      pesoE: data.pesoE,
      tiempoE: data.tiempoE,
      repeticionesE: data.repeticionesE,
      checkedE: false,
    };

    const loading = await this.utilsSvc.loading();
    await loading.present();

    delete this.form.value.id;

    try {
      // Agrega el ejercicio a Firebase
      await this.firebaseSvc.addDocument(path, nuevoEjercicio);
      
      // Actualiza la lista local de ejercicios
      this.Ejercicios.push(nuevoEjercicio);

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
    this.form.reset();
  }

trackByFn(index: number, item: Ejercicios) {
  return item.id; // o cualquier propiedad única
}



    // ELIMINAR EJERCICIO
    async deleteEjercicio(Ejercicio: Ejercicios) {
      let path = `users/${this.user.uid}/Rutinas/${this.Rutina.id}/Ejercicios/${Ejercicio.id}`;
  
      const loading = await this.utilsSvc.loading();
      await loading.present();
  
      this.firebaseSvc.deleteDocument(path).then(async res => {
        this.Ejercicios = this.Ejercicios.filter(e => e.id !== Ejercicio.id);
  
        this.utilsSvc.presentToast({
          message: 'Rutina Eliminada Exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        });
      }).catch(error => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      }).finally(() => {
        loading.dismiss();
      });
    }

    



    async updateCheckedState(ejercicio: Ejercicios, isChecked: boolean) {
      const path = `users/${this.user.uid}/Rutinas/${this.Rutina.id}/Ejercicios/${ejercicio.id}`;
  
      try {
        // Actualiza el estado checkedE en Firebase
        await this.firebaseSvc.updateDocument(path, { checkedE: isChecked });
        // Actualiza la propiedad local para reflejar el cambio en la UI
        ejercicio.checkedE = isChecked;
      } catch (error) {
        console.error(error);
        this.utilsSvc.presentToast({
          message: 'Error al actualizar el estado del ejercicio.',
          duration: 2500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      }
    }
  }


