import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { AlertService } from '../../../core/services/alert.service';
import { UserService } from '../../../core//services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  processingForm = false;
  hide = true;

  @Output() successfulRegistration = new EventEmitter<string>();

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  submitRegisterForm() {
    this.processingForm = true;

    this.userService.postUser(this.registerForm.value)
        .pipe(finalize(() => {
          this.processingForm = false;
        }))
        .subscribe(
            () => {
                this.alertService.success('Registration successful');
                this.successfulRegistration.emit(this.f.username.value); // switch to login tab and autofill username
                this.registerForm.reset();
            });
  }

}
