import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse, ProductosInterface } from '../../modelos/productos.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private API_URL = 'https://143.198.70.194/api/productos/';

  constructor(private http: HttpClient) {}

  

  getCategorias(): Observable<ProductosInterface[]> {
    return this.http.get<ProductosInterface[]>(this.API_URL).pipe(
      catchError(this.handleError)
    );
  }

  createCategoria(producto: FormData): Observable<ApiResponse<ProductosInterface>> {
    return this.http.post<ApiResponse<ProductosInterface>>(this.API_URL, producto).pipe(
      catchError(this.handleError)
    );
  }

  deleteCategoria(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.API_URL}${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateCategoria(id: string, producto: FormData): Observable<ApiResponse<ProductosInterface>> {
    return this.http.put<ApiResponse<ProductosInterface>>(`${this.API_URL}${id}/`, producto).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(error);
  }
}
