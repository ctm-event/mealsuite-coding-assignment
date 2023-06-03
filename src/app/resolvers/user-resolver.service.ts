import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, first, tap } from 'rxjs/operators';
import { StoreService } from 'src/app/services/store.service';
import { Task } from 'src/app/task.type';
import { User } from '../user.type';

@Injectable()
export class UserResolverService implements Resolve<User[]> {
  constructor(private store: StoreService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
    return this.store.getUsers().pipe(
      tap((users: User[]) => {
        if (!this.store.isUserLoaded()) {
          this.store.fetchUsers();
        }
      }),
      filter((users) => {
        return this.store.isUserLoaded();
      }),
      first()
    );
  }
}
