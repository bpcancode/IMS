import { Injectable } from '@angular/core';
import { STORAGE_CONSTANTS } from '../constants/storage-constants';
import { User } from '../models/user-model';
import { Role } from '../models/role-model';
import { Product } from '../models/product-model';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  public initilize() {
    this.initUser();
    this.initRole();
    this.initProduct();
  }

  private initUser() {
    const user = localStorage.getItem(STORAGE_CONSTANTS.USER);
    if (user) return;

    const users = [
      new User('1', 'admin', 'admin@gmail.com', '1', 'password'),
      new User('2', 'sales', 'sales@gmail.com', '2', 'password'),
      new User('3', 'supervisor', 'supervisor@gmail.com', '3', 'password')
    ]

    localStorage.setItem(STORAGE_CONSTANTS.USER, JSON.stringify(users));
  }

  private initRole() {
    const role = localStorage.getItem(STORAGE_CONSTANTS.ROLE);
    if (role) return;

    const roles = [
      new Role('1', 'Admin', 'Administrator with full access'),
      new Role('2', 'Sales', 'Sales representative with limited access'),
      new Role('3', 'Supervisor', 'Supervisor with oversight capabilities')
    ];

    localStorage.setItem(STORAGE_CONSTANTS.ROLE, JSON.stringify(roles));
  }

  private initProduct() {
    const product = localStorage.getItem(STORAGE_CONSTANTS.PRODUCT);
    if (product) return;

    const products = [
      new Product('1', 'Product 1', 100, 10),
      new Product('2', 'Product 2', 200, 20),
      new Product('3', 'Product 3', 300, 30)
    ];

    localStorage.setItem(STORAGE_CONSTANTS.PRODUCT, JSON.stringify(products));
  }

}
