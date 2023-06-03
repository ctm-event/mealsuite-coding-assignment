import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  finalize,
  map
} from 'rxjs/operators';
import { StoreService } from 'src/app/services/store.service';
import { Task, TaskViewFilter } from 'src/app/task.type';
import { User } from 'src/app/user.type';

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

  constructor(private store: StoreService) {}

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

  assign(taskId: number, userId: string) {
    this.submitting.next(true);
    this.store
      .assign(taskId, +userId)
      .pipe(finalize(() => this.submitting.next(false)))
      .subscribe();
  }

  toggleCompleteStatus(task: Task) {
    this.submitting.next(true);
    const updateCompleteStatus = task.completed === false;
    this.store
      .toggleCompleteStatus(task.id, updateCompleteStatus)
      .pipe(finalize(() => this.submitting.next(false)))
      .subscribe();
  }

  setFilter(fieldName: keyof TaskViewFilter, value: string) {
    this.viewFilter[fieldName] = value;
    this.applyFilter();
  }

  private applyFilter() {
    let filteredTasks$ = this.store.getTasks();
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
    this.tasks$ = this.store.getTasks();
  }

  private loadUsers() {
    this.users$ = this.store.getUsers();
  }
}
