import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Car } from '../Interfaces/car';
import { environment } from '../environment.dev';

@Injectable({
  providedIn: 'root'
})
export class CarDataService {

  private url = `${environment.API_URL}/cars`
  
  constructor(private http: HttpClient) { }

  GetPageAmount(amountPrPage:number):Observable<any>{
    return this.http.get(this.url+`/CarPages?amountPrPage=${amountPrPage}`);
  }

  //Amount is the amount of car rows pr page
  GetCars(page: number, amount: number, make: string = "", model: string = "", plate: string = "", vin: string = ""): Observable<any> {
    return this.http.get<Car[]>(this.url + `/GetCars?startingIndex=${page}&amount=${amount}&make=${make}&model=${model}&plate=${plate}&vin=${vin}`, { responseType: "json" })};

  GetIssues(carId:string, startingIndex:number, amount:number):Observable<any>{
    return this.http.get(this.url+`/CarIssues?carId=${carId}&startingIndex=${startingIndex}&amount=${amount}`, {observe: "response"})
  }

  DeleteCar(carId:string):Observable<any>{
    return this.http.delete(this.url+`/DeleteCar?carId=${carId}`);
  }

  GetCar(carId:string):Observable<any>{
    return this.http.get(this.url+`/GetCar?carId=${carId}`)
  }

  DeleteIssue(issueId:string):Observable<any>{
    return this.http.delete(this.url+`/DeleteIssue?issueId=${issueId}`);
  }

  CreateCar(make:string="", model:string="", plate:string="", vin:string = ""):Observable<any>{
    return this.http.put(this.url+`/CreateCar?make=${make}&model=${model}&plate=${plate}&vinnr=${vin}`,"")
  }

  GetIssue(issueId: string):Observable<any> {
    return this.http.get(this.url+`/GetIssue?issueId=${issueId}`);
  } 

  CreateIssue(carId:string, description:string, price:number){
    return this.http.put(this.url+`/CreateCarIssue?carId=${carId}&description=${description}&price=${price}`,"");
  }

  GetUserIssues(startingIndex:number, amount:number, userId:string = "", make:string = "", model:string = "", plate:string = "", vin = "",) :Observable<any>{
    return this.http.get(this.url+`/UserIssues?startingIndex=${startingIndex}&amount=${amount}&UserId=${userId}&make=${make}&model=${model}&plate=${plate}&vinnr=${vin}`)
  }

}
