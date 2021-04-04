import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Submission } from '../../shared/models/submission';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  constructor(private http: HttpClient) { }

  getSubmissions(taskId: number = 0, userId: number = 0, limit: number = 0, offset: number = 0) : Observable<Submission[]> {
    return this.http.get<Submission[]>(`/api/submission?taskId=${taskId}&userId=${userId}&limit=${limit}&offset=${offset}`);
  }

  getSubmissionCount(taskId: number = 0, userId: number = 0) : Observable<number> {
    return this.http.get<number>(`/api/submission/count?taskId=${taskId}&userId=${userId}`);
  }

  getSubmission(id: number) : Observable<Submission> {
    return this.http.get<Submission>(`/api/submission/${id}`);
  }

  getBestSubmissionsOfTask(taskId: number, limit: number = 0, offset: number = 0) : Observable<Submission[]> {
    return this.http.get<Submission[]>(`/api/submission/task/${taskId}/best?limit=${limit}&offset=${offset}`);
  }

  postSubmission(taskId: number, submission: Submission) : Observable<Submission> {
    return this.http.post<Submission>(`/api/submission/task/${taskId}`, submission);
  }
}
