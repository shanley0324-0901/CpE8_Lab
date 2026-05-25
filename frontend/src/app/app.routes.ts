import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard'; // Import the guard we just fixed

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.Login),
  },
  {
    path: 'users',
    loadComponent: () => import('./users/users').then((m) => m.Users),
    canActivate: [authGuard],
    data: { role: 'admin' } // Guard will block non-admins
  },
  {
    path: 'profile',
    // For now, load the same component, but we will hide admin parts in the next step
    loadComponent: () => import('./users/users').then((m) => m.Users), 
    canActivate: [authGuard] 
  }
];