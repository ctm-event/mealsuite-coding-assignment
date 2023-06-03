import { Injectable } from '@angular/core';
import { BackendService } from '../backend.service';

@Injectable()
export class HttpClientService {
  constructor(private backend: BackendService) { }
  
}