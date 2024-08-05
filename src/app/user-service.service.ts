// src/app/services/user.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private firstNameKey = 'firstName';
  private lastNameKey = 'lastName';



  constructor() {}

  setFirstName(name: string){
    localStorage.setItem(this.firstNameKey, name);

  }
  setLastName(name: string){
    localStorage.setItem(this.lastNameKey, name);

  }

  getFirstName(): string{
    return localStorage.getItem(this.firstNameKey) || '';

  }
  getLastName(): string{
    return localStorage.getItem(this.lastNameKey) || '';

  }
  clearFirstName() {
    localStorage.removeItem(this.firstNameKey);
  }
  clearLastName() {
    localStorage.removeItem(this.lastNameKey);
  }
}
