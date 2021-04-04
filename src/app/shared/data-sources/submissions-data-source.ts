import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { SubmissionService } from "src/app/core/services/submission.service";
import { Submission } from "../models/submission";

export class SubmissionsDataSource implements DataSource<Submission> {
  private submissionSubject = new BehaviorSubject<Submission[]>([]);

  constructor(private submissionService: SubmissionService) {}

  connect(collectionViewer: CollectionViewer): Observable<Submission[]> {
    return this.submissionSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.submissionSubject.complete();
  }

  loadSubmissions(taskId: number, userId: number, pageSize: number = 10, pageIndex: number = 0) {
    this.submissionService.getSubmissions(taskId, userId, pageSize, pageIndex * pageSize)
      .subscribe(submissions => this.submissionSubject.next(submissions));
  }
}
