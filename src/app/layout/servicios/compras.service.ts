import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComprasInterface } from '../../modelos/compras.interface';
import { DetalleComprasInterface } from '../../modelos/detallecompras.interface';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  API_URL: string = 'https://143.198.70.194/purchases/';


  constructor(private httpClient: HttpClient) { }

  getCompras(): Observable<ComprasInterface[]> {
    return this.httpClient.get<ComprasInterface[]>(this.API_URL);
  }
  getDetalleCompras(): Observable<DetalleComprasInterface[]> {
    return this.httpClient.get<DetalleComprasInterface[]>(this.API_URL);
  }
  getDetalleCompraById(id: string): Observable<DetalleComprasInterface> {
    return this.httpClient.get<DetalleComprasInterface>(`${this.API_URL}${id}`);
  }
}
