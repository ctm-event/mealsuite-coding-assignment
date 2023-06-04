import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class Store<T> {
  private _subject: BehaviorSubject<T[]> = new BehaviorSubject([]);
  private readonly _observable$: Observable<T[]> = this._subject.asObservable();
  private _initialized: boolean = false;

  get isInitialized(): boolean {
    return this._initialized;
  }

  get data$(): Observable<T[]> {
    return this._observable$;
  }

  setData(data: T[]) {
    if (!this._initialized) this._initialized = true;
    this._subject.next(data);
  }

  getData(): T[] {
    return this._subject.value;
  }

  constructor() {}
}
