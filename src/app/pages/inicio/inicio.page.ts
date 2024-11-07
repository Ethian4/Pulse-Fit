import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  onNavigate() {
    // Activamos la animación en el botón
    const button = document.querySelector('.custom-button');
    button?.classList.add('animate-out');  // Añadimos la clase para la animación

    // Después de 0.5 segundos (el tiempo de la animación), redirigimos al usuario
    setTimeout(() => {
      this.router.navigate(['/auth']);  // Navegamos a la página de autenticación
    }, 500);  // El tiempo aquí debe coincidir con la duración de la animación (500ms)
  }
}
