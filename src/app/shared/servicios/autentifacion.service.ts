import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutentifacionService {

  private ingresar:boolean = false;

  constructor() { }

  usuariosValidos = [
    { name: 'Leanne Graham', username: 'Bret' },
    { name: 'Ervin Howell', username: 'Antonette' },
    { name: 'Clementine Bauch', username: 'Samantha' },
    { name: 'Patricia Lebsack', username: 'Karianne' },
    { name: 'Chelsey Dietrich', username: 'Kamren' },
    { name: 'Mrs. Dennis Schulist', username: 'Leopoldo_Corkery' },
    { name: 'Kurtis Weissnat', username: 'Elwyn.Skiles' },
    { name: 'Nicholas Runolfsdottir V', username: 'Maxime_Nienow' },
    { name: 'Glenna Reichert', username: 'Delphine' },
    { name: 'Clementina DuBuque', username: 'Moriah.Stanton' },








  ];

  public ingresarAplicativo(obj:any):boolean{
    this.ingresar = this.usuariosValidos.some(usuario =>
      usuario.name === obj.name && usuario.username === obj.username
    );
    return this.ingresar;
  }
  public habilitarlogeo(){
    return this.ingresar;
  }
}
