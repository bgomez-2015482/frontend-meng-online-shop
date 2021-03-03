import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

const jwtDecote = require('jwt-decode');

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivateChild {
  constructor(private auth: AuthService, private router: Router) { }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    // Primero comprobar que existe sesión
    if (this.auth.getSession() !== null) {
      console.log('logueados');
      const dataDecode = this.decodeToken();
      console.log(dataDecode);
      // Comprobar que no esta caducado el token
      if (dataDecode.exp < new Date().getTime() / 1000) {
        console.log('Sesión caducada');
        return this.redirect();
      }
      // El role del usuario es ADMIN
      if (dataDecode.user.role === 'ADMIN') {
        console.log('Bienvenido Administrador');
        return true;
      }
      console.log('No es un Administrador');
    }
    console.log('Sesión no iniciada');
    return this.redirect();
  }

  redirect() {
    this.router.navigateByUrl('/login');
    return false;
  }

  decodeToken() {
    return jwtDecote(this.auth.getSession().token);
  }
}
