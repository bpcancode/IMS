import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { ApiService } from './api-service';
import { User } from '../models/user-model';
import { STORAGE_CONSTANTS } from '../constants/storage-constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) {}

  async getUsers() {
    return await this.apiService.getData<User[]>(STORAGE_CONSTANTS.USER);
  }

  async getUserById(id: string) {
    const users = await this.getUsers();
    return users ? users.find(user => user.id === id) || null : null;
  }

  async createUser(user: User) {
    const users = await this.getUsers() || [];
    const existingUser = users.find(u => u.username === user.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }
    
    const updatedUsers = [...users, user];
    await this.apiService.setData(STORAGE_CONSTANTS.USER, JSON.stringify(updatedUsers));
    return user;
  }

  async updateUser(user: User) {
    const users = await this.getUsers();
    if (!users) {
      throw new Error('No users found');
    }

    const index = users.findIndex(u => u.id === user.id);
    if (index === -1) {
      throw new Error('User not found');
    }

    const existingUser = users.find(u => u.username === user.username && u.id !== user.id);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    users[index] = user;
    await this.apiService.setData(STORAGE_CONSTANTS.USER, JSON.stringify(users));
    return user;
  }

  async deleteUser(id: string) {
    const users = await this.getUsers();
    if (!users) {
      throw new Error('No users found');
    }

    const index = users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }

    users.splice(index, 1);
    await this.apiService.setData(STORAGE_CONSTANTS.USER, JSON.stringify(users));
  }
}
