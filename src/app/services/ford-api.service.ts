import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FordApiService {
  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) { }

  getVehicles(): Observable<any[]> {
    return this.http.get<{ vehicles: any[] }>(`${this.apiUrl}/vehicles`)
      .pipe(
        map(response => response.vehicles)
      );
  }

  getVehicleData(vin: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/vehicleData`, { vin });
  }
  
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }
}
