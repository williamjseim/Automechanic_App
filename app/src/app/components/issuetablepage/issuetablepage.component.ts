import { Component, ElementRef, Input, ViewChild, viewChild } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { NgIf, NgFor, NgClass} from '@angular/common';
import { NgStyle } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CarDataService } from '../../services/car-data.service';
import { Issue } from '../../Interfaces/issue';
import {MatSelectModule} from '@angular/material/select';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteRequestPopupComponent } from '../delete-request-popup/delete-request-popup.component';
import { Observable, of } from 'rxjs';
import { Category } from '../../Interfaces/category';

@Component({
  selector: 'app-issuetablepage',
  standalone: true,
  imports: [AsyncPipe, DatePipe, DeleteRequestPopupComponent, RouterLink, ReactiveFormsModule, FormsModule, MatIconModule, MatButtonModule, NgIf, NgFor, NgStyle, NgClass, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './issuetablepage.component.html',
  styleUrl: './issuetablepage.component.scss'
})
export class IssuetablepageComponent {
  constructor(private carhttp:CarDataService){}
  pages:number = 1;
  currentPage:number = 0;
  categories: Category[] = [];
  isAdmin:Observable<boolean> = of(true);

  issues?:Issue[];
  itemprpage = 10;

  ngOnInit(){
    this.getCategories()
    this.RemoveFilters();
  }

  searchForm = new FormGroup ({
    username: new FormControl(),
    make: new FormControl(),
    plate: new FormControl(),
    category: new FormControl(),
  })

  SelectRow(index:number, event:Event){}

  Search(){
    let username = this.searchForm.controls.username.value;
    let make = this.searchForm.controls.make.value;
    let plate = this.searchForm.controls.plate.value;
    let category = this.searchForm.controls.category.value;
    this.carhttp.GetIssues(this.currentPage, this.itemprpage, username, plate, make, category).subscribe({
      next:(value)=>{
        let asd = localStorage.getItem("isadmin") ?? "false";
        this.isAdmin = of(JSON.parse(asd) as boolean);
        if(value.status == 200){
          this.issues = value.body;
        }
        else{
          this.issues = [];
        }
      },
      error:(err)=>{
        this.issues = [];
      }
    })
  }

  RemoveFilters(){
    this.searchForm.controls.make.reset("");
    this.searchForm.controls.plate.reset("");
    this.searchForm.controls.username.reset("");
    this.searchForm.controls.category.reset("");
    this.Search();
  }
  RemoveIssue(index:number){
    let issue = this.issues![index];
    this.carhttp.DeleteIssue(issue.id).subscribe({
      next: (value) => {
        this.issues?.splice(index, 1);
        this.Search();
      }
    });
  }

  ChangeNumberPrPage(event:Event){
    this.itemprpage = JSON.parse((event.target as HTMLSelectElement).value)
    this.currentPage = 0;
    this.GetIssuePages(this.itemprpage);
    this.Search();
  }

  JumpToPage(index:number){
    if(index < 0){
      index = 0;
    }
    this.currentPage = index;
    this.Search();
  }

  GetIssuePages(itemprpage:number){

  }

  getCategories() {
    this.carhttp.GetCarCategories()
      .subscribe(res => {
        console.log(res);
        this.categories = res;
      });
  }
}
