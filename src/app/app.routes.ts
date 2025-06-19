import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Users } from './pages/users/users';
import { Sales } from './pages/sales/sales';
import { Login } from './components/login/login';
import { authGuard } from './auth-guard';
import { Roles } from './pages/roles/roles';
import { Products } from './pages/products/products';
import { roleGuard } from './role-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: 'dashboard', component: Dashboard, canActivate: [authGuard, roleGuard],
        data: { allowedRoles: ['Admin', 'Supervisor'] }
    },
    {
        path: 'users', component: Users, canActivate: [authGuard, roleGuard],
        data: { allowedRoles: ['Admin'] }
    },
    {
        path: 'sales', component: Sales, canActivate: [authGuard, roleGuard],
        data: { allowedRoles: ['Admin', 'Sales'] }
    },
    {
        path: 'product', component: Products, canActivate: [authGuard, roleGuard],
        data: { allowedRoles: ['Admin', 'Supervisor'] }
    },
    {
        path: 'role', component: Roles, canActivate: [authGuard, roleGuard],
        data: { allowedRoles: ['Admin'] }
    },
    { path: 'login', component: Login }
];
