import { Injectable } from '@angular/core';
import { NewIssue } from '../Interfaces/newIssue';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private videoFile: File | null = null;
  private carIssueFormData: NewIssue | null = null
  
  constructor() { }


  setVideo(file: File): void {
    this.videoFile = file;
  }

  getVideo(): File | null {
    return this.videoFile;
  }

  setCarIssueData(data: NewIssue) {
    this.carIssueFormData = data;
  }
  getCarIssueData(): NewIssue | null  {
    return this.carIssueFormData;
  }
}
