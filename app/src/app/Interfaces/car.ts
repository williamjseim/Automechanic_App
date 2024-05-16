import { Observable } from "rxjs";
import { Issue } from "./issue";

export interface Car {
    Id:string;
    VinNumber:string;
    Plate:String;
    CreationTime:Date;
    Make:string;
    Model:string;
    issues:Observable<Issue[]>;
}
