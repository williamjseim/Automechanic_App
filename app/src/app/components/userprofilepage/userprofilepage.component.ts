import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import {MatSelectModule, matSelectAnimations} from '@angular/material/select';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../Interfaces/user';
import { Issue } from '../../Interfaces/issue';
import { ActivatedRoute, Router } from '@angular/router';
import { CarDataService } from '../../services/car-data.service';
import { LoginService } from '../../services/login.service';
import { NotExpr } from '@angular/compiler';

@Component({
  selector: 'app-userprofilepage',
  standalone: true,
  imports: [NgIf, NgFor, MatSelectModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatIcon, FormsModule, ReactiveFormsModule],
  templateUrl: './userprofilepage.component.html',
  styleUrl: './userprofilepage.component.scss'
})
export class UserprofilepageComponent {
  constructor(private route: ActivatedRoute, private router: Router, private carHttp:CarDataService, private userHttp:LoginService){}
  user?:User;
  issues:Array<Issue> = [];
  isAdmin:boolean = false;
  usersIssues?:Array<Issue>;

  ngOnInit(){
    this.route.queryParams.subscribe({
      next:(value)=>{
        let userid = value['userId'];
        if(userid == null || userid == ''){
          this.userHttp.GetUser().subscribe({
            next:(value)=>{
              console.log(value)
              this.user = value;
              this.RemoveFilters();
            },
            error:(err)=>{

            }
          })
        }
        else{

        }
      },
      error:(error)=>{
      }
    });
  }

  searchForm = new FormGroup ({
    make: new FormControl(),
    model: new FormControl(),
    plate: new FormControl(),
    vinnr: new FormControl()
  })

  RemoveFilters(){
    this.searchForm.controls.make.reset("");
    this.searchForm.controls.plate.reset("");
    this.searchForm.controls.model.reset("");
    this.searchForm.controls.vinnr.reset("");
    this.Search();
  }

  Search(){
    let make = this.searchForm.controls.make.value;
    let model = this.searchForm.controls.model.value;
    let plate = this.searchForm.controls.plate.value;
    let vinnr = this.searchForm.controls.vinnr.value;
    this.carHttp.GetUserIssues(0, 100, this.user?.id, make, model, plate, vinnr).subscribe({
      next:(value)=>{
        this.issues = value;
      },
      error:(err)=>{
        console.error(err);
      }
    })
  }
}
