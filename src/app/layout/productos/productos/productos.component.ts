import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar/sidebar.component';
import { HeaderComponent } from '../../header/header/header.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FooterComponent } from '../../footer/footer/footer.component';
import { ProductosInterface } from '../../../modelos/productos.interface';
import { ToastrService } from 'ngx-toastr';
import { CategoriasInterface } from '../../../modelos/categorias.interface';
import { ProveedoresInterface } from '../../../modelos/proveedores.interface';
import { ProductoService } from '../../servicios/producto.service';
import { ApiService } from '../../servicios/servicios/api.service';
import { ProveedorService } from '../../servicios/proveedor.service';
import { ModelComponent } from '../../../shared/ui/model/model/model/model.component';
import { ProductoFormComponent } from '../../../pages/producto-form/producto-form/producto-form.component';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    SidebarComponent, 
    HeaderComponent, 
    RouterOutlet, 
    CommonModule, 
    FormsModule, 
    NgxPaginationModule, 
    FooterComponent, 
    ModelComponent, 
    ProductoFormComponent
  ],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productosList: ProductosInterface[] = [];
  productosLis: ProductosInterface | null = null;
  filteredCategories: ProductosInterface[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  isModelOpen = false;

  categorias: CategoriasInterface[] = [];
  proveedores: ProveedoresInterface[] = [];

  constructor(
    private productosService: ProductoService, 
    private toastService: ToastrService,
    private categoriaService: ApiService, // Inyecta el servicio de categorías
    private proveedorService: ProveedorService // Inyecta el servicio de proveedores
  ) {}

  ngOnInit(): void {
    this.getCategorias();
    this.getCategoriasAndProveedores(); // Obtén las categorías y proveedores
  }

  getCategorias(): void {
    this.productosService.getCategorias().subscribe({
      next: (result) => {
        this.productosList = result.map(item => {
          // Asegurarse de que item.image no tenga una barra inicial
          if (typeof item.image === 'string' && item.image.startsWith('/')) {
            item.image = item.image.slice(1);
          }
          return item;
        });
        this.filteredCategories = this.productosList;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getCategoriasAndProveedores(): void {
    // Obtener categorías
    this.categoriaService.getCategorias().subscribe({
      next: (result) => {
        this.categorias = result;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    });

    // Obtener proveedores
    this.proveedorService.getProveedores().subscribe({
      next: (result) => {
        this.proveedores = result;
      },
      error: (err) => {
        console.error('Error fetching suppliers:', err);
      }
    });
  }

  filterCategories(): void {
    const query = this.searchQuery.toLowerCase();
  
    this.filteredCategories = this.productosList.filter(item => {
      // Asegúrate de que cada valor sea una cadena
      const name = String(item.name || '').toLowerCase();
      const description = String(item.description || '').toLowerCase();
      const cost = String(item.cost || '').toLowerCase();
      const price = String(item.price || '').toLowerCase();
      const availableQuantity = String(item.available_quantity || '').toLowerCase();
      const image = String(item.image || '').toLowerCase();
      const category = String(item.category || '').toLowerCase();
      const supplier = String(item.supplier || '').toLowerCase();
  
      return name.includes(query) ||
             description.includes(query) ||
             cost.includes(query) ||
             price.includes(query) ||
             availableQuantity.includes(query) ||
             image.includes(query) ||
             category.includes(query) ||
             supplier.includes(query);
    });
  
    this.currentPage = 1;
  }
  

  getImageUrl(imagePath: string): string {
    // Elimina cualquier barra inicial del path de la imagen, si existe
    const cleanedPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    const url = `https://seguridadenaplicaciones.site/${cleanedPath}`;
    return url;
  }

  trackById(index: number, item: ProductosInterface): string {
    return item.id_product ?? '';
  }

  onDelete(id: string): void {
    this.productosService.deleteCategoria(id).subscribe({
      next: (result) => {
        if (result && result.message) {
          this.toastService.success(result.message);
        } else {
          this.toastService.warning('Eliminado con éxito');
        }
        this.getCategorias();
      },
      error: (err) => {
        console.error('Error deleting product:', err);
        this.toastService.error('Error al eliminar el producto');
      }
    });
  }

  onEdit(data: ProductosInterface): void {
    this.productosLis = { ...data };
    this.openModel();
  }

  openModel(): void {
    this.isModelOpen = true;
  }

  closeModel(): void {
    this.isModelOpen = false;
    this.getCategorias();
    this.productosLis = null;
  }

  // Métodos para obtener los nombres de categorías y proveedores
  getCategoryName(id: string): string {
    const category = this.categorias.find(cat => cat.id_categorie === id);
    return category ? category.name : 'Unknown';
  }

  getSupplierName(id: string): string {
    const supplier = this.proveedores.find(sup => sup.id_supplier === id);
    return supplier ? supplier.name : 'Unknown';
  }
}
