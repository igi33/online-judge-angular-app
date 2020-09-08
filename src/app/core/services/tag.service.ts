import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tag } from '../../shared/models/tag';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private http: HttpClient) { }

  getTags() : Observable<Tag[]> {
    return this.http.get<Tag[]>(`/api/tag`);
  }

  getTag(id: number) : Observable<Tag> {
    return this.http.get<Tag>(`/api/tag/${id}`);
  }
}
