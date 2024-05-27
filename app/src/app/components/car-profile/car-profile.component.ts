import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Car } from '../../Interfaces/car';
import { CarDataService } from '../../services/car-data.service';
import { NgIf, NgFor } from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-car-profile',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, ReactiveFormsModule, MatSelectModule, MatIconModule, MatButtonModule, MatInput, MatInputModule, MatFormFieldModule],
  templateUrl: './car-profile.component.html',
  styleUrl: './car-profile.component.scss'
})
export class CarProfileComponent {
  constructor(private route: ActivatedRoute, private router: Router, private carHttp:CarDataService){}
  car?:Car;
  carNotFound:boolean = false;
  imagepath:string = "../../../assets/NoImage.avif";
  isAdmin:boolean = false;
  issueForDeletion = -1;

  deleteError = "";


  ngOnInit(){
    console.log("ass");
    this.route.queryParams.subscribe({
      next:(value)=>{
        let carId = value['carId']
        this.carHttp.GetCar(carId).subscribe({
          next:(car)=>{
            this.car = car;
            this.GetIssues(this.car!.id)
          },
          error:(error)=>{
            this.carNotFound = true;
          }
        })
      },
      error:(error)=>{
        this.carNotFound = true;
      }
    });
  }

  carForm = new FormGroup ({
    make: new FormControl(),
    model: new FormControl(),
    plate: new FormControl(),
    vinnr: new FormControl()
  })

  searchForm = new FormGroup ({
    make: new FormControl(),
    model: new FormControl(),
    plate: new FormControl(),
    vinnr: new FormControl()
  })

  GetIssues(carId:string){
    this.carHttp.GetIssues(carId, 0, 10).subscribe({
      next:(value)=>{
        this.car!.issues = value.body;
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  Error(){
    console.log('not implemented');
  }

  RemoveIssue(confirmText:string){
    if(confirmText != "Delete"){
      this.deleteError = "Wrong input"
    }
    else{
      this.deleteError = "";
      console.log(this.car!.issues[this.issueForDeletion].id);
      this.carHttp.DeleteIssue(this.car!.issues[this.issueForDeletion].id).subscribe({
        next:(value)=>{
          console.log(value);
          this.car!.issues.splice(this.issueForDeletion, 1);
          this.issueForDeletion = -1;
        },
        error:(err)=>{
          console.log(err);
        }
      })
    }
  }

  Search(){
    let make = this.searchForm.controls.make.value;
    let model = this.searchForm.controls.model.value;
    let plate = this.searchForm.controls.plate.value;
    let vinnr = this.searchForm.controls.vinnr.value;
    
  }

  RemoveFilters(){
    this.searchForm.controls.make.reset("");
    this.searchForm.controls.plate.reset("");
    this.searchForm.controls.model.reset("");
    this.searchForm.controls.vinnr.reset("");
    this.Search();
  }
}
