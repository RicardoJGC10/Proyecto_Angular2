import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private API_URL = 'https://jsonplaceholder.typicode.com/users';


  constructor(private http:HttpClient) { }

  
  getUsuarios():Observable<any>{
    return this.http.get<any>(this.API_URL);
  }

}
