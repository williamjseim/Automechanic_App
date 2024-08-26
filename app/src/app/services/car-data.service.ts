import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Car } from '../Interfaces/car';

import { environment } from '../../environments/environment';


/**
 * CarDataService
 * 
 * This service provides methods to interact with car and issue data from the backend API. It includes methods for fetching 
 * paginated lists of cars and issues, retrieving specific car or issue details, creating and deleting cars and issues, and 
 * managing car issue categories. It uses Angular's HttpClient to make HTTP requests and returns data wrapped in RxJS Observables.
 */

@Injectable({
  providedIn: 'root'
})
export class CarDataService {

  private url = `${environment.API_URL}/cars`
  
  constructor(private http: HttpClient) { }
  
  /**
   * Retrieves the number of pages needed to display cars, based on the given amount per page and optional filters.
   * @param amountPrPage The number of cars per page.
   * @param make (Optional) The make of the cars to filter.
   * @param model (Optional) The model of the cars to filter.
   * @param plate (Optional) The license plate to filter.
   * @param vin (Optional) The VIN to filter.
   * @returns An Observable with the number of pages.
   */
  GetPageAmount(amountPrPage: number, make: string = "", model: string = "", plate: string = "", vin: string = ""):Observable<any>{
    return this.http.get(this.url + `/CarPages?amountPrPage=${amountPrPage}&make=${make}&model=${model}&plate=${plate}&vin=${vin}`);
  }

  /**
   * Retrieves the number of pages needed to display issues, based on the given amount per page and optional filters.
   * @param amountPrPage The number of issues per page.
   * @param creator (Optional) The name of the issue creator.
   * @param category (Optional) The category of the issues.
   * @param make (Optional) The make of the cars to filter.
   * @param plate (Optional) The license plate to filter.
   * @returns An Observable with the number of pages.
   */
  GetIssuePageAmount(amountPrPage: number, creator:string = "", category: string = "", make: string = "", plate: string = ""): Observable<any> {
    return this.http.get(this.url + `/IssuePages?amountPrPage=${amountPrPage}&creatorName=${creator}&make=${make}&plate=${plate}&category=${category}`);
  }

  /**
 * Fetches a list of cars with optional filters.
 * @param page The page index to retrieve.
 * @param amount The number of cars per page.
 * @param creator (Optional) The name of the car creator.
 * @param make (Optional) The make of the cars to filter.
 * @param model (Optional) The model of the cars to filter.
 * @param plate (Optional) The license plate to filter.
 * @param vin (Optional) The VIN to filter.
 * @returns An Observable with a list of cars.
 */
  GetCars(page: number, amount: number, creator:string = "", make: string = "", model: string = "", plate: string = "", vin: string = ""): Observable<any> {
    return this.http.get<Car[]>(this.url + `/GetCars?startingIndex=${page}&creatorName=${creator}&amount=${amount}&make=${make}&model=${model}&plate=${plate}&vin=${vin}`, { responseType: "json" })};

  /**
   * Fetches a list of issues with optional filters.
   * @param startingIndex The index of the first issue to retrieve.
   * @param amount The number of issues per page.
   * @param category (Optional) The category of the issues.
   * @param make (Optional) The make of the cars to filter.
   * @param plate (Optional) The license plate to filter.
   * @param creatorName (Optional) The name of the issue creator.
   * @returns An Observable with a list of issues.
   */
  GetIssues(startingIndex: number, amount: number, category: string = "", make: string = "", plate: string = "", creatorName:string=""):Observable<any>{
    return this.http.get(this.url+`/GetIssues?startingIndex=${startingIndex}&amount=${amount}&creatorName=${creatorName}&plate=${plate}&make=${make}&category=${category}`, {observe: "response"});
  }

  /**
 * Retrieves a list of issues associated with a specific car.
 * @param carId The ID of the car.
 * @param startingIndex The index of the first issue to retrieve.
 * @param amount The number of issues to retrieve.
 * @returns An Observable with a list of car issues.
 */
  GetCarIssues(carId:string, startingIndex:number, amount:number):Observable<any>{
    return this.http.get(this.url+`/CarIssues?carId=${carId}&startingIndex=${startingIndex}&amount=${amount}`, {observe: "response"});
  }

  /**
   * Deletes a car from the system.
   * @param carId The ID of the car to delete.
   * @returns An Observable indicating the result of the operation.
   */
  DeleteCar(carId:string):Observable<any>{
    return this.http.delete(this.url+`/DeleteCar?carId=${carId}`);
  }

