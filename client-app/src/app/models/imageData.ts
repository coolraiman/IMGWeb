import { Tag } from "./tag";

export interface ImageData{
    id: string;
    url : string;
    filename : string;
    name : string;
    extension : string;
    fileSize : number;
    rating : number;
    favorite : boolean;
    views : number;
    dateAdded : Date;
    dateTaken : Date;
    height : number;
    width : number;
    metadata : string;
    tags : Tag[];
}
