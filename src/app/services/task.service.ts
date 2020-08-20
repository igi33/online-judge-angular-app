import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/Task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  getTasks(limit: number = 0, offset: number = 0) {
    return this.http.get<Task[]>(`/api/task?limit=${limit}&offset=${offset}`);
  }
}
