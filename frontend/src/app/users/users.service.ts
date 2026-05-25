import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class UsersService {
  // Use the API URL from environment.ts (usually http://localhost:5000/api)
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  // NOTE: Headers are handled automatically by our authInterceptor!

  getUsers() {
    return this.http.get<any[]>(this.apiUrl);
  }

  addUser(name: string) {
  // Remove "/add-user". Just use the base URL.
  return this.http.post(`${this.apiUrl}`, { name }); 
  }

  updateUser(id: number, name: string) {
    return this.http.put(`${this.apiUrl}/${id}`, { name });
  }

  disableUser(id: number) {
    return this.http.put(`${this.apiUrl}/disable/${id}`, {});
  }

  enableUser(id: number) {
    return this.http.put(`${this.apiUrl}/enable/${id}`, {});
  }
}