import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  // Estado inicial del sidebar (colapsado o no)
  private isCollapsedSubject = new BehaviorSubject<boolean>(false);
  
  // Observable para que los componentes se suscriban
  isCollapsed$ = this.isCollapsedSubject.asObservable();

  // Método para cambiar el estado del sidebar
  toggleSidebar() {
    this.isCollapsedSubject.next(!this.isCollapsedSubject.value);
  }

  // Método para forzar el estado del sidebar
  setSidebarState(isCollapsed: boolean) {
    this.isCollapsedSubject.next(isCollapsed);
  }
}
