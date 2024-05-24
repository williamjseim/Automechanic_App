import { Car } from "./car";
import { User } from "./user";

export interface Issue {
    id:string;
    creator:User;
    car:Car;
    description:string;
    price:number;
    creationTime:Date;
}
