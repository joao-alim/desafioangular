import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { FordApiService } from '../services/ford-api.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule], 
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
  filteredVehicleData$!: Observable<any[]>; 

  constructor(private apiService: FordApiService) {}

  ngOnInit() {
    this.apiService.getVehicles().subscribe(data => {
      this.vehicles = data;
      if (data && data.length > 0) {
        this.selectedVehicle = data[0];
        this.updateKpis(this.selectedVehicle);
        this.vehicleImage = this.selectedVehicle.image;
      }
    });

    this.filteredVehicleData$ = this.searchControl.valueChanges.pipe(
      debounceTime(300), 
      distinctUntilChanged(), 
      switchMap(searchTerm => this.apiService.getVehicleData(searchTerm || ''))
    );
    
  }

  onVehicleSelect(vehicle: any) {
    this.selectedVehicle = vehicle;
    this.updateKpis(vehicle);
    this.vehicleImage = vehicle.image;
  }

  updateKpis(vehicle: any) {
    this.totalSales = vehicle.sales || 0; 
    this.connectedVehicles = vehicle.connected || 0;
    this.softwareUpdates = vehicle.softwareUpdates || 0;
  }
}