import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductosInterface } from '../../../modelos/productos.interface';
import { CommonModule } from '@angular/common';
import { CategoriasInterface } from '../../../modelos/categorias.interface';
import { ProveedoresInterface } from '../../../modelos/proveedores.interface';
import { ProductoService } from '../../../layout/servicios/producto.service';
import { ApiService } from '../../../layout/servicios/servicios/api.service';
import { ProveedorService } from '../../../layout/servicios/proveedor.service';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css']
})
export class ProductoFormComponent implements OnChanges {
  @Input() data: ProductosInterface | null = null;
  @Output() onCloseModel = new EventEmitter();
  productoForm: FormGroup;
  currentImageUrl: string | null = null;
  currentImageName: string | null = null;
  categorias: CategoriasInterface[] = [];
  proveedores: ProveedoresInterface[] = [];

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private categoriaService: ApiService,
    private proveedorService: ProveedorService,
    private toastrService: ToastrService
  ) {
    this.productoForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      cost: ['', Validators.required],
      price: ['', Validators.required],
      available_quantity: ['', Validators.required],
      image: [null],
      category: ['', Validators.required],
      supplier: ['', Validators.required],
      image_name: [''] // Campo adicional para mantener el nombre de la imagen
    });
  }

  ngOnInit(): void {
    this.categoriaService.getCategorias().subscribe(categorias => {
      this.categorias = categorias;
    });

    this.proveedorService.getProveedores().subscribe(proveedores => {
      this.proveedores = proveedores;
    });
  }

  ngOnChanges(): void {
    if (this.data) {
      this.currentImageUrl = this.data.image ? `https://seguridadenaplicaciones.site${this.data.image}` : null;
      this.currentImageName = this.data.image ? this.data.image.split('/').pop() ?? null : null;

      this.productoForm.patchValue({
        name: this.data.name,
        description: this.data.description,
        cost: this.data.cost,
        price: this.data.price,
        available_quantity: this.data.available_quantity,
        category: this.data.category,
        supplier: this.data.supplier,
        image_name: this.currentImageName ? this.currentImageName : '' 
      });
    } else {
      this.productoForm.reset();
      this.resetFileInput();  // Resetear el campo de archivo
      this.currentImageUrl = null;
      this.currentImageName = null;
    }
  }

  onClose() {
    this.onCloseModel.emit(false);
  }

  onSubmit() {
    if (this.productoForm.valid) {
      const formData = new FormData();
      const formValue = this.productoForm.value;

      const category = parseInt(formValue.category, 10);
      const supplier = parseInt(formValue.supplier, 10);

      if (!isNaN(category) && !isNaN(supplier)) {
        formData.append('name', formValue.name);
        formData.append('description', formValue.description);
        formData.append('cost', formValue.cost);
        formData.append('price', formValue.price);
        formData.append('available_quantity', formValue.available_quantity);
        formData.append('category', category.toString());
        formData.append('supplier', supplier.toString());

        const imageFile = this.productoForm.get('image')?.value;
        if (imageFile instanceof File) {
          formData.append('image', imageFile, imageFile.name);
        } else if (formValue.image_name) {
          formData.append('image_name', formValue.image_name); 
        }

        if (this.data?.id_product) {
          this.productoService.updateCategoria(this.data.id_product, formData).subscribe({
            next: () => {
              this.toastrService.success('Producto actualizado exitosamente');
              this.resetFormAfterSubmit(); // Resetear el formulario después de la actualización
            },
            error: (err) => {
              console.error('Error updating product:', err);
              this.toastrService.error('No se pudo actualizar el producto');
            }
          });
        } else {
          this.productoService.createCategoria(formData).subscribe({
            next: () => {
              this.toastrService.success('Producto creado exitosamente');
              this.resetFormAfterSubmit(); // Resetear el formulario después de la creación
            },
            error: (err) => {
              console.error('Error creating product:', err);
              this.toastrService.error('No se pudo crear el producto');
            }
          });
        }
      } else {
        this.toastrService.error('Categoría o proveedor no válido');
      }
    } else {
      this.toastrService.warning('Por favor complete todos los campos correctamente');
      this.productoForm.markAllAsTouched();
    }
  }

  // Método para resetear el campo de archivo
  resetFileInput() {
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';  // Resetear el valor del input
    }
  }

  // Método para resetear el formulario y el campo de archivo después de la creación/edición
  resetFormAfterSubmit() {
    this.productoForm.reset();
    this.currentImageUrl = null;
    this.currentImageName = null;
    this.resetFileInput(); // Resetear el campo de archivo
    this.onClose();
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.productoForm.patchValue({
        image: file
      });
      this.currentImageUrl = URL.createObjectURL(file);
      this.currentImageName = file.name;
    }
  }

  onImageError() {
    this.currentImageUrl = null;
    this.currentImageName = null;
  }
}
