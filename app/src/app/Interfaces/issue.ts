import { Car } from "./car";
import { Category } from "./category";
import { User } from "./user";

/**
 * Issue Interface
 * 
 * This interface defines the structure of an Issue object within the application.
 * An Issue represents a problem or task associated with a specific car. It includes 
 * details about the issue's creator, associated car, description, cost, creation time, 
 * category, and optional co-authors.
 */

export interface Issue {
    id:string;
    creator:User;
    car:Car;
    description:string;
    price:number;
    creationTime:Date;
    category: Category
    isCompleted: boolean;
    coAuthors?: User[];
}
