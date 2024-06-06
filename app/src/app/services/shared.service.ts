import { Injectable } from '@angular/core';
import { NewIssue } from '../Interfaces/newIssue';
import { BehaviorSubject } from 'rxjs';
import { Car } from '../Interfaces/car';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private formDataSubject = new BehaviorSubject<any>(null);
  formData$ = this.formDataSubject.asObservable();
  constructor() { }

  setFormData(data: any) {
    this.formDataSubject.next(data);
  }

  getFormData() {
    return this.formDataSubject.getValue();
  }
}
