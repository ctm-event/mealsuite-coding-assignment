import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { BackendService } from '../backend.service';
import { TASK_STORE } from '../shared/injection-tokens';
import { Task, UpdateTaskPayload } from '../shared/models/task.type';
import { User } from '../shared/models/user.type';
import { Store } from '../shared/store';
import { UserService } from './user.service';

@Injectable()
export class TaskService {
  constructor(
    private backend: BackendService,
    private router: Router,
    private userService: UserService,
    @Inject(TASK_STORE) private taskStore: Store<Task>
  ) {}

  isInitialized() {
    return this.taskStore.isInitialized;
  }

  fetchTasks(): void {
    this.backend
      .tasks()
      .pipe(
        catchError((err) => {
          alert(err);
          this.router.navigateByUrl('service-unavailable');
          return of(null);
        }),
        tap((tasks: Task[]) => {
          this.taskStore.setData(tasks);
        })
      )
      .subscribe();
  }

  createTask(payload: { description: string }): Observable<Task> {
    return this.backend.newTask(payload).pipe(
      catchError((err) => {
        alert(err);
        return of(null);
      }),
      filter((task) => !!task),
      tap((task) => {
        const latestTasks = this.taskStore.getData();
        this.taskStore.setData([...latestTasks, task]);
      })
    );
  }

  updateTask(taskId: number, updates: UpdateTaskPayload) {
    return this.backend.update(taskId, updates).pipe(
      catchError((err) => {
        alert(err);
        return of(null);
      }),
      tap((task: Task) => this.afterUpdateTaskHook(task))
    );
  }

  getTasks(): Observable<Task[]> {
    return this.taskStore.data$.pipe(
      withLatestFrom(this.userService.getUsers()),
      map(([tasks, users]: [Task[], User[]]) =>
        tasks.map((task) => ({
          ...task,
          assignee: users.find(
            (user) => String(user.id) == String(task.assigneeId)
          )
        }))
      )
    );
  }

  getTaskById(id: number): Observable<Task> {
    return this.getTasks().pipe(
      map((tasks: Task[]) => {
        return tasks.find((task: Task) => String(task.id) === String(id));
      })
    );
  }

  toggleCompleteStatus(id: number, complete: boolean) {
    return this.backend.complete(id, complete).pipe(
      catchError((err) => {
        alert(err);
        return of(null);
      }),
      tap((task: Task) => this.afterUpdateTaskHook(task))
    );
  }

  assign(taskId: number, userId: number) {
    return this.backend.assign(taskId, userId).pipe(
      catchError((err) => {
        alert(err);
        return of(null);
      }),
      tap((task: Task) => this.afterUpdateTaskHook(task))
    );
  }

  private afterUpdateTaskHook(task: Task) {
    if (!task) return;
    const latestTasks = this.taskStore.getData();
    const index = latestTasks.findIndex((t) => t.id === task.id);
    if (index !== -1) {
      latestTasks[index] = {
        ...task
      };
    }
    this.taskStore.setData(latestTasks);
  }
}
