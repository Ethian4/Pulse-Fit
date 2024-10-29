import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ready',
  templateUrl: './ready.page.html',
  styleUrls: ['./ready.page.scss'],
})
export class ReadyPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    // Redirigir a la página de inicio después de 3 segundos
    setTimeout(() => {
      this.router.navigate(['main/home']); // Asegúrate de que la ruta sea correcta
    }, 3000); // 3000 milisegundos = 3 segundos
  }
}
