import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(username: string, password: string) {
  return this.http.post(`${this.api}/auth/register`, { username, password });
  }

  login(username: string, password: string) {
  return this.http.post<any>(`${this.api}/auth/login`, { username, password });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}