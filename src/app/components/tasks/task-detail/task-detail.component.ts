import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { delay, delayWhen, filter, skipUntil, tap } from 'rxjs/operators';
import { StoreService } from 'src/app/services/store.service';
import { Task } from 'src/app/task.type';

@Component({
  selector: 'app-task-detail',
  templateUrl: 'task-detail.component.html'
})
export class TaskDetailComponent implements OnInit {
  task$: Observable<Task>;

  constructor(
    private store: StoreService,
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
