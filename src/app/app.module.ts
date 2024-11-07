import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

// FIREBASE 

import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment.prod';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [AppComponent],
  imports: [
    
    BrowserModule,
    HttpClientModule, // Asegúrate de agregar esto
    ReactiveFormsModule,
    IonicModule,  // Agrega esta línea
    IonicModule.forRoot({ mode: 'md' }),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })],
    
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideFirebaseApp(() => initializeApp({"projectId":"gym-app-43543","appId":"1:1070802927753:web:bfd492b0c94ab36314c658","storageBucket":"gym-app-43543.appspot.com","apiKey":"AIzaSyB5NLNGEkv-SUxNcGQZWFyLVq-zoth_vbM","authDomain":"gym-app-43543.firebaseapp.com","messagingSenderId":"1070802927753","measurementId":"G-8G8PXWNB7Q"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({"projectId":"gym-app-43543","appId":"1:1070802927753:web:bfd492b0c94ab36314c658","storageBucket":"gym-app-43543.appspot.com","apiKey":"AIzaSyB5NLNGEkv-SUxNcGQZWFyLVq-zoth_vbM","authDomain":"gym-app-43543.firebaseapp.com","messagingSenderId":"1070802927753","measurementId":"G-8G8PXWNB7Q"}))],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  
})
export class AppModule { }
