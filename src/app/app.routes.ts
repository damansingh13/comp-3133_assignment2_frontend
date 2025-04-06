import { Routes } from '@angular/router';
// import { LoginComponent } from './auth/login/login.component';
// import { SignupComponent } from './auth/signup/signup.component';
// import { EmployeesComponent } from './components/employees.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./auth/signup/signup.component').then(m => m.SignupComponent) },
  { 
    path: 'employees', 
    canActivate: [AuthGuard], 
    loadComponent: () => import('./components/employees/employees.component').then(m => m.EmployeesComponent) },
  {
    path: 'employees/add',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/add-employee/add-employee.component').then(m => m.AddEmployeeComponent),
  },
  {
    path: 'employees/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/view-employee/view-employee.component').then(m => m.ViewEmployeeComponent)
  },
  {
    path: 'employees/:id/edit',
    canActivate: [AuthGuard],
    loadComponent: () => import('./components/edit-employee/edit-employee.component').then(m => m.EditEmployeeComponent)
  },  
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];