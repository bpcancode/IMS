import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoleService } from '../../services/role-service';
import { User } from '../../models/user-model';
import { Role } from '../../models/role-model';
import { ConfirmService } from '../../services/confirm-service';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-users',
  imports: [ReactiveFormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {

  userSevice = inject(UserService);
  roleService = inject(RoleService);

  users = signal<User[]>([]);
  roles = signal<Role[]>([]);


  editUserForm = new FormGroup({
    id: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    roleId: new FormControl('', [Validators.required])
  });

  addUserForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    roleId: new FormControl('2', [Validators.required])
  })

  async ngOnInit() {
    await this.initilize();
  }

  async initilize() {
    await Promise.all([this.getUsers(), this.getRoles()]);
  }

  async addUser() {
    if (this.addUserForm.invalid) {
      ToastService.error('Please fill out the form correctly.');
      return;
    }
    const formValue = this.addUserForm.value;
    const user = new User(crypto.randomUUID(), formValue.username!, formValue.email!, formValue.roleId!, formValue.password!);
    this.addUserForm.reset();
    await this.userSevice.createUser(user);
    await this.initilize();
    ToastService.success('User added successfully!');
  }

  async deleteUser(userId: string) {
    const confirmed = await ConfirmService.request({
      message: 'Are you sure you want to delete this user?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });
    if (!confirmed) return;
    await this.userSevice.deleteUser(userId);
    await this.initilize();
    ToastService.success('User deleted successfully!');
  }

  async editUserClicked(user: User) {
    this.editUserForm.patchValue(user);
  }

  async getUsers() {
    const users = await this.userSevice.getUsers();
    this.users.set(users || []);
  }

  async editUser() {
    if (this.editUserForm.invalid) {
      ToastService.error('Please fill out the form correctly.');
      return;
    }

    const formValue = this.editUserForm.value;
    const updatedUser = new User(
      formValue.id!,
      formValue.username!,
      formValue.email!,
      formValue.roleId!,
      formValue.password!
    );
    await this.userSevice.updateUser(updatedUser);
    this.editUserForm.reset();
    await this.initilize();
    ToastService.success('User updated successfully!');
  }

  async getRoles() {
    const roles = await this.roleService.getRoles();
    this.roles.set(roles || []);
  }

  getRoleName(roleId: string): string {

    const role = this.roles().find(r => r.id === roleId);
    return role ? role.name : 'N/A';
  }

}
