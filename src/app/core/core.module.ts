import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ErrorInterceptor } from './services/error.interceptor';
import { JwtInterceptor } from './services/jwt.interceptor';
import { LoadingInterceptor } from './services/loading.interceptor';

import { AuthGuard } from './services/auth.guard';

import { AuthenticationService } from './services/authentication.service';
import { AlertService } from './services/alert.service';
import { LoadingService } from './services/loading.service';

import { UserService } from './services/user.service';
import { TaskService } from './services/task.service';
import { TestCaseService } from './services/test-case.service';
import { TagService } from './services/tag.service';
import { SubmissionService } from './services/submission.service';
import { ComputerLanguageService } from './services/computer-language.service';

@NgModule({
  providers: [
    AuthGuard,
    AuthenticationService,
    LoadingService,
    AlertService,
    UserService,
    TaskService,
    TestCaseService,
    TagService,
    SubmissionService,
    ComputerLanguageService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ]
})
export class CoreModule { }
