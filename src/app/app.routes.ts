import { Routes } from '@angular/router';
import {LoginComponent} from "./auth/components/login/login.component";
import {authGuard} from "./auth/guards/auth.guard";

export const routes: Routes = [
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canActivate: [authGuard]},
  { path: 'auth/login', component: LoginComponent},
  { path: '' , redirectTo: 'admin', pathMatch: "full"}
];
