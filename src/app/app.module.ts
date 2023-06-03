import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BackendService } from './backend.service';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreService } from './services/store.service';
import { TaskListComponent } from './components/tasks/task-list/task-list.component';
import { TaskDetailComponent } from './components/tasks/task-detail/task-detail.component';
import { TaskResolverService } from './resolvers/task-resolver.service';
import { CommonModule } from '@angular/common';
import { TaskFormComponent } from './components/tasks/task-form/task-form.component';
import { UserResolverService } from './resolvers/user-resolver.service';
import { HttpClientService } from './services/http-client.service';

const routes: Routes = [
  {
    path: 'tasks',
    component: TaskListComponent,
    resolve: [TaskResolverService, UserResolverService]
  },
  {
    path: 'tasks/:id',
    component: TaskDetailComponent,
    resolve: [TaskResolverService, UserResolverService]
  },
  {
    path: '**',
    redirectTo: 'tasks'
  }
];
@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent,
    TaskDetailComponent,
    TaskFormComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    BackendService,
    StoreService,
    TaskResolverService,
    UserResolverService,
    HttpClientService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
