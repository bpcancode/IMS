import { Component, input, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  username = input.required<string>();
  role = input.required<string>();

  private router = inject(Router);

  get pageTitle(): string {
    const url = this.router.url;
    if (url.includes('dashboard')) return 'Dashboard Overview';
    if (url.includes('users')) return 'Users';
    if (url.includes('sales')) return 'Sales System';
    if (url.includes('product')) return 'Products';
    if (url.includes('role')) return 'Roles';
    return '';
  }
}
