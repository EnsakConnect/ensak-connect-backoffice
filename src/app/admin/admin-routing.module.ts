import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FullComponent} from "./layouts/full/full.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {PostManagementComponent} from "./components/post-management/post-management.component";
import {UserManagementComponent} from "./components/user-management/user-management.component";

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'posts',
        component: PostManagementComponent
      },
      {
        path: `posts?page=:page&size=:size&filter=:filter&search=:search`,
        component: PostManagementComponent
      },
      {
        path: 'users',
        component: UserManagementComponent
      },
      {
        path: `users?page=:page&size=:size`,
        component: UserManagementComponent
      }

    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
