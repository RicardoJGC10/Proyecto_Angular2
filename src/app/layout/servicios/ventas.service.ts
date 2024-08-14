import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VentasInterface } from '../../modelos/ventas.interface';
import { DetalleVentasInterface } from '../../modelos/detalleventas.interface';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  API_URL: string = 'https://seguridadenaplicaciones.site/api/ventas/';
  
  constructor(private httpClient: HttpClient) { }

  getVentas(): Observable<VentasInterface[]> {
    return this.httpClient.get<VentasInterface[]>(this.API_URL);
  }
  getDetalleVentas(): Observable<DetalleVentasInterface[]> {
    return this.httpClient.get<DetalleVentasInterface[]>(this.API_URL);
  }
  getDetalleVentaById(id: string): Observable<DetalleVentasInterface> {
    return this.httpClient.get<DetalleVentasInterface>(`${this.API_URL}${id}`);
  }
}
