import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, first, tap } from 'rxjs/operators';
import { StoreService } from 'src/app/services/store.service';
import { Task } from 'src/app/task.type';

@Injectable()
export class TaskResolverService implements Resolve<Task[]> {
  constructor(private store: StoreService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Task[]> {
    return this.store.getTasks().pipe(
      tap((tasks: Task[]) => {
        if (!this.store.isTaskLoaded()) {
          this.store.fetchTasks();
        }
      }),
      filter((tasks) => {
        return this.store.isTaskLoaded();
      }),
      first()
    );
  }
}
