import { Routes } from '@angular/router';
import {LoginComponent} from "./auth/components/login/login.component";

export const routes: Routes = [
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)},
  { path: '', component: LoginComponent}
];
