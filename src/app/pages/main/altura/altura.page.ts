import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-altura',
  templateUrl: './altura.page.html',
  styleUrls: ['./altura.page.scss'],
})
export class AlturaPage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  
  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  } 
  constructor() { }

  ngOnInit() {
  }

}
