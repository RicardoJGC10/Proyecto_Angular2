import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EmpleadosInterface } from '../../modelos/empleados.interface';

interface ApiResponse<T> {
  data: T;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private API_URL = 'https://seguridadenaplicaciones.site/api/employees/';

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<EmpleadosInterface[]> {
    return this.http.get<EmpleadosInterface[]>(this.API_URL)
      .pipe(
        catchError(this.handleError)
      );
  }

  createCategoria(empleado: EmpleadosInterface): Observable<ApiResponse<EmpleadosInterface>> {
    return this.http.post<ApiResponse<EmpleadosInterface>>(this.API_URL, empleado)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteCategoria(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.API_URL}${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateCategoria(id: string, empleado: EmpleadosInterface): Observable<ApiResponse<EmpleadosInterface>> {
    return this.http.put<ApiResponse<EmpleadosInterface>>(`${this.API_URL}${id}/`, empleado)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      switch (error.status) {
        case 400:
          errorMessage = 'Bad Request: The server could not understand the request due to invalid syntax.';
          break;
        case 401:
          errorMessage = 'Unauthorized: Access is denied due to invalid credentials.';
          break;
        case 404:
          errorMessage = 'Not Found: The requested resource could not be found.';
          break;
        case 500:
          errorMessage = 'Internal Server Error: The server encountered an error and could not complete your request.';
          break;
        default:
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
