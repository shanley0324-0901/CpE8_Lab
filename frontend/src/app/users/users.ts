import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from './users.service';
import { AuthService } from '../services/authService'; 

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {
  // --- Variables ---
  users: any[] = [];
  name = '';
  toast = '';
  toastType = '';
  loading = false;
  tableLoading = false;
  userRole: string | null = ''; 

  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // 1. Security Check
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // 2. Identify who is logged in
    this.userRole = this.authService.getRole(); 
    
    // 3. Only fetch full user list if they are an admin
    if (this.userRole === 'admin') {
      this.getUsers();
    } else {
      console.log("Standard user detected. Admin data restricted.");
    }
  }

  // --- UI Helpers ---
  showToast(message: string, type: string = 'success') {
    this.toast = message;
    this.toastType = type;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.toast = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  getUsers() {
    this.tableLoading = true;
    this.cdr.detectChanges();
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.tableLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showToast('Session Expired or Unauthorized', 'error');
        this.tableLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // --- CRUD Operations ---
  addUser() {
  if (!this.name.trim()) {
    this.showToast('Please enter a name!', 'error');
    return;
  }

  this.loading = true;
  const addedName = this.name;
  this.name = ''; // Clear input early for better UX

  this.userService.addUser(addedName).subscribe({
    next: (response) => {
      console.log("Success Response:", response);
      this.loading = false;
      this.showToast(`"${addedName}" added successfully!`);
      
      // Refresh the list to show the new user
      this.getUsers();
    },
    error: (err) => {
      console.error("Full Error Object:", err);
      this.loading = false;
      
      // If the user actually appeared in the background, don't show the error toast
      // This is a "silent check" to prevent annoying fake error messages
      this.showToast(`Error adding user. Check console.`, 'error');
    }
  });
}

  editUser(user: any) {
    const newName = prompt('Enter new name:', user.name);
    if (newName && newName.trim()) {
      this.loading = true;
      this.userService.updateUser(user.id, newName).subscribe({
        next: () => {
          this.loading = false;
          this.showToast(`User updated successfully!`);
          this.getUsers();
        },
        error: () => {
          this.loading = false;
          this.showToast('Failed to update user.', 'error');
        }
      });
    }
  }

  disableUser(id: number) {
    this.loading = true;
    this.userService.disableUser(id).subscribe({
      next: () => {
        this.loading = false;
        this.showToast('User disabled!');
        this.getUsers();
      },
      error: () => {
        this.loading = false;
        this.showToast('Error disabling user.', 'error');
      }
    });
  }

  enableUser(id: number) {
    this.loading = true;
    this.userService.enableUser(id).subscribe({
      next: () => {
        this.loading = false;
        this.showToast('User enabled!');
        this.getUsers();
      },
      error: () => {
        this.loading = false;
        this.showToast('Error enabling user.', 'error');
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}