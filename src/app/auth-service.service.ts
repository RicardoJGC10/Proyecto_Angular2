import { Injectable } from '@angular/core';
import { UserService } from './user-service.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private userService: UserService) {}

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  saveUserInfo(userInfo: any): void {
    console.log('Saving user info:', userInfo);  // Debugging line
    localStorage.setItem('user', JSON.stringify(userInfo));
  }

  getUserInfo(): any {
    const user = localStorage.getItem('user');
    console.log('Getting user info from localStorage:', user);  // Debugging line
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userService.clearFirstName(); // Limpia el nombre del usuario

    
  }
}
