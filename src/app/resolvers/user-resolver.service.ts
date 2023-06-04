import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, first, tap } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { User } from '../shared/models/user.type';

@Injectable()
export class UserResolverService implements Resolve<User[]> {
  constructor(private userService: UserService) {}

  resolve(): Observable<User[]> {
    return this.userService.getUsers().pipe(
      tap(() => {
        if (!this.userService.isInitialized()) {
          this.userService.fetchUsers();
        }
      }),
      filter(() => this.userService.isInitialized()),
      first()
    );
  }
}
