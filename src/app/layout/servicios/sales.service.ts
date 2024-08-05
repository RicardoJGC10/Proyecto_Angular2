import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private apiUrl = 'https://143.198.70.194/api/total_sales_today/'; // URL de la API


  constructor(private http: HttpClient) { }

  getDailySales(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
