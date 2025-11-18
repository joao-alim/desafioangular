import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router) {}

  login() {
    if (this.user === 'admin' && this.password === '123456') {
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'Usuário ou senha inválidos';
    }
  }
}