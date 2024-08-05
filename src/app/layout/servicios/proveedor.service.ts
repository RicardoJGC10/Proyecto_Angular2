import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ProveedoresInterface } from '../../modelos/proveedores.interface';

interface ApiResponse<T> {
  data: T;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private API_URL = 'http://143.198.70.194/api/proveedores/';


  constructor(private http: HttpClient) { }

  getProveedores(): Observable<ProveedoresInterface[]> {
    return this.http.get<ProveedoresInterface[]>(this.API_URL);
  }

  createCategoria(proveedores: ProveedoresInterface): Observable<ApiResponse<ProveedoresInterface>> {
    return this.http.post<ApiResponse<ProveedoresInterface>>(this.API_URL, proveedores);
  }

  deleteCategoria(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.API_URL}${id}`);
  }

  updateCategoria(id: string, proveedores: ProveedoresInterface): Observable<ApiResponse<ProveedoresInterface>> {
    return this.http.put<ApiResponse<ProveedoresInterface>>(`${this.API_URL}${id}/`, proveedores)
      .pipe(
        catchError(error => {
          console.error('Error updating category:', error);
          return throwError(error); // Reenviar el error
        })
      );
  }
}
