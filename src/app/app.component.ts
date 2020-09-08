import { Component, OnInit } from '@angular/core';

import { AlertService } from './core/services/alert.service';
import { AuthenticationService } from './core/services/authentication.service';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private alertService: AlertService,
    public snackBar: MatSnackBar,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.alertService.subject.subscribe(message => {
      if (message) {
        const dur = message.type === 'error' ? 7500 : 5000;
        this.snackBar.open(message.text, null, {
          duration: dur,
        });
      }
    });
    this.authService.initToken();
  }

}
