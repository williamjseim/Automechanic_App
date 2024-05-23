import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import {MatSelectModule, matSelectAnimations} from '@angular/material/select';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../Interfaces/user';
import { Issue } from '../../Interfaces/issue';
import { ActivatedRoute, Router } from '@angular/router';
import { CarDataService } from '../../services/car-data.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-userprofilepage',
  standalone: true,
  imports: [NgIf, NgFor, MatSelectModule, MatInputModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './userprofilepage.component.html',
  styleUrl: './userprofilepage.component.scss'
})
export class UserprofilepageComponent {
  constructor(private route: ActivatedRoute, private router: Router, private carHttp:CarDataService, private userHttp:LoginService){}
  user?:User;
  issues:Array<Issue> = [];
  isAdmin:boolean = false;

  ngOnInit(){
    this.route.queryParams.subscribe({
      next:(value)=>{
        let userid = value['userId'];
        if(userid == null || userid == ''){
          this.userHttp.GetUser().subscribe({
            next:(value)=>{
              this.user = value;
              //get all issues created by user
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
}
