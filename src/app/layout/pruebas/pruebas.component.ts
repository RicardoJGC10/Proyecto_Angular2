import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar/sidebar.component';

@Component({
  selector: 'app-pruebas',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './pruebas.component.html',
  styleUrl: './pruebas.component.css'
})
export class PruebasComponent {
  toggleSidebar(event: Event): void {
    event.preventDefault(); // Prevenir el comportamiento por defecto
    // Lógica para colapsar/expandir el sidebar
    const sidebar = document.querySelector('.app-sidebar');
    if (sidebar) {
      sidebar.classList.toggle('collapsed');
    }
  }

}
