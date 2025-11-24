import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FordApiService } from '../services/ford-api.service';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  vehicles: any[] = [];
  selectedVehicle: any = null;

  totalSales: number = 0;
  connectedVehicles: number = 0;
  softwareUpdates: number = 0;
  vehicleImage: string = '';

  searchControl = new FormControl('');
  filteredVehicleData$!: Observable<any | null>;

  menuOpen = false; // ✅ Adicionado

  constructor(private apiService: FordApiService) {}

  ngOnInit() {
    this.apiService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
        if (data && data.length > 0) {
          this.selectedVehicle = data[0];
          this.updateKpis(this.selectedVehicle);
          this.vehicleImage = this.selectedVehicle.img;
        }
      },
      error: (error) => {
        console.error('Erro ao carregar veículos:', error);
      }
    });

    this.filteredVehicleData$ = this.searchControl.valueChanges.pipe(
      debounceTime(300), 
      distinctUntilChanged(),
      switchMap(vin => {
        if (!vin || vin.trim() === '') {
          return of(null);
        }
        return this.apiService.getVehicleData(vin.trim()).pipe(
          catchError(error => {
            console.error('Erro ao buscar dados do veículo:', error);
            return of(null);
          })
        );
      })
    );
  }

  onVehicleSelect(vehicle: any) {
    this.selectedVehicle = vehicle;
    this.updateKpis(vehicle);
    this.vehicleImage = vehicle.img;
  }

  updateKpis(vehicle: any) {
    this.totalSales = vehicle.volumetotal || 0;
    this.connectedVehicles = vehicle.connected || 0;
    this.softwareUpdates = vehicle.softwareUpdates || 0;
  }

  // ✅ Método para o menu
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
