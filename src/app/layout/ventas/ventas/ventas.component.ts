import { Component, OnInit } from '@angular/core';
import { VentasInterface } from '../../../modelos/ventas.interface';
import { EmpleadosInterface } from '../../../modelos/empleados.interface';
import { DetalleVentasInterface } from '../../../modelos/detalleventas.interface';
import { ProductosInterface } from '../../../modelos/productos.interface';
import { SidebarComponent } from '../../sidebar/sidebar/sidebar.component';
import { HeaderComponent } from '../../header/header/header.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FooterComponent } from '../../footer/footer/footer.component';
import { VentasService } from '../../servicios/ventas.service';
import { EmpleadoService } from '../../servicios/empleado.service';
import { ProductoService } from '../../servicios/producto.service';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, RouterOutlet, CommonModule, FormsModule, NgxPaginationModule, FooterComponent],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {

  ventasList: VentasInterface[] = [];
  ventasLis: VentasInterface | null = null;
  productos: ProductosInterface[] = [];
  detalleventasLis: DetalleVentasInterface[] = [];
  filteredVentas: VentasInterface[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  isModelOpen = false;
  empleados: EmpleadosInterface[] = [];

  // Mapa para almacenar los nombres de productos
  productosMap: Map<string, string> = new Map();


  constructor(private ventasService: VentasService,
              private empleadosService: EmpleadoService,
              private productosService: ProductoService) {}

  ngOnInit(): void {
    this.getVentas();
    this.getEmpleados();
    this.getProductos(); // Debe llamarse antes de obtener detalles de venta
    this.getDetalleVentas();
  }

  getVentas(): void {
    this.ventasService.getVentas().subscribe({
      next: (result) => {
        this.ventasList = result.map(item => ({
          ...item,
          date: item.date || '',
          customer: item.customer || '',
          total: item.total || '',
          employee: item.employee || ''
        }));
        this.filteredVentas = this.ventasList;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getDetalleVentas(): void {
    this.ventasService.getDetalleVentas().subscribe({
      next: (result) => {
        this.detalleventasLis = result;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  filterVentas(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredVentas = this.ventasList.filter((item: VentasInterface) => {
      const date = (item.date || '').toString().toLowerCase();
      const customer = (item.customer || '').toString().toLowerCase();
      const total = (item.total || '').toString().toLowerCase();
      const employee = (item.employee || '').toString().toLowerCase();
      return date.includes(query) || 
             customer.includes(query) ||
             total.includes(query) ||
             employee.includes(query);
    });
    this.currentPage = 1;
  }

  trackById(index: number, item: VentasInterface): string {
    return item.sale_id ?? '';
  }

  onEdit(venta: VentasInterface): void {
    if (venta.sale_id) {
      this.ventasService.getDetalleVentaById(venta.sale_id).subscribe({
        next: (result: any) => {
          if (result && result.details && Array.isArray(result.details)) {
            this.detalleventasLis = result.details;
            this.isModelOpen = true;
          } else {
            console.error('No se recibieron detalles para la venta:', venta.sale_id);
          }
        },
        error: (err) => {
          console.error('Error fetching sale details:', err);
        }
      });
    }
  }

  openModel(): void {
    this.detalleventasLis = [];
    this.isModelOpen = true;
  }

  getEmpleados(): void {
    this.empleadosService.getCategorias().subscribe({
      next: (result) => {
        this.empleados = result;
      },
      error: (err) => {
        console.error('Error fetching employees:', err);
      }
    });
  }

  getSupplierName(id: string): string {
    const supplier = this.empleados.find(sup => sup.employee_id === id);
    return supplier ? supplier.name : 'Unknown';
  }

  getProductos(): void {
    this.productosService.getCategorias().subscribe({
      next: (result) => {
        this.productos = result;
        // Usar id_product como clave y name como valor
        this.productosMap = new Map(result.map(product => [product.id_product ?? '', product.name]));
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }
  

  getProductName(productId: string): string {
    return this.productosMap.get(productId) || 'Unknown Product';
  }
  
}
