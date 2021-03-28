import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/User';
import { SubmissionService } from 'src/app/core/services/submission.service';
import { Submission } from '../../models/submission';
import { TaskService } from 'src/app/core/services/task.service';
import { Task } from '../../models/Task';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  user: User;
  userSubscription: Subscription;

  displayedSubmissionColumns: string[] = ['task.name', 'computerLanguage.name', 'executionTime', 'executionMemory', 'status', 'timeSubmitted'];
  submissionDataSource: MatTableDataSource<Submission> = new MatTableDataSource([]);
  @ViewChild('submissionPaginator') submissionPaginator: MatPaginator;
  @ViewChild('submissionTable') submissionSort: MatSort;

  displayedSolvedTasksColumns: string[] = ['name', 'timeLimit', 'memoryLimit', 'user.username', 'timeSubmitted'];
  solvedTasksDataSource: MatTableDataSource<Task> = new MatTableDataSource([]);
  @ViewChild('solvedTasksPaginator') solvedTasksPaginator: MatPaginator;
  @ViewChild('solvedTasksTable') solvedTasksSort: MatSort;
  
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private submissionService: SubmissionService,
    private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  ngAfterViewInit(): void {
    let sda = (item: any, property: string) => {
      let val = property.includes('.') ? property.split('.').reduce((o,i)=>o[i], item) : item[property];
      if (typeof val === 'string') val = val.toLocaleLowerCase();
      return val;
    };

    this.solvedTasksDataSource.paginator = this.solvedTasksPaginator;
    this.solvedTasksDataSource.sort = this.solvedTasksSort;
    this.solvedTasksDataSource.sortingDataAccessor = sda;

    this.submissionDataSource.paginator = this.submissionPaginator;
    this.submissionDataSource.sort = this.submissionSort;
    this.submissionDataSource.sortingDataAccessor = sda;
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

        this.taskService.getSolvedTasksByUser(id).subscribe(data => {
          this.solvedTasksDataSource.data = data;
        });

        this.submissionService.getSubmissions(0, id).subscribe(data => {
          this.submissionDataSource.data = data;
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}
