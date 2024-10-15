import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query, updateDoc, deleteDoc} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from "firebase/storage";


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  utilsSvc = inject(UtilsService);

  // AUTENTICACION
  getAuth(){
    return getAuth();
  }

  // ACCEDER
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // Registrar
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // Actualizar
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  

  //CERRAR SESION
  signOut(){
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }


                    //BASE DE DATOS

  //ACTUALIZAR DOCUMENTO
  updateDocument(path: string, data:any){
    return updateDoc(doc(getFirestore(), path), data);
  }

    //BORRAR DOCUMENTO
    deleteDocument(path: string){
      return deleteDoc(doc(getFirestore(), path));
    }



  //OBTENER DOCUMENTO DE COLECCION
  getCollectionData(path: string, collectionQuery?: any){
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery), {idField:'id'});  //OBTENR EL ID
  }

  //SETEAR DOCUMENTOS
  setDocument(path: string, data: any){
    return setDoc(doc(getFirestore(),path),data);
  }


  //OBTENER DOCUMENTO
  async getDocument(path: string){
    return (await getDoc(doc(getFirestore(),path))).data();
  }

  //AGREGAR DOCUMENTO
  addDocument(path: string, data: any){
    return addDoc(collection(getFirestore(), path), data);
  }


  //ALMACENAMIENTO

  //IMAGEN
  async uploadImage(path: string, data_url: string){
    return uploadString(ref(getStorage(), path),data_url, 'data_url').then(() =>{
      return getDownloadURL(ref(getStorage(), path) )
    })
  }

  //ELIMINAR ARCHIVO
  deleteFile(path: string){
    return deleteObject(ref(getStorage(), path))
  }
}
