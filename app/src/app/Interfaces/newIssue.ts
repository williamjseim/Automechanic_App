import { Car } from "./car";
import { Category } from "./category";

export interface NewIssue {
    car: Car;
    description: string;
    price: number;
    category: Category

}
