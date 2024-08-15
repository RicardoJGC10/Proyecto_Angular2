import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../sidebar/sidebar/sidebar.component';
import { AuthService } from '../../../auth-service.service';
import { Router } from '@angular/router';
import { UserService } from '../../../user-service.service';
import { HeaderComponent } from '../../header/header/header.component';
import { FooterComponent } from '../../footer/footer/footer.component';
import { BestsellingService } from '../../servicios/bestselling.service';
import { SalesService } from '../../servicios/sales.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isCollapsed: boolean = false;

  quantitySold: number = 0;
  totalSales: number = 0;
  salesCount: number = 0;
  clientsServed: number = 0; // Nueva propiedad para clientes atendidos

  firstName: string = '';
  lastName: string = '';
  topProductName: string = 'Nombre del Producto Ejemplo';


  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private bestselling: BestsellingService,
    private salesService: SalesService
  ) {}

  ngOnInit(): void {
    this.firstName = this.userService.getFirstName();
    this.lastName = this.userService.getLastName();
    this.adjustFontSize();

    // Obtener el producto más vendido
    this.bestselling.getBestSellingProduct().subscribe(data => {
      console.log('Data received from BestsellingService API:', data);
      if (data && data.best_selling_product) {
        const product = data.best_selling_product;
        this.topProductName = product.product_name;
        this.quantitySold = product.total_quantity_sold;
      } else {
        console.error('Unexpected data structure from BestsellingService:', data);
      }
    }, error => {
      console.error('Error fetching data from BestsellingService:', error);
    });

    // Obtener las ventas del día
    this.salesService.getDailySales().subscribe(data => {
      console.log('Data received from SalesService API:', data);
      if (data) {
        this.totalSales = data.total_sales_today;
        this.salesCount = data.sales_count_today;
      } else {
        console.error('Unexpected data structure from SalesService:', data);
      }
    }, error => {
      console.error('Error fetching data from SalesService:', error);
    });

    // Obtener clientes atendidos
    this.salesService.getDailySales().subscribe(data => {
      console.log('Data received from SalesService API for clients served:', data);
      if (data && data.sales_count_today !== undefined) {
        this.clientsServed = data.sales_count_today;
      } else {
        console.error('Unexpected data structure for clients served:', data);
      }
    }, error => {
      console.error('Error fetching data from SalesService for clients served:', error);
    });

    console.log('FirstName in dashboard:', this.firstName);
    console.log('LastName in dashboard:', this.lastName);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    console.log('Sidebar toggle clicked');
    this.isCollapsed = !this.isCollapsed;
  }

  
adjustFontSize() {
  const productNameElement = document.querySelector('.widget-stats-amount') as HTMLElement;
  if (productNameElement) {
    const productNameLength = this.topProductName.length;
    if (productNameLength > 20) {
      productNameElement.style.fontSize = '0.9rem';
    } else {
      productNameElement.style.fontSize = '1.2rem';
    }
  }
}


}
