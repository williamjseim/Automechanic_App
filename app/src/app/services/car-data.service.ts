import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarDataService {

  private port = "5142";
  private url = `http://localhost:${this.port}/User`
  
  constructor(private http: HttpClient) { }

  GetPageAmount():Observable<any>{
    return this.http.get(this.url);
  }

  //Amount is the amount of car rows pr page
  GetCars(page:number, amount:number):Observable<any>{
    return this.http.get(this.url+`/GetCars?startingIndex=${page}&amount=${amount}`);
  }

}
