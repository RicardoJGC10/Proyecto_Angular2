import { Component } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar/sidebar.component';
import { HeaderComponent } from '../../header/header/header.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FooterComponent } from '../../footer/footer/footer.component';
import { ComprasInterface } from '../../../modelos/compras.interface';
import { ProductosInterface } from '../../../modelos/productos.interface';
import { DetalleComprasInterface } from '../../../modelos/detallecompras.interface';
import { ProveedoresInterface } from '../../../modelos/proveedores.interface';
import { ComprasService } from '../../servicios/compras.service';
import { ProveedorService } from '../../servicios/proveedor.service';
import { ProductoService } from '../../servicios/producto.service';


@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, RouterOutlet, CommonModule, FormsModule, NgxPaginationModule, FooterComponent],
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.css'
})
export class ComprasComponent {

  comprasList: ComprasInterface[] = [];
  comprasLis: ComprasInterface | null = null;
  productos: ProductosInterface[] = [];
  detallecomprasLis: DetalleComprasInterface[] = [];
  filteredVentas: ComprasInterface[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  isModelOpen = false;
  proveedores: ProveedoresInterface[] = [];

  // Mapa para almacenar los nombres de productos
  productosMap: Map<string, string> = new Map();


  constructor(private comprasService: ComprasService,
              private proveedoresService: ProveedorService,
              private productosService: ProductoService) {}

  ngOnInit(): void {
    this.getCompras();
    this.getProveedores();
    this.getProductos(); // Debe llamarse antes de obtener detalles de venta
    this.getDetalleCompras();
  }

  getCompras(): void {
    this.comprasService.getCompras().subscribe({
      next: (result) => {
        this.comprasList = result.map(item => ({
          ...item,
          date: item.date || '',
          supplier: item.supplier || '',
          total: item.total || ''
        }));
        this.filteredVentas = this.comprasList;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getDetalleCompras(): void {
    this.comprasService.getDetalleCompras().subscribe({
      next: (result) => {
        this.detallecomprasLis = result;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  filterVentas(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredVentas = this.comprasList.filter((item: ComprasInterface) => {
      const date = (item.date || '').toString().toLowerCase();
      const customer = (item.supplier || '').toString().toLowerCase();
      const total = (item.total || '').toString().toLowerCase();
      return date.includes(query) || 
             customer.includes(query) ||
             total.includes(query);
    });
    this.currentPage = 1;
  }

  trackById(index: number, item: ComprasInterface): string {
    return item.purchase_id ?? '';
  }

  onEdit(compra: ComprasInterface): void {
    if (compra.purchase_id) {
      this.comprasService.getDetalleCompraById(compra.purchase_id).subscribe({
        next: (result: any) => {
          if (result && result.details && Array.isArray(result.details)) {
            this.detallecomprasLis = result.details;
            this.isModelOpen = true;
          } else {
            console.error('No se recibieron detalles para la venta:', compra.purchase_id);
          }
        },
        error: (err) => {
          console.error('Error fetching sale details:', err);
        }
      });
    }
  }

  openModel(): void {
    this.detallecomprasLis = [];
    this.isModelOpen = true;
  }

  getProveedores(): void {
    this.proveedoresService.getProveedores().subscribe({
      next: (result) => {
        this.proveedores = result;
      },
      error: (err) => {
        console.error('Error fetching employees:', err);
      }
    });
  }

  getSupplierName(id: string): string {
    const supplier = this.proveedores.find(sup => sup.id_supplier === id);
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
