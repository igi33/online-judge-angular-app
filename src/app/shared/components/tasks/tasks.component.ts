import { Component, OnInit, NgZone, ViewChildren, QueryList } from '@angular/core';
import { ScrollDispatcher } from '@angular/cdk/overlay';
import { Tag } from '../../models/tag';
import { TaskService } from 'src/app/core/services/task.service';
import { TagService } from 'src/app/core/services/tag.service';
import { MatExpansionPanel } from '@angular/material/expansion';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Task } from '../../models/Task';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  page: number = 1;
  pageSize: number = 10;
  tags: Tag[] = [];
  tagId: number = 0;
  mode: string = 'side';
  sideNavOpen: boolean = true;
  @ViewChildren(MatExpansionPanel) panel: QueryList<MatExpansionPanel>;

  constructor(
    private taskService: TaskService,
    private tagService: TagService,
    public breakpointObserver: BreakpointObserver,
    public scroll: ScrollDispatcher
  ) {}

  ngOnInit() {
    this.loadMoreTasks();
    this.loadTags();

    // screen size observer
    this.breakpointObserver
      .observe(['(min-width: 1280px)'])
      .subscribe({
        next: (state: BreakpointState) => {
          if (state.matches) {
            // viewport > 1280
            this.mode = 'side';
          } else {
            // viewport < 1280
            this.mode = 'over';
          }
        }
    });
  }

  private loadTags() {
    this.tagService.getTags().subscribe({
      next: data => {
        this.tags = data;
      }
    });
  }

  public loadMoreTasks(reload: boolean = false) {
    if (reload) {
      this.page = 1;
      this.tasks = [];
    }
    this.taskService.getTasks(this.tagId/*, this.pageSize, (this.page - 1)*this.pageSize*/)
      .subscribe({
        next: data => {
          if (data.length > 0) {
            ++this.page;
            for (let task of data) {
              this.tasks.push(task);
            }
          }
        }
    });
  }

  public setTag(tagId: number): void {
    this.tagId = tagId;
    this.loadMoreTasks(true);
  }

  private getDate(date: string) {
    return new Date(date);
  }
}
