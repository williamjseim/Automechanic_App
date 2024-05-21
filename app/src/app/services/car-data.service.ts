import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Car } from '../Interfaces/car';

@Injectable({
  providedIn: 'root'
})
export class CarDataService {

  private port = "7247";
  private url = `https://localhost:${this.port}/cars`
  
  constructor(private http: HttpClient) { }

  GetPageAmount(amountPrPage:number):Observable<any>{
    return this.http.get(this.url+`/CarPages?amountPrPage=${amountPrPage}`);
  }

  //Amount is the amount of car rows pr page
  GetCars(page:number, amount:number):Observable<any>{
    return this.http.get<Car[]>(this.url+`/GetCars?startingIndex=${page}&amount=${amount}`, {responseType: "json"});
  }

  GetIssues(carId:string, startingIndex:number):Observable<any>{
    return this.http.get(this.url+`/CarIssues?carId=${carId}&startingIndex=${startingIndex}`)
  }

}
