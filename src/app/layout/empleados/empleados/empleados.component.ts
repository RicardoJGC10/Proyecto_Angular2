import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar/sidebar.component';
import { HeaderComponent } from '../../header/header/header.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FooterComponent } from '../../footer/footer/footer.component';
import { EmpleadosInterface } from '../../../modelos/empleados.interface';
import { ToastrService } from 'ngx-toastr';
import { ModelComponent } from '../../../shared/ui/model/model/model/model.component';
import { EmpleadoService } from '../../servicios/empleado.service';
import { EmpleadosFormComponent } from '../../../pages/empleados-form/empleados-form/empleados-form.component';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [SidebarComponent,HeaderComponent,RouterOutlet,CommonModule,FormsModule,NgxPaginationModule,FooterComponent,ModelComponent,EmpleadosFormComponent],
  templateUrl: './empleados.component.html',
  styleUrl: './empleados.component.css'
})
export class EmpleadosComponent implements OnInit {
  empleadosList: EmpleadosInterface[] = [];
  empleadosLis: EmpleadosInterface | null = null;

  filteredCategories: EmpleadosInterface[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  isModelOpen = false;

  constructor(private empleadosService: EmpleadoService,private toastService: ToastrService) {}

  ngOnInit(): void {
    this.getCategorias();
  }

  getCategorias(): void {
    this.empleadosService.getCategorias().subscribe({
      next: (result) => {
        this.empleadosList = result;
        this.filteredCategories = result;  // Inicializa filteredCategories
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  filterCategories(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredCategories = this.empleadosList.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.email.toLowerCase().includes(query) ||
      item.phone.toLowerCase().includes(query) ||
      item.department.toLowerCase().includes(query)


    );
    this.currentPage = 1;
  }

  trackById(index: number, item: EmpleadosInterface): string {
    return item.employee_id ?? '';
  }
  

  onDelete(id: string) {
    this.empleadosService.deleteCategoria(id).subscribe({
      next: (result) => {
        if (result && result.message) {
          this.toastService.success(result.message);
        } else {
          this.toastService.warning('Removed successfully');
        }
        this.getCategorias();
      },
      error: (err) => {
        console.error('Error al eliminar la categoría:', err);
        this.toastService.error('Error al eliminar la categoría');
      }
    });
  }
  onEdit(data: EmpleadosInterface): void {
    this.empleadosLis = { ...data }; // Copia los datos para evitar la referencia directa
    this.openModel();
  }
  
  
  openModel(): void {
    if (!this.empleadosLis) {
      this.empleadosLis = {
        employee_id: '',
        name: '',
        email: '',
        phone: '',
        department: ''
      };
    }
    this.isModelOpen = true;
  }
  
  
  closeModel(): void{
    this.isModelOpen = false;
    this.getCategorias();
    this.empleadosLis = null; // Limpia los datos de categoría editada

  }
  


}
