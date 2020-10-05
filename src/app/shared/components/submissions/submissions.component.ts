import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ScrollDispatcher } from '@angular/cdk/overlay';
import { AfterViewInit, Component, NgZone, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { SubmissionService } from 'src/app/core/services/submission.service';
import { Submission } from '../../models/submission';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.scss']
})
export class SubmissionsComponent implements OnInit, AfterViewInit {
  submissions: Submission[] = [];
  page: number = 1;
  pageSize: number = 30;
  selectedId: number = 0;

  displayedSubmissionColumns: string[] = ['id', 'task.name', 'user.username', 'computerLanguage.name', 'executionTime', 'executionMemory', 'status', 'timeSubmitted'];
  submissionDataSource: MatTableDataSource<Submission> = new MatTableDataSource([]);
  @ViewChild('submissionsPaginator') submissionsPaginator: MatPaginator;

  constructor(
    private submissionService: SubmissionService,
    private route: ActivatedRoute,
    public scroll: ScrollDispatcher,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.selectedId = +this.route.snapshot.queryParamMap.get('selectedId');
    this.loadMoreSubmissions();
  }

  ngAfterViewInit(): void {
    let sda = (item: any, property: string) => {
      let val = property.includes('.') ? property.split('.').reduce((o,i)=>o[i], item) : item[property];
      if (typeof val === 'string') val = val.toLocaleLowerCase();
      return val;
    };
    
    this.submissionDataSource.sortingDataAccessor = sda;
  }

  loadMoreSubmissions(reload: boolean = false): void {
    if (reload) {
      this.page = 1;
      this.submissions = [];
    }
    this.submissionService.getSubmissions(/*0, 0, this.pageSize, (this.page - 1)*this.pageSize*/)
      .pipe(first()).subscribe(submissions => {
        if (submissions.length > 0) {
          ++this.page;
          for (let s of submissions) {
            this.submissions.push(s);
          }
          this.submissionDataSource.data = this.submissions;
          this.submissionDataSource.paginator = this.submissionsPaginator;
        }
    });
  }

  onTableScroll(e) {
    const tableViewHeight = e.target.offsetHeight; // viewport: ~500px
    const tableScrollHeight = e.target.scrollHeight; // length of all table
    const scrollLocation = e.target.scrollTop; // how far user scrolled
    console.log('onTableScroll');
    // If the user has scrolled within 200px of the bottom, add more data
    const buffer = 200;
    const limit = tableScrollHeight - tableViewHeight - buffer;    
    if (scrollLocation > limit) {
       this.loadMoreSubmissions();
    }
  }
}
