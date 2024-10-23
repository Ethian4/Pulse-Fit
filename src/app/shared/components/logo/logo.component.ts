import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent  implements OnInit {
  welcomeMessage: string;

  constructor(private router: Router) {}

  ngOnInit() {
    this.updateWelcomeMessage();
  }

  updateWelcomeMessage() {
    const currentRoute = this.router.url;

    if (currentRoute === '/auth/sign-up') {
      this.welcomeMessage = 'Regístrate';
    } else if (currentRoute === '/auth') {
      this.welcomeMessage = 'Bienvenido';
    } else {
      this.welcomeMessage = ''; // Mensaje por defecto si no coincide con las rutas
    }
  }
}
