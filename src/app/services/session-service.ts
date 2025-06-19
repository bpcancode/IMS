import { Injectable } from '@angular/core';
import { STORAGE_CONSTANTS } from '../constants/storage-constants';
import { User } from '../models/user-model';
import { Role } from '../models/role-model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  getCurrentUser() {
    const user = localStorage.getItem(STORAGE_CONSTANTS.CURRENT_USER);
    if (!user) return null;
    return JSON.parse(user) as User;
  }

  setCurrentUser(user: User) {
    localStorage.setItem(STORAGE_CONSTANTS.CURRENT_USER, JSON.stringify(user));
  }

  clearCurrentUser() {
    localStorage.removeItem(STORAGE_CONSTANTS.CURRENT_USER);
  }

  isAuthenticated() {
    return !!this.getCurrentUser();
  }

  getUserRole() {
    const user = this.getCurrentUser();
    if (!user) return null;

    const role = localStorage.getItem(STORAGE_CONSTANTS.ROLE);
    if (!role) return null;

    const roles = JSON.parse(role) as Role[];
    
    const userRole = roles.find(r => r.id === user.roleId);
    return userRole;
  }
}
