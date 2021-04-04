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

  getSolvedTasksByUserCount(userId: number): Observable<number> {
    return this.http.get<number>(`/api/task/solvedby/${userId}/count`);
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`/api/task/${id}`);
  }

  postTask(taskFormData: FormData): Observable<Task> {
    return this.http.post<Task>(`/api/task`, taskFormData);
  }

  putTask(id: number, taskFormData: FormData): Observable<void> {
    return this.http.put<void>(`/api/task/${id}`, taskFormData);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`api/task/${id}`);
  }
}
