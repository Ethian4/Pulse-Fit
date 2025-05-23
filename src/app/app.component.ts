import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showTabs = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Rutas donde quieres ocultar el tab bar
        const hideTabRoutes = ['','/inicio','/auth', '/auth/sign-up','/main/genero','/main/edad','/main/peso','/main/altura','/main/metas','/main/ready','/main/datos','/main/settings','','/main/planes' ];

        // Verifica si la ruta actual está en las rutas donde ocultar el tab bar
        this.showTabs = !hideTabRoutes.includes(event.url);
      }
    });
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
