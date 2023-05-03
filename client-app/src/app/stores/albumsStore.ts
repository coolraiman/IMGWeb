import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../models/serverError";
import { store } from "./store";

export default class AlbumsStore {
    loading : boolean = false;
    

    constructor() {
        makeAutoObservable(this)
    }
}