import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ComputerLanguageService } from 'src/app/core/services/computer-language.service';
import { SubmissionService } from 'src/app/core/services/submission.service';
import { TaskService } from 'src/app/core/services/task.service';
import { ComputerLanguage } from '../../models/computer-language';
import { Submission } from '../../models/submission';
import { Task } from '../../models/Task';
import { User } from '../../models/User';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, OnDestroy {
  task: Task;
  taskSubscription: Subscription;
  currentUser: User;
  computerLanguages: ComputerLanguage[] = [];
  bestSolutions: Submission[] = [];
  taskForm: FormGroup = new FormGroup({
    lang_id: new FormControl('', Validators.required),
    source_code: new FormControl('', Validators.required),
  });

  sideNavOpen: boolean = true;
  mode: string = 'side';
  @ViewChildren(MatExpansionPanel) panel: QueryList<MatExpansionPanel>;

  constructor(
    private alertService: AlertService,
    private authService: AuthenticationService,
    private taskService: TaskService,
    private submissionService: SubmissionService,
    private langService: ComputerLanguageService,
    public breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadTask();
    if (this.authService.isLoggedIn()) {
      this.loadLangs();
    }

    // screen size observer
    this.breakpointObserver
      .observe(['(min-width: 1280px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          // viewport > 1280
          this.mode = 'side';
        } else {
          // viewport < 1280
          this.mode = 'over';
        }
    });
  }

  loadTask(): void {
    this.taskSubscription = this.route.params.subscribe((params: Params) => {
      const id = +params['id'];
      this.taskService.getTask(id).pipe(first()).subscribe(resp => {
        this.task = resp;
      });
      this.submissionService.getBestSubmissionsOfTask(id, 10).pipe(first()).subscribe(resp => {
        this.bestSolutions = resp;
      });
    });
  }

  loadLangs(): void {
    this.langService.getComputerLanguages().pipe(first()).subscribe(resp => {
      this.computerLanguages = resp;
    });
  }

  onSubmit(): void {
    let solution = new Submission ({
      langId: this.taskForm.get('lang_id').value,
      sourceCode: this.taskForm.get('source_code').value,
    });
    this.submissionService.postSubmission(this.task.id, solution).pipe(first()).subscribe(
      resp => {
        this.router.navigate(['/submissions'], {queryParams: {selectedId: resp.id}});
      });
  }

  onKey(e) {
    if (e.key == 'Tab') {
      e.preventDefault();

      let el = e.target;

      var start = el.selectionStart;
      var end = el.selectionEnd;
  
      // set textarea value to: text before caret + tab + text after caret
      el.value = el.value.substring(0, start) + "\t" + el.value.substring(end);
  
      // put caret at right position again
      el.selectionStart = el.selectionEnd = start + 1;
    }
  }

  validURL(str: string): boolean {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }

  ngOnDestroy(): void {
    this.taskSubscription.unsubscribe();
  }
}
