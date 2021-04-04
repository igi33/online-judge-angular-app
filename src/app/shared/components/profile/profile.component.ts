import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/User';
import { SubmissionService } from 'src/app/core/services/submission.service';
import { TaskService } from 'src/app/core/services/task.service';
import { SolvedTasksDataSource } from '../../data-sources/solved-tasks-data-source';
import { tap } from 'rxjs/operators';
import { SubmissionsDataSource } from '../../data-sources/submissions-data-source';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  user: User;
  userSubscription: Subscription;

  userSubmissionsDataSource: SubmissionsDataSource;
  userSubmissionsTotalItems: number = 0;
  userSubmissionsPageSize: number = 10;
  displayedUserSubmissionsColumns: string[] = ['task.name', 'computerLanguage.name', 'executionTime', 'executionMemory', 'status', 'timeSubmitted'];
  @ViewChild('userSubmissionsPaginator') userSubmissionsPaginator: MatPaginator;

  solvedTasksDataSource: SolvedTasksDataSource;
  solvedTasksTotalItems: number = 0;
  solvedTasksPageSize: number = 10;
  displayedSolvedTasksColumns: string[] = ['name', 'timeLimit', 'memoryLimit', 'user.username', 'timeSubmitted'];
  @ViewChild('solvedTasksPaginator') solvedTasksPaginator: MatPaginator;
  
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private submissionService: SubmissionService,
    private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  ngAfterViewInit(): void {
    this.solvedTasksPaginator.page
      .pipe(
        tap(() => this.loadSolvedTasksPage())
      )
      .subscribe();

    this.userSubmissionsPaginator.page
      .pipe(
        tap(() => this.loadUserSubmissionsPage())
      )
      .subscribe();
  }

  loadProfile() {
    this.userSubscription = this.route.params.subscribe({
      next: (params: Params) => {
        const id = +params['id'];
        this.userService.getUser(id).subscribe({
          next: data => {
            this.user = data;
          }
        });

        this.solvedTasksDataSource = new SolvedTasksDataSource(this.taskService);
        this.solvedTasksDataSource.loadSolvedTasks(id, this.solvedTasksPageSize);
        this.taskService.getSolvedTasksByUserCount(id)
          .subscribe({
            next: count => this.solvedTasksTotalItems = count
          });

        this.userSubmissionsDataSource = new SubmissionsDataSource(this.submissionService);
        this.userSubmissionsDataSource.loadSubmissions(0, id, this.solvedTasksPageSize);
        this.submissionService.getSubmissionCount(0, id)
          .subscribe({
            next: count => this.userSubmissionsTotalItems = count
          });
      }
    });
  }

  loadSolvedTasksPage(): void {
    this.solvedTasksDataSource.loadSolvedTasks(this.user.id, this.solvedTasksPaginator.pageSize, this.solvedTasksPaginator.pageIndex);
  }

  loadUserSubmissionsPage(): void {
    this.userSubmissionsDataSource.loadSubmissions(0, this.user.id, this.userSubmissionsPaginator.pageSize, this.userSubmissionsPaginator.pageIndex);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}
