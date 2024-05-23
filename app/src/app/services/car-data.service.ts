import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay } from 'rxjs';
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
  GetCars(page: number, amount: number, make: string = "", model: string = "", plate: string = "", vin: string = ""): Observable<any> {
    return this.http.get<Car[]>(this.url + `/GetCars?startingIndex=${page}&amount=${amount}&make=${make}&model=${model}&plate=${plate}&vin=${vin}`, { responseType: "json" })
      .pipe(delay(2000));
  }

  CreateIssue(carId: string, description: string, price: number) {
    return this.http.get(this.url + `/CreateCarIssue?carId=${carId}&description=${description}&price=${price}`)
      .pipe(delay(2000));
  }
  GetIssues(carId:string, startingIndex:number):Observable<any>{
    return this.http.get(this.url+`/CarIssues?carId=${carId}&startingIndex=${startingIndex}`)
  }

  DeleteCar(carId:string):Observable<any>{
    return this.http.delete(this.url+`/DeleteCar?carId=${carId}`);
  }

}
