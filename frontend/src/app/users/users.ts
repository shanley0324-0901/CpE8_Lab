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
      this.profile.id = Number(localStorage.getItem('id'));
      this.profile.name = localStorage.getItem('name') || '';
      this.profile.email = localStorage.getItem('email') || '';
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

  if (
    !this.newUser.name.trim() ||
    !this.newUser.email.trim() ||
    !this.newUser.password.trim()
  ) {
    this.showToast('Please fill all fields!', 'error');
    return;
  }

  this.loading = true;

  this.userService.addUser(this.newUser).subscribe({
    next: () => {

      this.loading = false;

      this.showToast('User created successfully!');

      this.showAddUserModal = false;

      this.newUser = {
        name: '',
        email: '',
        password: '',
        role: 'user'
      };

      this.getUsers();
    },
    error: (err) => {

      console.error(err);

      this.loading = false;

      this.showToast('Failed to create user.', 'error');
    }
  });
}

  editUser(user: any) {
    const newName = prompt('Enter new name:', user.name);
    if (newName && newName.trim()) {
      this.loading = true;
      this.userService.updateUser(user.id, { name: newName}).subscribe({
      next: () => {
          this.loading = false;
          this.showToast(`User updated successfully!`);
          this.getUsers();
        },
        error: (err) => {
          console.error(err);
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

  updateProfile() {

  this.userService.updateUser(
    this.profile.id,
    {
      name: this.profile.name,
      email: this.profile.email
    }
  ).subscribe({
    next: () => {

      localStorage.setItem('name', this.profile.name);
      localStorage.setItem('email', this.profile.email);

      this.showToast('Profile updated successfully!');
    },
    error: () => {
      this.showToast('Failed to update profile.', 'error');
    }
    });

  }

  changePassword() {

  if (!this.profile.password.trim()) {
    this.showToast('Please enter a new password.', 'error');
    return;
  }

  if (this.profile.password !== this.profile.confirmPassword) {
    this.showToast('Passwords do not match.', 'error');
    return;
  }

  this.userService.updateUser(
    this.profile.id,
    {
      password: this.profile.password
    }
  ).subscribe({
    next: () => {

      this.profile.password = '';
      this.profile.confirmPassword = '';

      this.showToast('Password updated successfully!');
    },
    error: () => {
      this.showToast('Failed to update password.', 'error');
    }
  });

}

  showAddUserModal = false;

  newUser = {
    name: '',
    email: '',
    password: '',
    role: 'user'
  };

  searchTerm = '';

  openAddUserModal() {
    this.showAddUserModal = true;
  }

  closeAddUserModal() {
    this.showAddUserModal = false;
  }

  get filteredUsers() {
    return this.users.filter(user =>
      user.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  profile = {
  id: 0,
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
};
}