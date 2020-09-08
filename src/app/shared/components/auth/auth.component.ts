import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  selectedIndex = 0;
  @ViewChild(LoginComponent) login: LoginComponent;

  constructor() { }

  ngOnInit(): void {
  }

  selectTab(index: number): void {
    this.selectedIndex = index;
  }

  readyLogin(username: string): void {
    this.login.prepareForm(username);
    this.selectTab(0);
  }
  
}
