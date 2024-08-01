import { Observable } from "rxjs";
import { Issue } from "./issue";
import { User } from "./user";

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
