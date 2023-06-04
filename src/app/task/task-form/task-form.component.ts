import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators
} from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';
import { Task, UpdateTaskPayload } from 'src/app/shared/models/task.type';
import { User } from 'src/app/shared/models/user.type';

@Component({
  selector: 'app-task-form',
  templateUrl: 'task-form.component.html',
  styleUrls: ['task-form.component.css']
})
export class TaskFormComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  isSubmitting: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isEditMode: boolean = false;
  users$: Observable<User[]>;

  private _task: Task = {
    id: null,
    assigneeId: null,
    description: null,
    completed: false
  };

  @Input()
  set task(task: Task) {
    this._task = task;
    this.isEditMode = this._task.id !== null;
  }

  get task() {
    return this._task;
  }

  @ViewChild('descElm')
  descElm: ElementRef;

  @Output()
  onCancelEvent: EventEmitter<void> = new EventEmitter();

  @Output()
  afterSubmitEvent: EventEmitter<void> = new EventEmitter();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.initForm();
    if (this.isEditMode) {
      this.loadUsers();
    }
    this.applyExtraBehaviors();
  }

  onSubmit(ngForm: FormGroupDirective) {
    if (this.form.invalid) return;

    const submit$: Observable<Task> = this.createSubmitObservable();

    this.beforeSubmitHook();

    this.subscription.add(
      submit$.pipe(finalize(() => this.afterSubmitHook())).subscribe(() => {
        if (!this.isEditMode) {
          this.setFocusOnDesc();
          ngForm.resetForm();
        }
        this.afterSubmitEvent.emit();
      })
    );
  }

  onCancel() {
    this.onCancelEvent.emit();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private setFocusOnDesc() {
    setTimeout(() => {
      this.descElm.nativeElement.focus();
    });
  }

  private initForm() {
    if (this.isEditMode) {
      this.initEditTaskForm();
      return;
    }
    this.initNewTaskForm();
  }

  private initNewTaskForm() {
    this.form = this.fb.group({
      description: [this.task.description, Validators.required]
    });
  }

  private initEditTaskForm() {
    this.form = this.fb.group({
      description: [this.task.description, Validators.required],
      assigneeId: [this.task.assigneeId],
      completed: [this.task.completed]
    });
  }

  private loadUsers() {
    this.users$ = this.userService.getUsers();
  }

  private applyExtraBehaviors() {
    this.setFocusOnDesc();
  }

  private createSubmitObservable(): Observable<Task> {
    return this.isEditMode ? this.update() : this.create();
  }

  private create(): Observable<Task> {
    const description = this.form.get('description').value;
    return this.taskService.createTask({ description });
  }

  private update(): Observable<Task> {
    const updates: UpdateTaskPayload = this.form.value;
    return this.taskService.updateTask(this.task.id, updates);
  }

  private beforeSubmitHook() {
    this.form.disable();
    this.isSubmitting.next(true);
  }

  private afterSubmitHook() {
    this.isSubmitting.next(false);
   this.form.enable();
  }
}
