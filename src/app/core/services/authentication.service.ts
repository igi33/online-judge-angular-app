import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import { User } from '../../shared/models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private loggedIn: boolean = false;
  private currentUser: User = null;

  constructor(private http: HttpClient) { }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  initToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.decodeAndSet(token);
    }
  }

  login(username: string, password: string) {
    return this.http.post<User>(`/api/user/authenticate`, { username: username, password: password })
      .pipe(map(user => {
          // login successful if there's a jwt token in the response
          this.decodeAndSet(user.token);
          //this.currentUser = user;
          localStorage.setItem('token', user.token);
          return user.token;
      }));
  }

  decodeAndSet(token: string): void {
    this.loggedIn = true;
    let decoded: any = jwt_decode(token);
    this.currentUser = new User();
    this.currentUser.id = decoded.sub;
    this.currentUser.username = decoded.username;
    this.currentUser.email = decoded.email;
  }

  logout() {
    // remove user from local storage to log user out
    this.loggedIn = false;
    this.currentUser = null;
    localStorage.removeItem('token');
  }
}
