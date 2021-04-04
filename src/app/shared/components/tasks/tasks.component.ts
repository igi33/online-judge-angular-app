import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
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
  page: number = 0;
  pageSize: number = 12;
  tags: Tag[] = [];
  tagId: number = 0;
  mode: string = 'side';
  sideNavOpen: boolean = true;
  @ViewChildren(MatExpansionPanel) panel: QueryList<MatExpansionPanel>;

  constructor(
    private taskService: TaskService,
    private tagService: TagService,
    public breakpointObserver: BreakpointObserver,
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
      this.page = 0;
      this.tasks = [];
    }
    this.taskService.getTasks(this.tagId, this.pageSize, this.page * this.pageSize)
      .subscribe({
        next: data => {
          if (data.length > 0) {
            ++this.page;
            this.tasks.push(...data);
          }
        }
    });
  }

  public setTag(tagId: number): void {
    this.tagId = tagId;
    this.loadMoreTasks(true);
  }
}
