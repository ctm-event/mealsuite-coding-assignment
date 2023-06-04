import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TaskService } from '../services/task.service';
import { UserService } from '../services/user.service';
import { TASK_STORE, USER_STORE } from '../shared/injection-tokens';
import { Task } from '../shared/models/task.type';
import { User } from '../shared/models/user.type';
import { Store } from '../shared/store';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskListComponent } from './task-list/task-list.component';
import { BackendService } from '../backend.service';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  exports: [],
  declarations: [TaskListComponent, TaskDetailComponent, TaskFormComponent],
  providers: [
    BackendService,
    TaskService,
    UserService,
    {
      provide: USER_STORE,
      useFactory: () => {
        return new Store<User>();
      }
    },
    {
      provide: TASK_STORE,
      useFactory: () => {
        return new Store<Task>();
      }
    }
  ]
})
export class TaskModule {}
