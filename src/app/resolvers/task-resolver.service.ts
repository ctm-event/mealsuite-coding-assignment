import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, first, tap } from 'rxjs/operators';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/shared/models/task.type';

@Injectable()
export class TaskResolverService implements Resolve<Task[]> {
  constructor(
    private taskService: TaskService,
  ) {}

  resolve(): Observable<Task[]> {
    return this.taskService.getTasks().pipe(
      tap(() => {
        if (!this.taskService.isInitialized()) {
          this.taskService.fetchTasks();
        }
      }),
      filter(() => this.taskService.isInitialized()),
      first()
    );
  }
}
