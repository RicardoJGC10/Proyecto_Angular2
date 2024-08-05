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
      image: [null, Validators.required],
      category: ['', Validators.required],
      supplier: ['', Validators.required],
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
      this.currentImageUrl = this.data.image ? `http://143.198.70.194/${this.data.image}` : null;
      this.productoForm.patchValue({
        name: this.data.name,
        description: this.data.description,
        cost: this.data.cost,
        price: this.data.price,
        available_quantity: this.data.available_quantity,
        category: this.data.category,
        supplier: this.data.supplier,
      });

      // Clear image validation if updating an existing product
      if (this.data.id_product) {
        this.productoForm.get('image')?.clearValidators();
        this.productoForm.get('image')?.updateValueAndValidity();
      } else {
        // Set image as required for creating a new product
        this.productoForm.get('image')?.setValidators([Validators.required]);
        this.productoForm.get('image')?.updateValueAndValidity();
      }
    } else {
      // Clean form when there's no data
      this.productoForm.reset();
      this.currentImageUrl = null;
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

      // Check if category and supplier are valid
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
        } else if (!this.data?.id_product) {
          // For POST, ensure image is provided
          this.toastrService.error('Image is required for new products');
          return;
        }

        if (this.data?.id_product) {
          this.productoService.updateCategoria(this.data.id_product, formData).subscribe({
            next: () => {
              this.toastrService.success('Producto actualizado exitosamente');
              this.productoForm.reset();
              this.currentImageUrl = null;
              this.onClose();
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
              this.productoForm.reset();
              this.currentImageUrl = null;
              this.onClose();
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
      this.toastrService.error('Por favor complete todos los campos correctamente');
      this.productoForm.markAllAsTouched();
    }
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.productoForm.patchValue({
        image: file
      });
      this.currentImageUrl = null;
    }
  }

  onImageError() {
    this.currentImageUrl = null;
  }
}
