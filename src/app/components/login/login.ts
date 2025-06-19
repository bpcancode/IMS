import { Component, inject, model } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { SessionService } from '../../services/session-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  authenticated = model.required();

  sessionService = inject(SessionService);
  authService = inject(AuthService);
  router = inject(Router);

  fb = inject(FormBuilder);
  
  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });


  async login() { 
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      const user = await this.authService.login(username!, password!);
      this.sessionService.setCurrentUser(user);

      const role = this.sessionService.getUserRole();

      if (role && role.name === 'Sales') {
        await this.router.navigate(['/sales']);
      } else {
        await this.router.navigate(['/dashboard']);
      }
      this.authenticated.set(true);
    }
  }


}
