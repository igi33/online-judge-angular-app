import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { TaskService } from "src/app/core/services/task.service";
import { Task } from "../models/Task";

export class SolvedTasksDataSource implements DataSource<Task> {
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  constructor(private taskService: TaskService) {}

  connect(collectionViewer: CollectionViewer): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.tasksSubject.complete();
  }

  loadSolvedTasks(userId: number, pageSize: number = 10, pageIndex: number = 0) {
    this.taskService.getSolvedTasksByUser(userId, pageSize, pageIndex * pageSize)
      .subscribe(tasks => this.tasksSubject.next(tasks));
  }
}
