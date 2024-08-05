import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { DashboardComponent } from '../../dashboard/dashboard/dashboard.component';
import { UserService } from '../../../user-service.service';
import { AuthService } from '../../../auth-service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterOutlet,DashboardComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isCollapsed: boolean = false;

  firstName: string = '';

  lastName: string = '';


  constructor(private userService: UserService, private router: Router,private authService: AuthService) {}

  ngOnInit(): void {
    this.firstName = this.userService.getFirstName();
    this.lastName = this.userService.getLastName();

    console.log('FirstName in dashboard:', this.firstName);
    console.log('LasttName in dashboard:', this.lastName);

  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirige a la vista de login después del cierre de sesión

  }
  toggleSidebar() {
  this.isCollapsed = !this.isCollapsed;
}



}
