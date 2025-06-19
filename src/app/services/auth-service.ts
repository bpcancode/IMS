import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { User } from '../models/user-model';
import { STORAGE_CONSTANTS } from '../constants/storage-constants';
import { Role } from '../models/role-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiService = inject(ApiService);

  async login(username: string, password: string) {
    const users = await this.apiService.getData<User[]>(STORAGE_CONSTANTS.USER);

    if (!users) {
      throw new Error('No users found');
    }

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      throw new Error('Invalid username or password');
    }

    return user;
  }

  async register(user: User) {
    const users = await this.apiService.getData<User[]>(STORAGE_CONSTANTS.USER) || [];

    if (users.some(u => u.username === user.username)) {
      throw new Error('Username already exists');
    }

    users.push(user);
    await this.apiService.setData(STORAGE_CONSTANTS.USER, JSON.stringify(users));

    return user;
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem(STORAGE_CONSTANTS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  }

  async getUserRole() {
    const user = this.getCurrentUser();
    if (!user) return null;

    const roles = await this.apiService.getData<Role[]>(STORAGE_CONSTANTS.ROLE);
    if (!roles) return null;
    return roles.find(r => r.id === user.roleId) || null;
  }

  async hasRole(allowedRoles: string[]) {

    const roles = await this.getUserRole();
    if (!roles) return false;
    return allowedRoles.includes(roles.name);
    
  }
}
