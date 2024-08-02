import { Car } from "./car";
import { Category } from "./category";

/**
 * NewIssue Interface
 * 
 * This interface defines the structure of a NewIssue object, used when creating a new issue.
 * It includes the car related to the issue, a description of the problem, the estimated price, 
 * the category of the issue, and an array of co-authors' names.
 */

export interface NewIssue {
    car: Car;
    description: string;
    price: number;
    category: Category | null 
    coAuthors: string[];
    
}
