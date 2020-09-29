import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { TasksComponent } from './shared/components/tasks/tasks.component';
import { AuthComponent } from './shared/components/auth/auth.component';

import { AuthGuard } from './core/services/auth.guard';
import { ProfileComponent } from './shared/components/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'tasks', pathMatch: 'full' },
      { path: 'tasks', component: TasksComponent },
      { path: 'profile/:id', component: ProfileComponent, pathMatch: 'full' },
    ],
  },
  { path: 'auth', component: AuthComponent },

  // otherwise redirect to home
  { path: '**', redirectTo: 'tasks' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
