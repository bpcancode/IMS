import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { ApiService } from './api-service';
import { Role } from '../models/role-model';
import { STORAGE_CONSTANTS } from '../constants/storage-constants';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  apiService = inject(ApiService);

  async getRoles() {
    return await this.apiService.getData<Role[]>(STORAGE_CONSTANTS.ROLE);
  }

  async getRoleById(id: string) {
    const roles = await this.getRoles();
    return roles ? roles.find(role => role.id === id) || null : null;
  }

  async createRole(role: Role) {
    const roles = await this.getRoles() || [];
    const existingRole = roles.find(r => r.name === role.name);
    if (existingRole) {
      throw new Error('Role name already exists');
    }
    const newRole = { ...role, id: Date.now().toString() }; // Generate a new ID
    const updatedRoles = [...roles, newRole];
    await this.apiService.setData(STORAGE_CONSTANTS.ROLE, JSON.stringify(updatedRoles));
    return newRole;
  }

  async updateRole(role: Role) {
   
  }

  async deleteRole(id: string) {
    const roles = await this.getRoles();
    if (!roles) {
      throw new Error('No roles found');
    }

    const index = roles.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Role not found');
    }

    roles.splice(index, 1);
    await this.apiService.setData(STORAGE_CONSTANTS.ROLE, JSON.stringify(roles));
  }
}
