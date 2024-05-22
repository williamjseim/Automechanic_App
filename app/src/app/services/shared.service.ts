import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private videoFile: File | null = null;
  private carIssueFormData: any
  
  constructor() { }


  setVideo(file: File): void {
    this.videoFile = file;
  }

  getVideo(): File | null {
    return this.videoFile;
  }

  setCarIssueData(data: any) {
    this.carIssueFormData = data;
  }
  getCarIssueData(): any  {
    return this.carIssueFormData;
  }
}
