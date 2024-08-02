/**
 * User Interface
 * 
 * This interface defines the structure of a User object within the application.
 * A User represents an individual within the system with specific attributes such as 
 * an ID, role, role name, username, and account creation date.
 */
export interface User{
    id:string;
    role:number;
    rolename:string;
    username:string;
    creationDate:Date;
}