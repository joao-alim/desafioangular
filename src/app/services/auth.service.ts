import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  login(usuario: string, senha: string): Observable<boolean> {
    if (usuario === 'admin' && senha === '123456') {
      localStorage.setItem('user_logged_in', 'true');
      return of(true);
    } else {
      return throwError(() => new Error('Usuário ou senha inválidos'));
    }
  }

  logout(): void {
    localStorage.removeItem('user_logged_in');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user_logged_in');
  }
}