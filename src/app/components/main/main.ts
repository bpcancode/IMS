import { CommonModule } from '@angular/common';
import { Component, computed, HostListener, inject, input, model, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "../layout/header/header";
import { AuthService } from '../../services/auth-service';
import { Sidebar } from '../layout/sidebar/sidebar';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, CommonModule, Header, Sidebar],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main implements OnInit {

  authenticated = model.required<boolean>();

  authService = inject(AuthService);

  role = signal<string>("");
  username = signal<string>("");

  isSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);

  sizeClass = computed(() => {
    const isLeftSidebarCollapsed = this.isSidebarCollapsed();
    if (isLeftSidebarCollapsed) {
      return '';
    }
    return this.screenWidth() > 768 ? 'body-trimmed' : 'body-md-screen';
  });

  async ngOnInit(){
    const r = await this.authService.getUserRole();
    this.role.set(r?.name || 'Guest');

    const u = this.authService.getCurrentUser();
    this.username.set(u?.username || 'Guest');

    this.isSidebarCollapsed.set(this.screenWidth() < 768);
  }



  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isSidebarCollapsed.set(true);
    }
  }

  changeisSidebarCollapsed(isSidebarCollapsed: boolean): void {
    this.isSidebarCollapsed.set(isSidebarCollapsed);
  }

}
