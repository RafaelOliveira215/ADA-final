import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MeatOption {
  id?: number;
  label: string;
  value: string;
  pricePerKg: number;
}

export interface DrinkOption {
  id?: number;
  label: string;
  value: string;
  pricePerUnit: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChurrascoService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getMeats(): Observable<MeatOption[]> {
    return this.http.get<MeatOption[]>(`${this.apiUrl}/meats`);
  }

  getDrinks(): Observable<DrinkOption[]> {
    return this.http.get<DrinkOption[]>(`${this.apiUrl}/drinks`);
  }

  getMeatById(id: number): Observable<MeatOption> {
    return this.http.get<MeatOption>(`${this.apiUrl}/meats/${id}`);
  }

  getDrinkById(id: number): Observable<DrinkOption> {
    return this.http.get<DrinkOption>(`${this.apiUrl}/drinks/${id}`);
  }

  createMeat(meat: MeatOption): Observable<MeatOption> {
    return this.http.post<MeatOption>(`${this.apiUrl}/meats`, meat);
  }

  createDrink(drink: DrinkOption): Observable<DrinkOption> {
    return this.http.post<DrinkOption>(`${this.apiUrl}/drinks`, drink);
  }

  updateMeat(id: number, meat: MeatOption): Observable<MeatOption> {
    return this.http.put<MeatOption>(`${this.apiUrl}/meats/${id}`, meat);
  }

  updateDrink(id: number, drink: DrinkOption): Observable<DrinkOption> {
    return this.http.put<DrinkOption>(`${this.apiUrl}/drinks/${id}`, drink);
  }

  deleteMeat(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/meats/${id}`);
  }

  deleteDrink(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/drinks/${id}`);
  }
}
