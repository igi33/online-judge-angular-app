import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  processingForm = false;
  returnUrl: string;
  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  // used in auth component
  public prepareForm(username: string): void {
    this.f.username.setValue(username);
    this.f.password.setValue('');
  }

  submitLoginForm(): void {
      this.processingForm = true;
      
      this.authenticationService.login(this.f.username.value, this.f.password.value)
        .pipe(finalize(() => {
          this.processingForm = false;
        }))
        .subscribe(
          () => {
              this.router.navigate([this.returnUrl]);
          });
  }
}
