import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CategoriasInterface } from '../../../modelos/categorias.interface';
import { ApiService } from '../../../layout/servicios/servicios/api.service';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './categoria-form.component.html',
  styleUrl: './categoria-form.component.css'
})
export class CategoriaFormComponent implements OnChanges {
  @Input() data: CategoriasInterface | null = null;
  @Output() onCloseModel = new EventEmitter();
  categoriaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private categoriaService:ApiService,
    private toastrService: ToastrService){
    this.categoriaForm = this.fb.group({
      name: new FormControl('',[Validators.required]),
      description: new FormControl('',[Validators.required]),
      
    });
  }
  ngOnChanges(): void {
    if (this.data){
      this.categoriaForm.patchValue({
        name: this.data?.name,
        description: this.data?.description,
      });
    }
    
  }

  onClose(){
    this.onCloseModel.emit(false);
  }
  onSubmit() {
    if (this.categoriaForm.valid) {
      const categoriaData = this.categoriaForm.value;
      console.log('Category Data:', categoriaData);
  
      if (this.data && this.data.id_categorie) {
        console.log('Updating category with ID:', this.data.id_categorie);
  
        this.categoriaService.updateCategoria(this.data.id_categorie as string, categoriaData)
          .subscribe({
            next: (response) => {
              this.toastrService.success('Categoría actualizada exitosamente');

              this.categoriaForm.reset(); // Reiniciar el formulario después de crear
              this.onClose();
            },
            error: (err) => {
              console.error('Error updating category:', err);
              this.toastrService.error('Error al actualizar la categoría');
            }
          });
      } else {
        console.log('Creating new category');
  
        this.categoriaService.createCategoria(categoriaData).subscribe({
          next: (response) => {
            this.toastrService.success('Categoría creada exitosamente');
            this.categoriaForm.reset(); // Reiniciar el formulario después de crear
            this.onClose();
          },
          error: (err) => {
            console.error('Error creating category:', err);
            this.toastrService.error('Error al crear categoría');
          }
        });
      }
    } else {
      this.toastrService.warning('Por favor complete todos los campos correctamente');
      this.categoriaForm.markAllAsTouched();
    }
  }
  
  
  

 
 
 
  
}
