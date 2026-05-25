import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authService';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Check if logged in
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // 2. Check for Role-Based Access
  const expectedRole = route.data['role']; // This comes from app.routes.ts
  const userRole = authService.getRole();

  // If the route requires a specific role, but the user doesn't have it
  if (expectedRole && userRole !== expectedRole) {
    console.warn(`Access Denied. Expected: ${expectedRole}, but user is: ${userRole}`);
    
    // Instead of login, let's send them to their own profile 
    // so they don't get stuck in a login loop.
    router.navigate(['/login']); 
    return false;
  }

  return true;
};