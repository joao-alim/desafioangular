import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para usar *ngIf, *ngFor
import { RouterLink } from '@angular/router';   // <--- ESSENCIAL PARA O BOTÃO FUNCIONAR!

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink], // <--- ADICIONE RouterLink AQUI
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

}
