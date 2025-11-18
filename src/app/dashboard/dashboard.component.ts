import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { FordApiService } from '../services/ford-api.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

// OBS: Se você não criou um modelo de interface (Vehicle, VehicleData), use 'any' 
// para evitar erros de tipagem.

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // ReactiveFormsModule é necessário para o FormControl
  imports: [CommonModule, FormsModule, ReactiveFormsModule], 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  // Variáveis de Estado
  vehicles: any[] = [];
  selectedVehicle: any = null;
  
  // Variáveis para os cartões de KPI (Ação 3 - Passo 9)
  totalSales: number = 0;
  connectedVehicles: number = 0;
  softwareUpdates: number = 0;
  vehicleImage: string = '';

  // RxJS: Cria o controle do campo de busca (Ação 3 - Passo 11)
  searchControl = new FormControl('');
  filteredVehicleData$!: Observable<any[]>; 

  constructor(private apiService: FordApiService) {}

  ngOnInit() {
    // 1. Carregar lista de veículos (Ação 3 - Passo 8)
    this.apiService.getVehicles().subscribe(data => {
      this.vehicles = data;
      // Garante que o primeiro veículo seja selecionado na inicialização
      if (data && data.length > 0) {
        this.selectedVehicle = data[0];
        this.updateKpis(this.selectedVehicle);
        this.vehicleImage = this.selectedVehicle.image;
      }
    });

    // 2. Lógica RxJS para o campo de busca (Critério de Avaliação)
    this.filteredVehicleData$ = this.searchControl.valueChanges.pipe(
      // Espera 300ms (debounceTime) e ignora valores repetidos (distinctUntilChanged)
      debounceTime(300), 
      distinctUntilChanged(), 
      // Troca para o Observable da chamada API (switchMap)
      switchMap(searchTerm => this.apiService.getVehicleData(searchTerm || ''))
    );
    
    // Configuração inicial para carregar dados vazios ou iniciais
    // Se a API retornar dados no primeiro acesso, remova o comentário abaixo:
    // this.searchControl.setValue(''); 
  }

  /**
   * Chamada quando o veículo no seletor muda (Ação 3 - Passo 9 e 10)
   * @param vehicle O objeto do veículo selecionado
   */
  onVehicleSelect(vehicle: any) {
    this.selectedVehicle = vehicle;
    this.updateKpis(vehicle);
    this.vehicleImage = vehicle.image;
  }

  /**
   * Atualiza os cartões de KPI
   * @param vehicle O objeto do veículo para extrair os dados
   */
  updateKpis(vehicle: any) {
    // ESTE É O MÉTODO QUE ESTAVA FORA DA CLASSE!
    // Ele precisa estar aqui dentro para ser acessado com 'this.updateKpis'
    this.totalSales = vehicle.sales || 0; 
    this.connectedVehicles = vehicle.connected || 0;
    this.softwareUpdates = vehicle.softwareUpdates || 0;
  }
}