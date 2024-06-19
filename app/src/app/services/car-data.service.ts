import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Car } from '../Interfaces/car';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarDataService {

  private url = `${environment.API_URL}/cars`
  
  constructor(private http: HttpClient) { }

  GetPageAmount(amountPrPage: number, make: string = "", model: string = "", plate: string = "", vin: string = ""):Observable<any>{
    return this.http.get(this.url + `/CarPages?amountPrPage=${amountPrPage}&make=${make}&model=${model}&plate=${plate}&vin=${vin}`);
  }

  GetIssuePageAmount(amountPrPage: number, category: string = "", make: string = "", plate: string = "", creatorName: string = ""): Observable<any> {
    return this.http.get(this.url + `/IssuePages?amountPrPage=${amountPrPage}&username=${creatorName}&make=${make}&plate=${plate}&category=${category}`);
  }

  //Amount is the amount of car rows pr page
  GetCars(page: number, amount: number, make: string = "", model: string = "", plate: string = "", vin: string = ""): Observable<any> {
    return this.http.get<Car[]>(this.url + `/GetCars?startingIndex=${page}&amount=${amount}&make=${make}&model=${model}&plate=${plate}&vin=${vin}`, { responseType: "json" })};

  GetIssues(startingIndex: number, amount: number, category: string = "", make: string = "", plate: string = "", creatorName:string=""):Observable<any>{
    return this.http.get(this.url+`/GetIssues?startingIndex=${startingIndex}&amount=${amount}&creatorName=${creatorName}&plate=${plate}&make=${make}&category=${category}`, {observe: "response"});
  }
  
  GetCarIssues(carId:string, startingIndex:number, amount:number):Observable<any>{
    return this.http.get(this.url+`/CarIssues?carId=${carId}&startingIndex=${startingIndex}&amount=${amount}`, {observe: "response"});
  }

  DeleteCar(carId:string):Observable<any>{
    return this.http.delete(this.url+`/DeleteCar?carId=${carId}`);
  }

  GetCar(carId:string):Observable<any>{
    return this.http.get(this.url+`/GetCar?carId=${carId}`);
  }

  DeleteIssue(issueId:string):Observable<any>{
    return this.http.delete(this.url+`/DeleteIssue?issueId=${issueId}`);
  }

  CreateCar(make:string="", model:string="", plate:string="", vin:string = ""):Observable<any>{
    return this.http.put(this.url+`/CreateCar?make=${make}&model=${model}&plate=${plate}&vinnr=${vin}`,"");
  }

  GetIssue(issueId: string):Observable<any> {
    return this.http.get(this.url+`/GetIssue?issueId=${issueId}`);
  } 

  // Creates a car issue
  // Parameters - carId, categoryId, price
  // body - description (description is appended to the body because it contains new lines, "\n")
  CreateIssue(carId:string, categoryId:string | undefined | null, description:string, price:number, coAuthorNames:string[] = []){
    return this.http.put(this.url+`/CreateCarIssue?carId=${carId}&categoryId=${categoryId}&description=${description}&price=${price}&coAuthorNames=${coAuthorNames}`,"");
  }

  GetUserIssues(startingIndex:number, amount:number, userId:string = "", make:string = "", model:string = "", plate:string = "", vin = "",) :Observable<any>{
    return this.http.get(this.url+`/UserIssues?startingIndex=${startingIndex}&amount=${amount}&UserId=${userId}&make=${make}&model=${model}&plate=${plate}&vinnr=${vin}`);
  }

  GetCarCategories(): Observable<any> {
    return this.http.get(`${this.url}/carissuecategories`);
  }

  CreateCarCategory(tag: string): Observable<any> {
    return this.http.put(`${this.url}/createcarissuecategory?tag=${tag}`, "");
  }

  DeleteCarCategory(categoryId: string): Observable<any> {
    return this.http.delete(`${this.url}/deletecarissuecategory?categoryid=${categoryId}`);
  }

}
