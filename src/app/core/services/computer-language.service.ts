import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ComputerLanguage } from '../../shared/models/computer-language'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComputerLanguageService {

  constructor(private http: HttpClient) { }

  getComputerLanguages(): Observable<ComputerLanguage[]> {
    return this.http.get<ComputerLanguage[]>(`/api/computerlanguage`);
  }
}
