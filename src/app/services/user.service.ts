import { Inject, Injectable } from '@angular/core';
import { BackendService } from '../backend.service';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { USER_STORE } from '../shared/injection-tokens';
import { Store } from '../shared/store';
import { User } from '../shared/models/user.type';

@Injectable()
export class UserService {
  constructor(
    private backend: BackendService,
    private router: Router,
    @Inject(USER_STORE) private userStore: Store<User>
  ) {}

  isInitialized() {
    return this.userStore.isInitialized;
  }

  fetchUsers(): void {
    this.backend
      .users()
      .pipe(
        catchError(() => {
          this.router.navigateByUrl('service-unavailable');
          return of(null);
        }),
        tap((users: User[]) => {
          if (!!users) this.userStore.setData(users);
        })
      )
      .subscribe();
  }

  getUsers(): Observable<User[]> {
    return this.userStore.data$;
  }
}
