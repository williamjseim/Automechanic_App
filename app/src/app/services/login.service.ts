import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { environment } from '../../environments/environment';

/**
 * LoginService
 * 
 * This service handles authentication-related operations, including user login, logout, token verification, 
 * and user management. It interacts with the backend API to manage users and their session data, storing 
 * and removing tokens from local storage as necessary. It uses Angular's HttpClient to perform HTTP requests 
 * and RxJS Observables to handle asynchronous operations.
 */

@Injectable({
  providedIn: 'root'
})
export class LoginService {


  private url = `${environment.API_URL}/User`

  
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
  ) { }

  /**
   * Logs the user out by removing their session data from local storage.
   */
  logout() {
    this.localStorageService.removeFromLocalStorage('token');
    this.localStorageService.removeFromLocalStorage('isadmin');
    this.localStorageService.removeFromLocalStorage('refreshtoken');
  }

  /**
 * Logs the user in with the provided username and password.
 * @param username The username of the user.
 * @param password The password of the user.
 * @returns An Observable with the HTTP response, which includes the token if login is successful.
 */
  login(username:string, password:string): Observable<any> {
    return this.http.post(`${this.url}/Login?username=${username}&password=${password}`,null, { responseType: "text", observe: "response"});
  }

  /**
   * Verifies the validity of a given token.
   * @param token The token to verify.
   * @returns An Observable with the result of the verification.
   */
  verifyToken(token: any): Observable<any> {
    return this.http.put(`${this.url}/Verify?token=${token}`, null)
  }

  /**
 * Retrieves user details by user ID.
 * @param userId (Optional) The ID of the user to retrieve.
 * @returns An Observable with the user details.
 */
  GetUser(userId: string = ""):Observable<any>{
    return this.http.get(`${this.url}/getuser?userid=${userId}`);
  }

  /**
   * Discovers the user by the username, used to see if user exists.
   * @param username username of the user to discover in the database
   * @returns An http response with no user data as this is just to check if the user exists 
   */
  DiscoverUser(username: string): Observable<any> {
    return this.http.get(`${this.url}/Discoveruser?username=${username}`);
  }

   /**
   * Deletes a user from the system.
   * @param userId The ID of the user to delete.
   * @returns An Observable indicating the result of the operation.
   */
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.url}/delete?userid=${userId}`);
  }

  /**
 * Creates a new user with the provided details.
 * @param username The username of the new user.
 * @param email The email of the new user.
 * @param password The password for the new user.
 * @param role The role of the new user.
 * @returns An Observable indicating the result of the registration.
 */
  createUser(username: string, email: string, password: string, role: number): Observable<any> {
    return this.http.post(`${this.url}/Register?username=${username}&email=${email}&password=${password}&role=${role}`, null, { responseType: "text", observe: "response"});
  }
  
  SetupUser(email: string, password: string, fullname:string){
    return this.http.post(`${this.url}/SetupUser?email=${email}&password=${password}&fullname=${fullname}`, null, { responseType: "text", observe: "response"});
  }
  
  isUserSet(){
    return this.http.get(`${this.url}/isUserSetup`);
  }

  /**
 * Retrieves a list of all users, optionally filtered by username.
 * @param page The page index to retrieve.
 * @param amount The number of users per page.
 * @param username (Optional) The username to filter the users by.
 * @returns An Observable with the list of users.
 */
  getAllUsers(page: number, amount: number, username: string = ""): Observable<any> {
    return this.http.get(`${this.url}/getallusers?startingIndex=${page}&amount=${amount}&username=${username}`);
  }

  /**
 * Retrieves the number of pages needed to display all users, based on the amount per page and an optional username filter.
 * @param amountPrPage The number of users per page.
 * @param username (Optional) The username to filter the users by.
 * @returns An Observable with the number of pages.
 */
  getUserPages(amountPrPage: number, username: string = ""): Observable<any> {
    return this.http.get(`${this.url}/userpages?amountPrPage=${amountPrPage}&username=${username}`);
  } 
}
