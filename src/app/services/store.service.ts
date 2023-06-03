import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Task, UpdateTaskPayload } from '../task.type';
import { BackendService } from '../backend.service';
import {
  tap,
  map,
  filter,
  first,
  catchError,
  withLatestFrom
} from 'rxjs/operators';
import { User } from '../user.type';

@Injectable()
export class StoreService {
  private taskLoaded: boolean = false;
  private readonly tasks: BehaviorSubject<Task[]> = new BehaviorSubject([]);
  private readonly tasks$: Observable<Task[]> = this.tasks.asObservable();

  private userLoaded: boolean = false;
  private readonly users: BehaviorSubject<User[]> = new BehaviorSubject([]);
  private readonly users$: Observable<User[]> = this.users.asObservable();

  constructor(private backend: BackendService) {}

  isTaskLoaded(): boolean {
    return !!this.taskLoaded;
  }

  isUserLoaded(): boolean {
    return !!this.userLoaded;
  }

  fetchTasks(): void {
    this.backend
      .tasks()
      .pipe(
        tap((tasks: Task[]) => {
          this.taskLoaded = true;
          this.tasks.next(tasks);
        })
      )
      .subscribe();
  }

  fetchUsers(): void {
    this.backend
      .users()
      .pipe(
        tap((users: User[]) => {
          this.userLoaded = true;
          this.users.next(users);
        })
      )
      .subscribe();
  }

  createTask(payload: { description: string }): Observable<Task> {
    return this.backend.newTask(payload).pipe(
      catchError((err) => {
        alert(err);
        return of(err);
      }),
      tap((task) => {
        const latestTasks = this.tasks.value;
        this.tasks.next([...latestTasks, task]);
      })
    );
  }

  updateTask(taskId: number, updates: UpdateTaskPayload) {
    return this.backend.update(taskId, updates).pipe(
      catchError((err) => {
        alert(err);
        return of(err);
      }),
      tap((task: Task) => this.afterUpdateTaskHook(task))
    );
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$.pipe(
      withLatestFrom(this.getUsers()),
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

  getUsers(): Observable<User[]> {
    return this.users$;
  }

  getTaskById(id: number): Observable<Task> {
    return this.getTasks().pipe(
      map((tasks: Task[]) => {
        return tasks.find((task: Task) => String(task.id) === String(id));
      })
    );
  }

  setCompleted(id: number) {
    this.backend.complete(id, true);
  }

  setUncompleted(id: number) {
    this.backend.complete(id, false);
  }

  toggleCompleteStatus(id: number, complete: boolean) {
    return this.backend
      .complete(id, complete)
      .pipe(tap((task: Task) => this.afterUpdateTaskHook(task)));
  }

  assign(taskId: number, userId: number) {
    return this.backend
      .assign(taskId, userId)
      .pipe(tap((task: Task) => this.afterUpdateTaskHook(task)));
  }

  private afterUpdateTaskHook(task: Task) {
    const latestTasks = this.tasks.value;
    const index = latestTasks.findIndex((t) => t.id === task.id);
    if (index !== -1) {
      latestTasks[index] = {
        ...task
      };
    }
    this.tasks.next(latestTasks);
  }
}
