import { Car } from "./car";
import { Category } from "./category";
import { User } from "./user";

export interface Issue {
    id:string;
    creator:User;
    car:Car;
    description:string;
    price:number;
    creationTime:Date;
    category: Category
}
