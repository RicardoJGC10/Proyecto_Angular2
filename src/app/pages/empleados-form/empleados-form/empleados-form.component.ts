import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EmpleadosInterface } from '../../../modelos/empleados.interface';
import { EmpleadoService } from '../../../layout/servicios/empleado.service';

@Component({
  selector: 'app-empleados-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
      if (a.employee_id && b.employee_id) {
        const idA = +a.employee_id;
        const idB = +b.employee_id;
        return idA - idB;
      }
      return 0; // Manejar el caso donde a.employee_id o b.employee_id es undefined
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
      console.log('Employee ID for update:', this.data ? this.data.employee_id : 'No ID');
  
      if (this.data && this.data.employee_id) {
        console.log('Updating existing employee');
        this.empleadoService
          .updateCategoria(this.data.employee_id, empleadoData)
          .subscribe({
            next: (response) => {
              // Verificamos si la respuesta tiene un campo 'data'
              const updatedEmpleado = response.data ? response.data : (response as unknown as EmpleadosInterface);
  
              if (updatedEmpleado && updatedEmpleado.employee_id) {
                const index = this.registros.findIndex(
                  (r) => r.employee_id === this.data!.employee_id
                );
                if (index !== -1) {
                  this.registros[index] = updatedEmpleado;
                  this.ordenarRegistros(); // Ordenar por id después de actualizar
                }
                this.toastrService.success('Employee updated successfully');
                this.empleadoForm.reset();
                this.onClose();
              } else {
                console.error('Error: La respuesta del servidor no contiene datos válidos.');
                this.toastrService.error('Error actualizando empleado: respuesta vacía o inválida');
              }
            },
            error: (err) => {
              console.error('Error updating employee:', err);
              this.toastrService.error('Error updating employee');
            },
          });
      } else {
        console.log('Creating new employee');
        this.empleadoService.createCategoria(empleadoData).subscribe({
          next: (response) => {
            // Verificamos si la respuesta tiene un campo 'data'
            const newEmpleado = response.data ? response.data : (response as unknown as EmpleadosInterface);
  
            if (newEmpleado && newEmpleado.employee_id) {
              this.registros.push(newEmpleado);
              this.ordenarRegistros(); // Ordenar por id después de crear
              this.toastrService.success('Employee created successfully');
              this.empleadoForm.reset();
              this.onClose();
            } else {
              console.error('Error: La respuesta del servidor no contiene datos válidos.');
              this.toastrService.error('Error creando empleado: respuesta vacía o inválida');
            }
          },
          error: (err) => {
            console.error('Error creating employee:', err);
            this.toastrService.error('Error creating employee');
          },
        });
      }
    } else {
      this.toastrService.warning('Please complete all required fields correctly');
      this.empleadoForm.markAllAsTouched();
    }
  }
  

  

  
}
