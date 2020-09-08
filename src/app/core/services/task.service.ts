import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../shared/models/Task';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  getTasks(tagId: number = 0, limit: number = 0, offset: number = 0): Observable<Task[]> {
    return this.http.get<Task[]>(`/api/task?tagId=${tagId}&limit=${limit}&offset=${offset}`);
  }

  getSolvedTasksByUser(userId: number, limit: number = 0, offset: number = 0): Observable<Task[]> {
    return this.http.get<Task[]>(`/api/task/solvedby/${userId}?limit=${limit}&offset=${offset}`);
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`/api/task/${id}`);
  }

  postTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`/api/task`, task);
  }

  putTask(id: number, task: Task): Observable<void> {
    return this.http.put<void>(`/api/task/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`api/task/${id}`);
  }
}
