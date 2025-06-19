import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { InitService } from './services/init-service';
import { SessionService } from './services/session-service';
import { Main } from "./components/main/main";
import { Login } from "./components/login/login";
import { LoadingSpinner } from "./components/loading-spinner/loading-spinner";
import { ToastComponent } from "./components/toast/toast";
import { Confirm } from "./components/confirm/confirm";

@Component({
  selector: 'app-root',
  imports: [Main, Login, LoadingSpinner, ToastComponent, Confirm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  private initService = inject(InitService);
  sessionService = inject(SessionService);

  isSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);

  isAuthenticated = signal<boolean>(this.sessionService.isAuthenticated());


  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isSidebarCollapsed.set(true);
    }
  }

  ngOnInit(): void {
    this.isSidebarCollapsed.set(this.screenWidth() < 768);
    this.initService.initilize();
  }

  changeisSidebarCollapsed(isSidebarCollapsed: boolean): void {
    this.isSidebarCollapsed.set(isSidebarCollapsed);
  }
}
