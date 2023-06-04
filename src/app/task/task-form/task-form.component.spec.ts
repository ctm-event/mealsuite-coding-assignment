import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  waitForAsync
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { BackendService } from 'src/app/backend.service';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/shared/models/task.type';
import { TaskModule } from '../task.module';
import { TaskFormComponent } from './task-form.component';

const mockTasks: Task[] = [
  {
    id: 0,
    description: 'Install a monitor arm',
    assigneeId: 111,
    completed: false
  },
  {
    id: 1,
    description: 'Move the desk to the new location',
    assigneeId: 111,
    completed: false
  }
];

describe('TaskFormComponent', () => {
  let fixture: ComponentFixture<TaskFormComponent>;
  let component: TaskFormComponent;
  let elm: DebugElement;
  let TaskService: any;

  beforeEach(waitForAsync(() => {
    const TaskServiceSpy = jasmine.createSpyObj('TaskService', [
      'getTasks',
      'getUsers'
    ]);

    TestBed.configureTestingModule({
      imports: [TaskModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: BackendService, useValue: new BackendService() },
        { provide: TaskService, useValue: TaskServiceSpy }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TaskFormComponent);
        component = fixture.componentInstance;
        elm = fixture.debugElement;
        TaskService = TestBed.inject(TaskService);
      });
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should contains description input field', () => {
    const descElm = elm.query(By.css('input#description'));
    expect(descElm).toBeTruthy();
  });

  // it('should display task list', () => {
  //   TaskService.getTasks.and.returnValue(of(mockTasks));
  //   fixture.detectChanges();
  //   const taskElms = elm.queryAll(By.css('.task-item'));
  //   expect(taskElms.length).toBe(2, 'Unexpected number of elements found');
  // });

  // it('should display add task form when click on New Task button', fakeAsync(() => {
  //   spyOn(component, 'showTaskForm').and.callThrough();
  //   fixture.detectChanges();

  //   const newTaskBtn = elm.query(By.css('#new-task-btn'));
  //   expect(newTaskBtn).toBeTruthy();

  //   newTaskBtn.nativeElement.click();
  //   expect(component.showTaskForm).toHaveBeenCalled();

  //   fixture.detectChanges();
  //   flush();

  //   const taskForm = elm.query(By.css('app-task-form'));
  //   expect(taskForm).toBeTruthy();
  // }));
});