  /**
   * Retrieves details for a specific car.
   * @param carId The ID of the car.
   * @returns An Observable with the car details.
   */
  GetCar(carId:string):Observable<any>{
    return this.http.get(this.url+`/GetCar?carId=${carId}`);
  }

  /**
   * Deletes an issue from the system.
   * @param issueId The ID of the issue to delete.
   * @returns An Observable indicating the result of the operation.
   */
  DeleteIssue(issueId:string):Observable<any>{
    return this.http.delete(this.url+`/DeleteIssue?issueId=${issueId}`);
  }

  /**
 * Creates a new car in the system.
 * @param make The make of the car.
 * @param model The model of the car.
 * @param plate The license plate of the car.
 * @param vin The VIN of the car.
 * @returns An Observable indicating the result of the operation.
 */
  CreateCar(make:string="", model:string="", plate:string="", vin:string = ""):Observable<any>{
    return this.http.put(this.url+`/CreateCar?make=${make}&model=${model}&plate=${plate}&vinnr=${vin}`,"");
  }

  /**
 * Retrieves details for a specific issue.
 * @param issueId The ID of the issue.
 * @returns An Observable with the issue details.
 */
  GetIssue(issueId: string):Observable<any> {
    return this.http.get(this.url+`/GetIssue?issueId=${issueId}`);
  } 

  /**
   * 
   * @param issueId 
   * @param anonymousKey 
   * @returns issue details only for viewing purposes
   */
  GetAnonoymousIssue(issueId: string, anonymousKey: string): Observable<any> {
    return this.http.get(this.url +`/AnonymousIssue?issueId=${issueId}&anonymouskey=${anonymousKey}`)
  }

  /**
   * 
   * @param issueId 
   * @returns anonymous key for sharing
   */
  CreateAnonymousIssue(issueId: string): Observable<any> {
    return this.http.put(this.url + `/AnonymousIssue?issueId=${issueId}`, "")
  }

  /**
 * Creates a new issue for a car.
 * @param carId The ID of the car.
 * @param categoryId The category ID for the issue.
 * @param description The description of the issue.
 * @param price The estimated price to fix the issue.
 * @param coAuthorNames A list of co-author names associated with the issue.
 * @returns An Observable indicating the result of the operation.
 */
  CreateIssue(carId:string, categoryId:string | undefined | null, description:string, price:number, coAuthorNames:string[] = []){
    return this.http.put(this.url+`/CreateCarIssue?carId=${carId}&categoryId=${categoryId}&price=${price}&coAuthorNames=${coAuthorNames}`, description);
  }

  /**
   * Retrieves a list of issues associated with a specific user.
   * @param startingIndex The index of the first issue to retrieve.
   * @param amount The number of issues per page.
   * @param userId (Optional) The ID of the user.
   * @param make (Optional) The make of the cars to filter.
   * @param model (Optional) The model of the cars to filter.
   * @param plate (Optional) The license plate to filter.
   * @param vin (Optional) The VIN to filter.
   * @returns An Observable with a list of user issues.
   */
  GetUserIssues(startingIndex:number, amount:number, userId:string = "", make:string = "", model:string = "", plate:string = "", vin = "",) :Observable<any>{
    return this.http.get(this.url+`/UserIssues?startingIndex=${startingIndex}&amount=${amount}&UserId=${userId}&make=${make}&model=${model}&plate=${plate}&vinnr=${vin}`);
  }

  /**
  * Updates the status of issue completion.
  * @param issueId The ID of the issue to update.
  * @returns An Observable indicating the result of the operation.
  */
  ChangeIssueStatus(issueId: string): Observable<any> {
    return this.http.put(`${this.url}/ChangeIssueStatus?issueId=${issueId}`, null);
  }

  /**
   * Retrieves a list of available car issue categories.
   * @returns An Observable with a list of car issue categories.
   */
  GetCarCategories(): Observable<any> {
    return this.http.get(`${this.url}/carissuecategories`);
  }

  /**
 * Creates a new car issue category.
 * @param tag The tag name of the new category.
 * @returns An Observable indicating the result of the operation.
 */
  CreateCarCategory(tag: string): Observable<any> {
    return this.http.put(`${this.url}/createcarissuecategory?tag=${tag}`, "");
  }



  /**
 * Deletes a car issue category.
 * @param categoryId The ID of the category to delete.
 * @returns An Observable indicating the result of the operation.
 */
  DeleteCarCategory(categoryId: string): Observable<any> {
    return this.http.delete(`${this.url}/deletecarissuecategory?categoryid=${categoryId}`);
  }

}
