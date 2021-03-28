import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestCaseService {

  constructor(private http: HttpClient) { }

  getTestCaseInput(id: number): Observable<Blob> {
    return this.http.get<Blob>(`/api/testcase/${id}/input`, { responseType: 'blob' as 'json' });
  }
  
  getTestCaseOutput(id: number): Observable<Blob> {
    return this.http.get<Blob>(`/api/testcase/${id}/output`, { responseType: 'blob' as 'json' });
  }

  deleteTestCase(id: number): Observable<void> {
    return this.http.delete<void>(`api/testcase/${id}`);
  }
}
