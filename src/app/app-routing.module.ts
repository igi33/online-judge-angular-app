import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { TasksComponent } from './shared/components/tasks/tasks.component';
import { AuthComponent } from './shared/components/auth/auth.component';

import { AuthGuard } from './core/services/auth.guard';
import { ProfileComponent } from './shared/components/profile/profile.component';
import { TaskComponent } from './shared/components/task/task.component';
import { SubmissionsComponent } from './shared/components/submissions/submissions.component';
import { TaskFormComponent } from './shared/components/task-form/task-form.component';
import { QuickGradeComponent } from './shared/components/quick-grade/quick-grade.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'tasks', pathMatch: 'full' },
      { path: 'quick-grade', component: QuickGradeComponent },
      { path: 'tasks/new', component: TaskFormComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'task/:id/edit', component: TaskFormComponent, pathMatch: 'full' },
      { path: 'task/:id', component: TaskComponent, pathMatch: 'full' },
      { path: 'submissions', component: SubmissionsComponent },
      { path: 'profile/:id', component: ProfileComponent, pathMatch: 'full' },
    ],
  },
  { path: 'auth', component: AuthComponent },

  // otherwise redirect to home
  { path: '**', redirectTo: 'tasks' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
