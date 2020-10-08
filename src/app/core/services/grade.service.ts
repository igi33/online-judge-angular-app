import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Grade } from '../../shared/models/grade';
import { GradeSubmission } from '../../shared/models/grade-submission';

@Injectable({
  providedIn: 'root'
})
export class GradeService {

  constructor(private http: HttpClient) { }

  grade(gradeSubmission: GradeSubmission) : Observable<Grade> {
    return this.http.post<Grade>(`/api/grade`, gradeSubmission);
  }
}
