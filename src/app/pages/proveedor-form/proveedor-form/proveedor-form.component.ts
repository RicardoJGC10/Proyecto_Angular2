import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProveedoresInterface } from '../../../modelos/proveedores.interface';
import { ProveedorService } from '../../../layout/servicios/proveedor.service';

@Component({
  selector: 'app-proveedor-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './proveedor-form.component.html',
  styleUrl: './proveedor-form.component.css'
})
export class ProveedorFormComponent implements OnChanges {

  registros: ProveedoresInterface[] = [];
  registrosOriginales: ProveedoresInterface[] = []; // Guardar el orden original de los registros

  @Input() data: ProveedoresInterface | null = null;
  @Output() onCloseModel = new EventEmitter();
  proveedorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    private toastrService: ToastrService
  ) {
    this.proveedorForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      name_contact: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      cp: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),

    });
    this.cargarRegistros();
  }

  ngOnChanges(): void {
    if (this.data) {
      this.proveedorForm.patchValue({
        name: this.data.name,
        name_contact: this.data.name_contact,
        email: this.data.email,
        address: this.data.address,
        country: this.data.country,
        cp: this.data.cp,
        phone: this.data.phone,

      });
    }
  }

  cargarRegistros() {
    this.proveedorService.getProveedores().subscribe(
      (data:ProveedoresInterface[]) => {
        this.registros = data;
        this.registrosOriginales = [...data]; // Guardar el orden original
        this.ordenarRegistros(); // Ordenar por id al cargar los registros
      },
      (error) => {
        console.error('Error al cargar registros:', error);
      }
    );
  }

  ordenarRegistros() {
    this.registros.sort((a, b) => {
      // Verificar si a.id_categorie y b.id_categorie están definidos
      if (a.id_supplier && b.id_supplier) {
        // Convertir a.id_categorie y b.id_categorie a números para la comparación
        const idA = +a.id_supplier; // O parseInt(a.id_categorie, 10) si es necesario
        const idB = +b.id_supplier; // O parseInt(b.id_categorie, 10) si es necesario
        if (idA < idB) return -1;
        if (idA > idB) return 1;
        return 0;
      }
      return 0; // Manejar el caso donde a.id_categorie o b.id_categorie es undefined
    });
  }
  

  onClose() {
    this.onCloseModel.emit(false);
  }

  onSubmit() {
  if (this.proveedorForm.valid) {
    const proveedorData = this.proveedorForm.value;

    console.log('Form data:', proveedorData);
    console.log('Current data:', this.data);
    console.log('Category ID for update:', this.data ? this.data.id_supplier : 'No ID');

    if (this.data && this.data.id_supplier) {
      console.log('Updating existing category');
      // Actualización de categoría existente
      this.proveedorService.updateCategoria(this.data.id_supplier, proveedorData)
  .subscribe({
    next: (response: any) => {
      console.log('Respuesta completa del servidor:', response);

      const updatedProveedor = response.data ? response.data : response;

      if (updatedProveedor && updatedProveedor.id_supplier) {
        const index = this.registros.findIndex(
          (r) => r.id_supplier === updatedProveedor.id_supplier
        );
        if (index !== -1) {
          this.registros[index] = updatedProveedor;
          this.ordenarRegistros();
        } else {
          console.error('Proveedor no encontrado en la lista.');
        }
        this.toastrService.success('Proveedor actualizado exitosamente');
        this.proveedorForm.reset();
        this.onClose();
      } else {
        console.error('Error: La respuesta del servidor no contiene datos válidos.');
        this.toastrService.error('Error al actualizar el proveedor.');
      }
    },
    error: (err) => {
      console.error('Error actualizando proveedor:', err);
      this.toastrService.error('Error al actualizar el proveedor');
    }
  });

    } else {
      console.log('Creating new category');
      // Creación de nueva categoría
      this.proveedorService.createCategoria(proveedorData).subscribe({
        next: (response) => {
          const newproveedor = response.data;
          this.registros.push(newproveedor);
          this.ordenarRegistros(); // Ordenar por id después de crear
          this.toastrService.success('Categoría creada exitosamente');
          this.proveedorForm.reset();
          this.onClose();
        },
        error: (err) => {
          console.error('Error creating category:', err);
          this.toastrService.error('Error al crear categoría');
        },
      });
    }
  } else {
    this.toastrService.warning('Por favor complete todos los campos correctamente');
    this.proveedorForm.markAllAsTouched();
  }
}


}
