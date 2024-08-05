import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar/sidebar.component';
import { HeaderComponent } from '../../header/header/header.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { NgxPaginationModule } from 'ngx-pagination';
import { CategoriasInterface } from '../../../modelos/categorias.interface';
import { FooterComponent } from '../../footer/footer/footer.component';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../servicios/servicios/api.service';
import { ModelComponent } from '../../../shared/ui/model/model/model/model.component';
import { CategoriaFormComponent } from '../../../pages/categoria-form/categoria-form/categoria-form.component';


@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, RouterOutlet, CommonModule, FormsModule,NgxPaginationModule,FooterComponent,ModelComponent,CategoriaFormComponent],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {

  categoriasList: CategoriasInterface[] = [];
  categoriasLis: CategoriasInterface | null = null;

  filteredCategories: CategoriasInterface[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  isModelOpen = false;


  constructor(private categoriasService: ApiService,private toastService: ToastrService) {}




  ngOnInit(): void {
    this.getCategorias();
  }

  getCategorias(): void {
    this.categoriasService.getCategorias().subscribe({
      next: (result) => {
        this.categoriasList = result;
        this.filteredCategories = result;  // Inicializa filteredCategories
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  filterCategories(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredCategories = this.categoriasList.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query)
    );
    this.currentPage = 1;
  }

  trackById(index: number, item: CategoriasInterface): string {
    return item.id_categorie ?? '';
  }
  

  onDelete(id: string) {
    this.categoriasService.deleteCategoria(id).subscribe({
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
  onEdit(data: CategoriasInterface): void {
    this.categoriasLis = { ...data }; // Copia los datos para evitar la referencia directa
    this.openModel();
  }
  
  
  openModel(): void {
    if (!this.categoriasLis) {
      this.categoriasLis = {
        id_categorie: '',
        name: '',
        description: ''
      };
    }
    this.isModelOpen = true;
  }
  
  
  closeModel(): void{
    this.isModelOpen = false;
    this.getCategorias();
    this.categoriasLis = null; // Limpia los datos de categoría editada

  }
  
  
}
