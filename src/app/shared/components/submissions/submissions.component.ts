import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { SubmissionService } from 'src/app/core/services/submission.service';
import { SubmissionsDataSource } from '../../data-sources/submissions-data-source';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.scss']
})
export class SubmissionsComponent implements OnInit, AfterViewInit {
  selectedId: number = 0;
  submissionsDataSource: SubmissionsDataSource;
  totalItems: number = 0;
  pageSize: number = 10;
  displayedSubmissionColumns: string[] = ['id', 'task.name', 'user.username', 'computerLanguage.name', 'executionTime', 'executionMemory', 'status', 'timeSubmitted'];
  @ViewChild('submissionsPaginator') submissionsPaginator: MatPaginator;

  constructor(
    private submissionService: SubmissionService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.selectedId = +this.route.snapshot.queryParamMap.get('selectedId');
    this.submissionsDataSource = new SubmissionsDataSource(this.submissionService);
    this.submissionsDataSource.loadSubmissions(0, 0, this.pageSize);
    this.submissionService.getSubmissionCount(0, 0)
      .subscribe({
        next: count => this.totalItems = count
      });
  }

  ngAfterViewInit(): void {
    this.submissionsPaginator.page
      .pipe(
          tap(() => this.loadSubmissionsPage())
      )
      .subscribe();
  }

  loadSubmissionsPage(): void {
    this.submissionsDataSource.loadSubmissions(0, 0, this.submissionsPaginator.pageSize, this.submissionsPaginator.pageIndex);
  }
}
