/**
 * Category Interface
 * 
 * This interface defines the structure of a Category object within the application.
 * A Category object represents a classification or label that can be applied to various items, 
 * such as issues or cars. It includes an identifier and a tag name.
 */

export interface Category {
    id: string;
    tag: string;
}