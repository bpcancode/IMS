import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from './services/session-service';
import { AuthService } from './services/auth-service';

export const roleGuard: CanActivateFn = async (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data['allowedRoles'] as string[];
  if(!(await authService.hasRole(allowedRoles))) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  return true;
};
