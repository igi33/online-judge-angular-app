import { Component, OnInit } from '@angular/core';
import { TaskService } from './services/task.service';
import { Task } from './models/Task';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'online-judge-angular-app';
  tasks: Task[] = [];

  constructor(
    private taskService: TaskService,
  ) {}

  ngOnInit(): void {
    this.taskService.getTasks(0, 0).pipe(first()).subscribe(tasks => {
      this.tasks = tasks;
    });
  }

}
