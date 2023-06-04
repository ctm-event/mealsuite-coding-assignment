import { InjectionToken } from "@angular/core";
import { Task } from "./models/task.type";
import { User } from "./models/user.type";
import { Store } from "./store";

export const USER_STORE = new InjectionToken<Store<User>>('UserStore');
export const TASK_STORE = new InjectionToken<Store<Task>>('TaskStore');
