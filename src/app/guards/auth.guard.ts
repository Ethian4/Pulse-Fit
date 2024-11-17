import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';  // Asegúrate de que la ruta es correcta

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  if (authService.isAuthenticated()) {
    return true;  // Si el usuario está autenticado, permitir el acceso a la ruta
  } else {
    return authService.redirectToLogin();  // Si no está autenticado, redirigir al login
  }
};
