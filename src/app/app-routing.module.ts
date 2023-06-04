import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskListComponent } from './task/task-list/task-list.component';
import { TaskResolverService } from './resolvers/task-resolver.service';
import { UserResolverService } from './resolvers/user-resolver.service';
import { TaskDetailComponent } from './task/task-detail/task-detail.component';
import { ServiceUnavailableComponent } from './shared/components/service-unavailable/service-unavailable.component';

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
    path: 'service-unavailable',
    component: ServiceUnavailableComponent
  },
  {
    path: '**',
    redirectTo: 'tasks'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [TaskResolverService, UserResolverService],
  exports: [RouterModule]
})
export class AppRoutingModule {}
