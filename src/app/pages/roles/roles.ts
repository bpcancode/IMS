import { Component, inject, OnInit, signal } from '@angular/core';
import { RoleService } from '../../services/role-service';
import { Role } from '../../models/role-model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmService } from '../../services/confirm-service';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-roles',
  imports: [ReactiveFormsModule],
  templateUrl: './roles.html',
  styleUrl: './roles.css'
})
export class Roles implements OnInit {
  roleService = inject(RoleService);

  roles = signal<Role[]>([]);

  editRoleForm = new FormGroup({
    id: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(5)])
  })

  addRoleForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(5)])
  })

  async ngOnInit() {
    this.getRoles();
  }

  async addRole() {
    if (this.addRoleForm.invalid) {
      ToastService.error('Please fill out the form correctly.');
      return;
    }
    const formValue = this.addRoleForm.value;
    const role = new Role(crypto.randomUUID(), formValue.name!, formValue.description!);
    this.addRoleForm.reset();
    await this.roleService.createRole(role);
    await this.getRoles();
    ToastService.success('Role added successfully!');
  }

  async deleteRole(roleId: string) {
    const confirmed = await ConfirmService.request({
      message: 'Are you sure you want to delete this role?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });
    if (!confirmed) return;
    await this.roleService.deleteRole(roleId);
    await this.getRoles();
    ToastService.success('Role deleted successfully!');
  }
  
  async getRoles() {
    const roles = await this.roleService.getRoles();
    this.roles.set(roles || []);
  }

  async editRoleClicked(role: Role) {
    this.editRoleForm.patchValue(role);
  }

  async updateRole() {
    if (this.editRoleForm.invalid) {
      ToastService.error('Please fill out the form correctly.');
      return;
    }
    const formValue = this.editRoleForm.value;
    const role = new Role(formValue.id!, formValue.name!, formValue.description!);
    await this.roleService.updateRole(role);
    this.editRoleForm.reset();
    await this.getRoles();
    ToastService.success('Role updated successfully!');
  }

  
}
