import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AlertService } from 'src/app/core/services/alert.service';
import { TaskService } from 'src/app/core/services/task.service';
import { TestCaseService } from 'src/app/core/services/test-case.service';
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
    task_time_limit: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(10000), Validators.pattern("^[0-9]*$")]),
    task_memory_limit: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(268435456), Validators.pattern("^[0-9]*$")]),
    task_origin: new FormControl(''),
    task_tags: new FormControl(''),
    task_test_cases: new FormArray([
      new FormGroup({remove: new FormControl('')}),
      new FormGroup({remove: new FormControl('')}),
    ]),
  });
  task: Task;
  id: number = 0; // if zero, a new task is being created
  testCaseCount: number = 2;
  taskSubscription: Subscription;
  inputFiles = new Map<number, File>();
  outputFiles = new Map<number, File>();
  btnTextInputs: string[];
  btnTextOutputs: string[];
  processingForm = false;
  
  constructor(
    private alertService: AlertService,
    private taskService: TaskService,
    private testCaseService: TestCaseService,
    private route: ActivatedRoute,
    private router: Router) {
      this.btnTextInputs = [];
      this.btnTextOutputs = [];
      for (let i = 0; i < this.testCaseCount; ++i) {
        this.btnTextInputs.push('Select input file');
        this.btnTextOutputs.push('Select output file');
      }
    }

  ngOnInit(): void {
    this.taskSubscription = this.route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.id = +paramMap.get('id');
        this.taskService.getTask(this.id).subscribe({
          next: data => {
            this.task = data;

            this.testCaseCount = this.task.testCases.length;
            this.updateTestCaseControls();

            this.taskForm.patchValue({
              task_name: this.task.name,
              task_description: this.task.description,
              task_time_limit: this.task.timeLimit,
              task_memory_limit: this.task.memoryLimit,
              task_origin: this.task.origin,
              task_tags: this.task.tags.map(t => t.name).join(', '),
            });
          }
        });
      }
    });
  }
  
  // convenience getter for easy access to form fields
  get f() { return this.taskForm.controls; }

  public downloadInput(idx: number): void {
    if (idx >= 0 && idx < this.task.testCases.length) {
      let id = this.task.testCases[idx].id;
      this.testCaseService.getTestCaseInput(id).subscribe(data => {
        this.downloadTextFile(id, data, 'in');
      });
    }
  }

  public downloadOutput(idx: number): void {
    if (idx >= 0 && idx < this.task.testCases.length) {
      let id = this.task.testCases[idx].id;
      this.testCaseService.getTestCaseOutput(id).subscribe(data => {
        this.downloadTextFile(id, data, 'out');
      });
    }
  }

  // force download file generated from string
  private downloadTextFile(id: number, data: Blob, ext: string = 'txt'): void {
    let binaryData = [data];
    let downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: 'blob'}));
    downloadLink.setAttribute('download', `${this.task.id}_${id}.${ext}`)
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  public handleFileInput(event, i, btn): void {
    const file = event.target.files[0];
    this.inputFiles.set(i, file);
    btn.color = "accent";
    this.btnTextInputs[i] = file.name;
  }

  public handleFileOutput(event, i, btn): void {
    const file = event.target.files[0];
    this.outputFiles.set(i, file);
    btn.color = "accent";
    this.btnTextOutputs[i] = file.name;
  }
  
  // test case number slider change
  public sliderChange(): void {
    this.updateTestCaseControls();
  }

  // update and fill test case controls
  private updateTestCaseControls(): void {
    let diff = this.testCaseCount - (this.taskForm.get('task_test_cases') as FormArray).length;

    if (diff > 0) {
      for (let i = 0; i < diff; ++i) {
        (this.taskForm.get('task_test_cases') as FormArray).push(new FormGroup({
          remove: new FormControl(''),
        }));
        this.btnTextInputs.push('Select input file');
        this.btnTextOutputs.push('Select output file');
      }
    } else {
      for (let i = 0; i < -diff; ++i) {
        const idx = (this.taskForm.get('task_test_cases') as FormArray).length-1;
        (this.taskForm.get('task_test_cases') as FormArray).removeAt(idx);
        this.btnTextInputs.pop();
        this.btnTextOutputs.pop();
        this.inputFiles.delete(idx);
        this.outputFiles.delete(idx);
      }
    }
  }

  // collect task info from form and populate form data
  submitTaskForm(): void {
    this.processingForm = true;

    let formData: FormData = new FormData();
    
    // gather new tcs
    let validTcNum = 0;
    const tcIdxSet = new Set<number>([...new Set<number>(this.inputFiles.keys()), ...new Set<number>(this.outputFiles.keys())]);
    tcIdxSet.forEach((key: number) => {
      if (this.inputFiles.has(key) || this.outputFiles.has(key)) {
        ++validTcNum;
        formData.append('inputs', this.inputFiles.has(key) ? this.inputFiles.get(key) : new File([""], key+".in", { type: 'text/plain' }));
        formData.append('outputs', this.outputFiles.has(key) ? this.outputFiles.get(key) : new File([""], key+".out", { type: 'text/plain' }));
      }
    });
    
    // gather tcs for removal
    const tcs: TestCase[] = [];
    if (this.id) {
      const n = (this.taskForm.get('task_test_cases') as FormArray).length;
      for (let i = 0; i < n; ++i) {
        if (this.taskForm.get(`task_test_cases.${i}.remove`).value) {
          tcs.push(new TestCase({
            id: this.task.testCases[i].id,
          }));
        }
      }
    }

    if (!this.id && validTcNum == 0 || this.id && validTcNum == 0 && tcs.length == this.task.testCases.length) {
      this.alertService.error('There must be at least one test case!');
      return;
    }

    // explode tags string and populate array of Tag models
    let tags: Tag[] = [];
    let tagText: string = this.taskForm.get('task_tags').value;

    if (tagText) {
      tagText.split(',').forEach(part => {
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
      testCases: tcs,
    });
    
    // add task info as json string made from the model
    formData.append('taskDtoStr', JSON.stringify(task));

    // create new task or edit existing one
    if (this.id) {
      task.id = this.id;
      this.taskService.putTask(this.id, formData)
        .pipe(finalize(() => this.processingForm = false))
        .subscribe({
          next: _ => {
            this.router.navigate(['/task', this.id]);
            this.alertService.success('The task has successfully been edited!');
          }
      });
    } else {
      this.taskService.postTask(formData)
        .pipe(finalize(() => this.processingForm = false))
        .subscribe({
          next: data => {
            this.router.navigate(['/task', data.id]);
          }
      });
    }
  }

  ngOnDestroy(): void {
    this.taskSubscription.unsubscribe();
  }
}
