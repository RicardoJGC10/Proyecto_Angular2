import { Component, OnInit } from '@angular/core';
import { ProductosInterface } from '../../../modelos/productos.interface';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../servicios/producto.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  productos: ProductosInterface[] = [];
  baseUrl = 'https://143.198.70.194/'; // Asegúrate de que sea la URL base correcta

  constructor(private productosService: ProductoService) { }

  ngOnInit(): void {
    this.getProductos();
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  }

  getProductos(): void {
    this.productosService.getCategorias().subscribe({
      next: (result) => {
        this.productos = result.map(producto => ({
          ...producto,
          image: this.baseUrl + producto.image
        }));
        console.log(this.productos); // Verifica las URLs de las imágenes
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }
}
