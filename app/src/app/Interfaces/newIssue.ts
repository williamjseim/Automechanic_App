import { Car } from "./car";

export interface NewIssue {
    car: Car;
    description: string;
    price: number;
}
