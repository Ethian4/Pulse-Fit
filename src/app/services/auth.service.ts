import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const user = localStorage.getItem('user');
    return !!user;
  }

  // Guardar la información del usuario
  login(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Cerrar sesión y limpiar la información del usuario
  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/auth']);
  }

  // Redirigir al login si el usuario no está autenticado
  redirectToLogin() {
    this.router.navigate(['/auth']);
    return false;
  }

  // Obtener los detalles del usuario desde localStorage
  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}