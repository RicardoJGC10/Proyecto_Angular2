import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BestsellingService {

  private apiUrl = 'https://seguridadenaplicaciones.site/api/best-selling-and-low-stock-products/';


  constructor(private http: HttpClient) { }

  getBestSellingProduct(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
