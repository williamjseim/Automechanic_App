import { User } from "./user";

export interface Issue {
    id:string;
    creator:User;
    description:string;
    price:number;
    creationTime:Date;
}
