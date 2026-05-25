import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Updated to include the /auth prefix based on your backend routes
  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  // POST: api/auth/register
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // POST: api/auth/login
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
        }
      })
    );
  }

  // Logout Module requirement
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // For a real logout logic, you could also call a backend logout route here
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Helper to check for Admin role easily in components/guards
  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }
}