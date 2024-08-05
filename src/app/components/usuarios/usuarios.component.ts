import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { Location } from '@angular/common';




@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {

  usuariosList: any[] = [];

  constructor(private usuariosService:UsuariosService,private location: Location){}
  ngOnInit(): void {
    console.log('ngOnInit se está ejecutando');
    this.usuariosService.getUsuarios().subscribe(
      (data) => {
        console.log('Datos obtenidos:', data);
        this.usuariosList = data;
      },
      (error) => {
        console.error('Error al obtener los datos', error);
      }

    );
  }
  goBack() {
    this.location.back();
  }
}
