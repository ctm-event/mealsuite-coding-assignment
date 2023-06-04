import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/shared/models/task.type';

@Component({
  selector: 'app-task-detail',
  templateUrl: 'task-detail.component.html'
})
export class TaskDetailComponent implements OnInit {
  task$: Observable<Task>;

  constructor(
    private store: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.initTask();
  }

  goToList() {
    this.router.navigateByUrl('tasks');
  }

  private initTask() {
    const id = this.route.snapshot.params.id;
    this.task$ = this.store.getTaskById(+id);
  }
}
