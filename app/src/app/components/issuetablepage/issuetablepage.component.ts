import { Component } from '@angular/core';
import { NgIf, NgFor, NgClass, DatePipe} from '@angular/common';
import { NgStyle } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CarDataService } from '../../services/car-data.service';
import { Issue } from '../../Interfaces/issue';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablePrefabComponent } from '../Prefabs/table-prefab/table-prefab.component';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-issuetablepage',
  standalone: true,
  imports: [RouterLink, DatePipe, ReactiveFormsModule, FormsModule, MatIconModule, MatInputModule, NgIf, NgFor, NgStyle, NgClass, MatProgressSpinnerModule, TablePrefabComponent],
  templateUrl: './issuetablepage.component.html',
  styleUrl: './issuetablepage.component.scss'
})
export class IssuetablepageComponent {
  constructor(
    private carhttp:CarDataService,
    private snackbar: MatSnackBar
  ){}
  pages:number = 1;
  currentPage:number = 0;


  issues?:Issue[];
  itemprpage = 10;

  ngOnInit(){
    this.RemoveFilters();
  }

  test(item:any):string{
    return JSON.stringify(item)
  }

  searchForm = new FormGroup ({
    make: new FormControl(),
    plate: new FormControl(),
    username: new FormControl(),
    category: new FormControl(),
  })

  SelectRow(index:number, event:Event){}

  Search(){
    let category = this.searchForm.controls.category.value;
    let make = this.searchForm.controls.make.value;
    let plate = this.searchForm.controls.plate.value;
    let username = this.searchForm.controls.username.value;
    this.GetIssuesHttp(category, make, plate, username);
    this.GetIssuePages(this.itemprpage, category, make, plate, username);
  }

  RemoveFilters(){
    this.searchForm.controls.make.reset("");
    this.searchForm.controls.plate.reset("");
    this.searchForm.controls.username.reset("");
    this.searchForm.controls.category.reset("");
    this.Search();
  }
  RemoveIssue(event:number){
    let issue = this.issues![event];
    this.carhttp.DeleteIssue(issue.id).subscribe({
      next: (res) => { 
        this.issues?.splice(event, 1);
        this.Search();
        this.snackbar.open(res.value, 'Close', { duration: 5000 });

       },
       error: (err) => {
        console.log(err);
         this.snackbar.open(err.error.value, 'Close', { duration: 5000 });

       }
    })
  }

  ChangeNumberPrPage(event:number){
    this.itemprpage = event;
    this.currentPage = 0;
    this.GetIssuePages(this.itemprpage);
    this.Search();
  }

  GetIssuesHttp(category: string  = "", make: string = "", plate: string = "", username: string = "") {
    this.carhttp.GetIssues(this.currentPage, this.itemprpage, category, make, plate, username).subscribe({
      next: (value) => {
        if (value.status == 200) {
          this.issues = value.body;
        }
        else {
          this.issues = [];
        }
      },
    });
  }
  JumpToPage(index:number) {
    if(index < 0){
      index = 0;
    }
    this.currentPage = index;
    this.Search();
  }

  GetIssuePages(itemprpage: number, username: string = "", make: string = "", plate: string = "", category: string = "" ){
     this.carhttp.GetIssuePageAmount(itemprpage, username, make, plate, category).subscribe({
      next: (res) => {
        this.pages = res
        if (this.currentPage >= this.pages) {
          this.currentPage = 0;
        }
      },
     });
  }
}