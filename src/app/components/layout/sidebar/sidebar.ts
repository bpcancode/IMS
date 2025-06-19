import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, model, OnInit, output, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { SessionService } from '../../../services/session-service';
import { ConfirmService } from '../../../services/confirm-service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  authenticated = model.required<boolean>();

  role = input.required<string>();
  username = input.required<string>();
  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();
  
  sessionService = inject(SessionService);
  router = inject(Router);

  menus = computed(() => {
    if (this.role() === 'Admin') {
      return [
        { routeLink: 'dashboard', icon: 'fal fa-home', label: 'Dashboard' },
        { routeLink: 'users', icon: 'fal fa-users', label: 'Users' },
        { routeLink: 'role', icon: 'fal fa-users-cog', label: 'Roles' },
        { routeLink: 'product', icon: 'fal fa-box-open', label: 'Products' },
        { routeLink: 'sales', icon: 'fal fa-hand-holding-usd', label: 'Sales' },
      ];
    }
    else if (this.role() === 'Supervisor') {
      return [
        { routeLink: 'dashboard', icon: 'fal fa-home', label: 'Dashboard' },
        { routeLink: 'product', icon: 'fal fa-box-open', label: 'Products' },
      ];
    }
    else {
      return [
        { routeLink: 'sales', icon: 'fal fa-box-open', label: 'Sales' },
      ];
    }
  });

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }

  async logout() {
    const confirm = await ConfirmService.request({
      message: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      cancelText: 'Cancel'
    });
    if (!confirm) return;
    this.sessionService.clearCurrentUser();
    this.router.navigate(['/']);
    this.authenticated.set(false);
  }
}

