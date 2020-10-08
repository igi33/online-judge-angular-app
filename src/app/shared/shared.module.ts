import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './components/layout/layout.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { AuthComponent } from './components/auth/auth.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { MaterialModule } from '../material/material.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { BrowserModule } from '@angular/platform-browser';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { SubmissionsComponent } from './components/submissions/submissions.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TaskComponent } from './components/task/task.component';
import { QuickGradeComponent } from './components/quick-grade/quick-grade.component';

@NgModule({
  declarations: [
    LayoutComponent,
    TasksComponent,
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    TaskFormComponent,
    SubmissionsComponent,
    ProfileComponent,
    TaskComponent,
    QuickGradeComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    InfiniteScrollModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
  ]
})
export class SharedModule { }
