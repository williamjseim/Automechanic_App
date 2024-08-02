import { Issue } from "./issue";
import { User } from "./user";


/**
 * Car Interface
 * 
 * This interface defines the structure of a Car object within the application.
 * It includes properties such as the car's ID, VIN number, license plate, creation time,
 * make, model, and associated issues. It may also include the user who created the car entry.
 */

export interface Car {
    id:string;
    vinNumber:string;
    plate:String;
    creationTime:Date;
    make:string;
    model:string;
    issues:Issue[];
    creator?:User;
}
