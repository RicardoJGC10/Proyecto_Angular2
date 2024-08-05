import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router'; // Importa Router y RouterModule
import { AuthService } from '../../../auth-service.service';
import { CommonModule } from '@angular/common';

// Define una interfaz para los elementos del menú
interface MenuItem {
  label: string;
  link: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule], // Asegúrate de importar RouterModule
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  // Lista de elementos del menú
  menuItems: MenuItem[] = [
    { label: 'Inicio', link: '/home', icon: '/assets/img/home.png' },
    { label: 'Ventas', link: '/ventas', icon: '/assets/img/price.png' },
    { label: 'Compras', link: '/compras', icon: '/assets/img/bag.png' },
    { label: 'Empleados', link: '/empleados', icon: '/assets/img/employees.png' },
    { label: 'Productos', link: '/productos', icon: '/assets/img/products.png' },
    { label: 'Proveedores', link: '/proveedores', icon: '/assets/img/provedor.png' },
    { label: 'Categorias', link: '/categorias', icon: '/assets/img/categorias2.png' },
    { label: 'Estadisticas', link: '/estadisticas', icon: '/assets/img/estadisticas.png' }
  ];

  // Almacena el elemento de menú actualmente seleccionado
  selectedMenuItem: MenuItem | null = null; // Inicialmente no seleccionado

  // Filtro para el ícono activo
  activeIconFilter: string =
    'brightness(0) saturate(100%) invert(69%) sepia(50%) saturate(6591%) hue-rotate(354deg) brightness(104%) contrast(103%)';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Escucha eventos de navegación para actualizar el elemento activo
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateActiveMenuItem();
      }
    });

    // Llama a la función para establecer el elemento activo al cargar la página
    this.updateActiveMenuItem();
  }

  // Método para seleccionar un elemento del menú
  selectMenuItem(item: MenuItem): void {
    this.selectedMenuItem = item; // Actualiza el estado del elemento seleccionado
    this.router.navigate([item.link]); // Navega a la ruta del elemento seleccionado
  }

  // Método para actualizar el estado del elemento activo
  updateActiveMenuItem(): void {
    const currentRoute = this.router.url; // Obtiene la URL actual
    this.selectedMenuItem = this.menuItems.find(item => currentRoute.includes(item.link)) || this.menuItems[0];
  }

  // Método para cerrar sesión
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Navega a la página de inicio de sesión
  }
}
