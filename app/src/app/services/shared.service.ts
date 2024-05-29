import { Injectable } from '@angular/core';
import { NewIssue } from '../Interfaces/newIssue';
import { BehaviorSubject } from 'rxjs';
import { Car } from '../Interfaces/car';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private videoFile: File | null = null;
  private cars: Car[] = [];
  private formDataSubject = new BehaviorSubject<any>(null);
  formData$ = this.formDataSubject.asObservable();
  constructor() { }

  setFormData(data: any) {
    this.formDataSubject.next(data);
  }

  getFormData() {
    return this.formDataSubject.getValue();
  }

  setVideo(file: File): void {
    this.videoFile = file;
  }

  getVideo(): File | null {
    return this.videoFile;
  }

  setCars(cars: Car[]): void {
    this.cars = cars;
  }

  getCars(): Car[] {
    return this.cars;
  }
}
