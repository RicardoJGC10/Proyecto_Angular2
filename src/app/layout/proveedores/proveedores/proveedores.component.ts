import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar/sidebar.component';
import { HeaderComponent } from '../../header/header/header.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FooterComponent } from '../../footer/footer/footer.component';
import { ProveedoresInterface } from '../../../modelos/proveedores.interface';
import { ToastrService } from 'ngx-toastr';
import { ModelComponent } from '../../../shared/ui/model/model/model/model.component';
import { ProveedorService } from '../../servicios/proveedor.service';
import { ProveedorFormComponent } from '../../../pages/proveedor-form/proveedor-form/proveedor-form.component';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [SidebarComponent,HeaderComponent,RouterOutlet,CommonModule,FormsModule,NgxPaginationModule,FooterComponent,ModelComponent,ProveedorFormComponent],
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.css'
})
export class ProveedoresComponent implements OnInit {


  
  proveedoresList: ProveedoresInterface[] = [];
  proveedoresLis: ProveedoresInterface | null = null;

  filteredCategories: ProveedoresInterface[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  isModelOpen = false;


  constructor(private proveedoresService: ProveedorService,private toastService: ToastrService) {}




  ngOnInit(): void {
    this.getCategorias();
  }

  getCategorias(): void {
    this.proveedoresService.getProveedores().subscribe({
      next: (result) => {
        this.proveedoresList = result;
        this.filteredCategories = result;  // Inicializa filteredCategories
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  filterCategories(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredCategories = this.proveedoresList.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.name_contact.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.address.toLowerCase().includes(query) ||
      item.country.toLowerCase().includes(query) ||
      item.cp.toLowerCase().includes(query) ||
      item.phone.toLowerCase().includes(query) 
    );
    this.currentPage = 1;
  }

  trackById(index: number, item: ProveedoresInterface): string {
    return item.id_supplier ?? '';
  }
  

  onDelete(id: string) {
    this.proveedoresService.deleteCategoria(id).subscribe({
      next: (result) => {
        if (result && result.message) {
          this.toastService.success(result.message);
        } else {
          this.toastService.warning('Eliminado con éxito');
        }
        this.getCategorias();
      },
      error: (err) => {
        console.error('Error al eliminar la categoría:', err);
        this.toastService.error('Error al eliminar la categoría');
      }
    });
  }
  onEdit(data: ProveedoresInterface): void {
    this.proveedoresLis = { ...data }; // Copia los datos para evitar la referencia directa
    this.openModel();
  }
  
  
  openModel(): void {
    if (!this.proveedoresLis) {
      this.proveedoresLis = {
        id_supplier: '',
        name: '',
        name_contact: '',
        email: '',
        address: '',
        country: '',
        cp: '',
        phone: ''
      };
    }
    this.isModelOpen = true;
  }
  
  
  closeModel(): void{
    this.isModelOpen = false;
    this.getCategorias();
    this.proveedoresLis = null; // Limpia los datos de categoría editada

  }





}
