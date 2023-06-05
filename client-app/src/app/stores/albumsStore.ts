import { makeAutoObservable } from "mobx";

export default class AlbumsStore {
    loading : boolean = false;

    constructor() {
        makeAutoObservable(this)
    }
}