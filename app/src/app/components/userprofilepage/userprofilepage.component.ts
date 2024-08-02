import { Component, inject } from '@angular/core';
import { NgIf, NgFor, DatePipe, JsonPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../Interfaces/user';
import { Issue } from '../../Interfaces/issue';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CarDataService } from '../../services/car-data.service';
import { LoginService } from '../../services/login.service';
import { CarPageComponent } from '../car-page/car-page.component';
import { IssuetablepageComponent } from '../issuetablepage/issuetablepage.component';
import { DeleteRequestPopupComponent } from '../delete-request-popup/delete-request-popup.component';
import { MatDialog }  from '@angular/material/dialog'
import { NewUserProfileComponent } from '../adminUserActions/new-user-profile/new-user-profile.component';
import { DeleteUserComponent } from '../adminUserActions/delete-user/delete-user.component';

/**
 * UserProfilePageComponent
 * 
 * This component displays and manages user profiles. It allows for viewing user details,
 * searching for user-related issues, and performing user management actions such as
 * creating or deleting users. The component uses Angular Material dialogs for user management
 * actions and Angular Reactive Forms for filtering issues.
 */
@Component({
  selector: 'app-userprofilepage',
  standalone: true,
  imports: [DatePipe, DeleteRequestPopupComponent, CarPageComponent, IssuetablepageComponent, NgIf, NgFor, MatSelectModule, RouterLink, MatInputModule, MatFormFieldModule, MatButtonModule, MatIcon, FormsModule, ReactiveFormsModule],
  templateUrl: './userprofilepage.component.html',
  styleUrl: './userprofilepage.component.scss'
})
export class UserprofilepageComponent {
  constructor(
    private route: ActivatedRoute,        // Service to access route parameters
    private carHttp: CarDataService,       // Service to fetch car-related data
    private userHttp: LoginService,        // Service to handle user-related actions
  ) { }

  readonly dialog = inject(MatDialog);    // Inject the MatDialog service for displaying dialogs

  user?: User;                            // Holds the user object
  issues: Array<Issue> = [];              // Array to store issues related to the user
  isAdmin: boolean = false;              // Flag to indicate if the current user is an admin
  usersIssues?: Array<Issue>;            // Array to store issues of a specific user

  /**
   * On initialization, retrieves user information based on the query parameters
   * and checks if the user is an admin.
   */
  ngOnInit(){
    let adminKey = localStorage.getItem('isadmin')
    this.isAdmin = adminKey ? (JSON.parse(adminKey.toLowerCase()) === 'true') : false

    this.route.queryParams.subscribe({
      next:(value)=>{
        let userid = value['userId'];
        if(userid == null || userid == ''){
          this.userHttp.GetUser().subscribe({
            next:(value)=>{
              this.user = value;
              this.RemoveFilters();
            },
            error:(err)=>{
            }
          })
        }
        else{
          this.userHttp.GetUser(userid).subscribe({
            next: (value) => {
              this.user = value;
              this.RemoveFilters();
            },
            error:(err) => {
              
            }
          })
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
  CreateUser() {
    this.dialog.open(NewUserProfileComponent)
  }
  DeleteUser() {
    this.dialog.open(DeleteUserComponent, { 
      width: '75vh'
    })
  }
  deleteUser(result: number) {
    this.userHttp.deleteUser(this.user!.id).subscribe({
      next: (res) => {
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
