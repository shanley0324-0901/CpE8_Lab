import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- MUST HAVE THIS
import { Router } from '@angular/router';
import { AuthService } from '../services/authService'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // <--- ADD FormsModule HERE
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = ''; 
  password = '';
  name = ''; 
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    console.log("Login button clicked for:", this.email);
    
    // We create the object to send to the backend
    const credentials = {
      email: this.email,
      password: this.password,
    };
    console.log("Sending:", credentials);

    this.authService.login(credentials).subscribe({
      next: (res: any) => {
        console.log("Server Response:", res);
        this.message = "Login successful!";
        
        // Save the data to local storage so the guards can see it
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('id', res.id);
        localStorage.setItem('name', res.name);
        localStorage.setItem('email', res.email);
        
        // Redirect based on role
        if (res.role === 'admin') {
          this.router.navigate(['/users']);
        } else {
          this.router.navigate(['/profile']);
        }
      },
      error: (err) => {
        console.error("Login Error:", err);
        this.message = err.error?.message || "Login failed. Check server.";
      }
    });
  }

  register() {
    console.log("Registering:", this.name);
    const userData = { name: this.name, email: this.email, password: this.password };

    this.authService.register(userData).subscribe({
      next: (res: any) => {
        this.message = "Registration successful! Now click Login.";
      },
      error: (err) => {
        this.message = err.error?.message || "Registration failed";
      }
    });
  }
}