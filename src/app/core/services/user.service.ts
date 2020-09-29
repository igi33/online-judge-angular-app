import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../shared/models/User';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`/api/user`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`/api/user/${id}`);
  }

  postUser(user: User): Observable<User> {
    return this.http.post<User>(`/api/user`, user);
  }

  putUser(id: number, user: User): Observable<void> {
    return this.http.put<void>(`/api/user/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`/api/user/${id}`);
  }
}
