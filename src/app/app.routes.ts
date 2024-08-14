

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './layout/publico/login/login/login.component';
import { DashboardComponent } from './layout/dashboard/dashboard/dashboard.component';
import { EstadisticasComponent } from './layout/estadisticas/estadisticas/estadisticas.component';
import { AuthGuard } from './auth.guard';
import { FooterComponent } from './layout/footer/footer/footer.component';
import { HomeComponent } from './layout/inicio/home/home.component';
import { CategoriasComponent } from './layout/categorias/categorias/categorias.component';
import { EmpleadosComponent } from './layout/empleados/empleados/empleados.component';
import { ProveedoresComponent } from './layout/proveedores/proveedores/proveedores.component';
import { ProductosComponent } from './layout/productos/productos/productos.component';
import { VentasComponent } from './layout/ventas/ventas/ventas.component';
import { ComprasComponent } from './layout/compras/compras/compras.component';
import { PruebasComponent } from './layout/pruebas/pruebas.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard] },
  { path: 'tarjetas', component: FooterComponent, canActivate:[AuthGuard] },
  { path: 'estadisticas', component: EstadisticasComponent, canActivate:[AuthGuard] },
  { path: 'categorias', component: CategoriasComponent, canActivate:[AuthGuard] },
  { path: 'empleados', component: EmpleadosComponent, canActivate:[AuthGuard] },
  { path: 'proveedores', component: ProveedoresComponent, canActivate:[AuthGuard] },
  { path: 'productos', component: ProductosComponent, canActivate:[AuthGuard] },
  { path: 'ventas', component: VentasComponent, canActivate:[AuthGuard] },
  { path: 'compras', component: ComprasComponent, canActivate:[AuthGuard] },
  { path: 'pruebas', component: PruebasComponent, canActivate:[AuthGuard] },









  // Otras rutas aquí
];
