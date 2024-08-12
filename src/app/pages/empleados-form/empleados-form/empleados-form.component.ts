import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EmpleadosInterface } from '../../../modelos/empleados.interface';
import { EmpleadoService } from '../../../layout/servicios/empleado.service';

@Component({
  selector: 'app-empleados-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './empleados-form.component.html',
  styleUrl: './empleados-form.component.css'
})
export class EmpleadosFormComponent implements OnChanges {

  registros: EmpleadosInterface[] = [];
  registrosOriginales: EmpleadosInterface[] = []; // Guardar el orden original de los registros

  @Input() data: EmpleadosInterface | null = null;
  @Output() onCloseModel = new EventEmitter();
  empleadoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private empleadoService: EmpleadoService,
    private toastrService: ToastrService
  ) {
    this.empleadoForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      department: new FormControl('', [Validators.required]),


    });
    this.cargarRegistros();
  }

  ngOnChanges(): void {
    if (this.data) {
      this.empleadoForm.patchValue({
        name: this.data.name,
        email: this.data.email,
        phone: this.data.phone,
        department: this.data.department,


      });
    }
  }

  cargarRegistros() {
    this.empleadoService.getCategorias().subscribe(
      (data: EmpleadosInterface[]) => {
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
      if (a.employee_id && b.employee_id) {
        // Convertir a.id_categorie y b.id_categorie a números para la comparación
        const idA = +a.employee_id; // O parseInt(a.id_categorie, 10) si es necesario
        const idB = +b.employee_id; // O parseInt(b.id_categorie, 10) si es necesario
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
  if (this.empleadoForm.valid) {
    const empleadoData = this.empleadoForm.value;

    console.log('Form data:', empleadoData);
    console.log('Current data:', this.data);
    console.log('Category ID for update:', this.data ? this.data.employee_id : 'No ID');

    if (this.data && this.data.employee_id) {
      console.log('Updating existing category');
      // Actualización de categoría existente
      this.empleadoService
        .updateCategoria(this.data.employee_id, empleadoData)
        .subscribe({
          next: (response) => {
            const updatedempleado = response.data;
            const index = this.registros.findIndex(
              (r) => r.employee_id === this.data!.employee_id
            );
            if (index !== -1) {
              this.registros[index] = updatedempleado;
              this.ordenarRegistros(); // Ordenar por id después de actualizar
            }
            this.toastrService.success('Category updated successfully');
            this.empleadoForm.reset();
            this.onClose();
          },
          error: (err) => {
            console.error('Error updating category:', err);
            this.toastrService.error('Error updating category');
          },
        });
    } else {
      console.log('Creating new category');
      // Creación de nueva categoría
      this.empleadoService.createCategoria(empleadoData).subscribe({
        next: (response) => {
          const newempleado = response.data;
          this.registros.push(newempleado);
          this.ordenarRegistros(); // Ordenar por id después de crear
          this.toastrService.success('Category created successfully');
          this.empleadoForm.reset();
          this.onClose();
        },
        error: (err) => {
          console.error('Error creating category:', err);
          this.toastrService.error('Error creating category');
        },
      });
    }
  } else {
    this.toastrService.warning('Por favor complete todos los campos correctamente');
    this.empleadoForm.markAllAsTouched();
  }
}


}
