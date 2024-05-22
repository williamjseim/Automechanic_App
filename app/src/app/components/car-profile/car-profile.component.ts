import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Car } from '../../Interfaces/car';
import { CarDataService } from '../../services/car-data.service';
import { NgIf, NgFor } from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatFormFieldModule, matFormFieldAnimations} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-car-profile',
  standalone: true,
  imports: [NgIf, NgFor, MatSelectModule, MatIconModule, MatButtonModule, MatInput, MatInputModule, MatFormFieldModule],
  templateUrl: './car-profile.component.html',
  styleUrl: './car-profile.component.scss'
})
export class CarProfileComponent {
  constructor(private route: ActivatedRoute, private router: Router, private carHttp:CarDataService){}
  car?:Car;
  carNotFound:boolean = false;
  imagepath:string = "../../../assets/NoImage.avif";
  isAdmin:boolean = false;
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

  GetIssues(carId:string){
    this.carHttp.GetIssues(carId, 0).subscribe({
      next:(value)=>{
        this.car!.issues = value;
        console.log(value)
      },
      error:(err)=>{

      }
    })
  }
}
