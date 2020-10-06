import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/core/services/alert.service';
import { TaskService } from 'src/app/core/services/task.service';
import { Tag } from '../../models/tag';
import { Task } from '../../models/Task';
import { TestCase } from '../../models/test-case';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit, OnDestroy {
  taskForm: FormGroup = new FormGroup({
    task_name: new FormControl('', Validators.required),
    task_description: new FormControl('', Validators.required),
    task_time_limit: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    task_memory_limit: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
    task_origin: new FormControl(''),
    task_tags: new FormControl(''),
    task_test_cases: new FormArray([
      new FormGroup({input: new FormControl(''), output: new FormControl('')}),
      new FormGroup({input: new FormControl(''), output: new FormControl('')}),
    ]),
  });
  task: Task;
  id: number = 0; // if zero, a new task is being created
  testCaseCount: number = 2;
  taskSubscription: Subscription;
  
  constructor(
    private alertService: AlertService,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.taskSubscription = this.route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.id = +paramMap.get('id');
        this.taskService.getTask(this.id).pipe(first()).subscribe(resp => {
          this.task = resp;

          this.testCaseCount = this.task.testCases.length;
          this.updateTestCaseControls(this.testCaseCount);
          for (let i = 0; i < this.testCaseCount; ++i) {
            this.taskForm.get(`task_test_cases.${i}.input`).setValue(this.task.testCases[i].input);
            this.taskForm.get(`task_test_cases.${i}.output`).setValue(this.task.testCases[i].output);
          }

          this.taskForm.patchValue({
            task_name: this.task.name,
            task_description: this.task.description,
            task_time_limit: this.task.timeLimit,
            task_memory_limit: this.task.memoryLimit,
            task_origin: this.task.origin,
            task_tags: this.task.tags.map(t => t.name).join(', '),
          });
        });
      }
    });
  }
  
  // test case number slider change
  public sliderChange(e) {
    this.updateTestCaseControls(this.testCaseCount);
  }

  // update and fill test case controls
  private updateTestCaseControls(n: number): void {
    let diff = n - (this.taskForm.get('task_test_cases') as FormArray).length;

    if (diff > 0) {
      for (let i = 0; i < diff; ++i) {
        (this.taskForm.get('task_test_cases') as FormArray).push(new FormGroup({input: new FormControl(''), output: new FormControl('')}));
      }
    } else {
      for (let i = 0; i < -diff; ++i) {
        (this.taskForm.get('task_test_cases') as FormArray).removeAt((this.taskForm.get('task_test_cases') as FormArray).length-1);
      }
    }
  }

  // collect task info from form and populate model
  onSubmit(): void {
    // gather test cases
    let testCases: TestCase[] = [];
    for (let i = 0; i < this.testCaseCount; ++i) {
      let input = this.taskForm.get(`task_test_cases.${i}.input`).value;
      let output = this.taskForm.get(`task_test_cases.${i}.output`).value;

      if (input || output) {
        testCases.push(new TestCase({input: input, output: output}));
      }
    }

    // check if test case set is non empty
    if (testCases.length == 0) {
      this.alertService.error('There must be at least one test case!');
      return;
    }

    // explode tags string and populate array of Tag models
    let tags: Tag[] = [];
    let tagText: string = this.taskForm.get('task_tags').value;

    if (tagText) {
      let parts = tagText.split(',');
      parts.forEach(part => {
        let tagName = part.trim();
        if (tagName) {
            tags.push(new Tag({
                name: tagName,
            }));
        }
      });
    }

    // populate task model
    let task = new Task({
      name: this.taskForm.get('task_name').value,
      description: this.taskForm.get('task_description').value,
      timeLimit: this.taskForm.get('task_time_limit').value,
      memoryLimit: this.taskForm.get('task_memory_limit').value,
      origin: this.taskForm.get('task_origin').value,
      tags: tags,
      testCases: testCases,
    });

    // create new task or edit existing one
    if (this.id) {
      task.id = this.id;
      this.taskService.putTask(this.id, task).pipe(first()).subscribe(resp => {
        this.router.navigate(['/task', this.id]);
        this.alertService.success('The task has successfully been edited!')
      });
    } else {
      this.taskService.postTask(task).pipe(first()).subscribe(resp => {
        this.router.navigate(['/task', resp.id]);
      });
    }

  }

  ngOnDestroy(): void {
    this.taskSubscription.unsubscribe();
  }
}
