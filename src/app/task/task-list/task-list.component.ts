import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';
import { Task, TaskViewFilter } from 'src/app/shared/models/task.type';
import { User } from 'src/app/shared/models/user.type';

@Component({
  selector: 'app-task-list',
  templateUrl: 'task-list.component.html',
  styleUrls: ['task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<Task[]>;
  users$: Observable<User[]>;
  isShowTaskForm: boolean = false;
  submitting: BehaviorSubject<boolean> = new BehaviorSubject(false);
  viewFilter: TaskViewFilter = {
    assigneeId: '',
    completed: ''
  };

  constructor(
    private taskService: TaskService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadTasks();
    this.loadUsers();
  }

  showTaskForm() {
    this.isShowTaskForm = true;
  }

  hideTaskForm() {
    this.isShowTaskForm = false;
  }

  assign(taskId: number, userId: number) {
    this.submitting.next(true);
    this.taskService
      .assign(taskId, userId)
      .pipe(finalize(() => this.submitting.next(false)))
      .subscribe((updatedTask) => {
        if (!updatedTask) {
          this.loadTasks();
        }
      });
  }

  toggleCompleteStatus(task: Task) {
    this.submitting.next(true);
    const newValue = task.completed === false;
    this.taskService
      .toggleCompleteStatus(task.id, newValue)
      .pipe(finalize(() => this.submitting.next(false)))
      .subscribe((updatedTask) => {
        if (!updatedTask) {
          this.loadTasks();
        }
      });
  }

  onFilterChange(fieldName: keyof TaskViewFilter, value: string) {
    this.viewFilter[fieldName] = value;
    this.applyFilter();
  }

  private applyFilter() {
    let filteredTasks$ = this.taskService.getTasks();
    for (const field in this.viewFilter) {
      if (this.viewFilter[field] === '') continue;
      filteredTasks$ = filteredTasks$.pipe(
        map((tasks) =>
          tasks.filter((task) => String(task[field]) === this.viewFilter[field])
        )
      );
    }

    this.tasks$ = filteredTasks$;
  }

  private loadTasks() {
    this.tasks$ = this.taskService.getTasks();
  }

  private loadUsers() {
    this.users$ = this.userService.getUsers();
  }
}
