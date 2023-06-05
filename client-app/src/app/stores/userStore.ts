import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Profile } from "../models/profile";
import { User, UserFormValues } from "../models/user";
import { SettingName, UserSettings, generateUserSettings } from "../models/userSettings";
import { router } from "../router/Routes";
import { store } from "./store";

export default class UserStore {
    user: User | null = null;
    profile : Profile | null = null;
    private settings : UserSettings | null = null;

    constructor() {
        makeAutoObservable(this)
    }

    get isLoggedIn() {
        return !!this.user;
    }

    login = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.login(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            router.navigate('/profile');
            store.modalStore.closeModal();
        } catch(error) {
            throw error;
        }
    }

    register = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.register(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            router.navigate('/profile');
            store.modalStore.closeModal();
        } catch(error) {
            throw error;
        }
    }

    logout = () => {
        store.commonStore.setToken(null);
        this.user = null;
        router.navigate('/');
    }

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            runInAction(() => this.user = user);
        } catch (error) {
            console.log(error);
        }
    }

    getProfile = async () => {
        try {
            const profile = await agent.Profiles.current();
            runInAction(() => this.profile = profile);
        } catch (error) {
            console.log(error);
        }
    }

    //for safety, always go trough the get and set
    getSettings = () : Readonly<UserSettings> => {
        if(!this.settings)
        {
            this.loadSettings();
        }

        return this.settings!;
    }

    setSetting = (setting: SettingName, value : boolean) => {
        if(!this.settings)
        {
            this.loadSettings();
        }

        switch(setting)
        {
            case SettingName.DeleteTag:
                this.settings!.deleteTag = value;
                break;
            case SettingName.DeleteMultiTag:
                this.settings!.deleteMultiTags = value;
                break;
            case SettingName.DeleteImage:
                this.settings!.deleteImage = value;
                break;
            case SettingName.DeleteMultiImage:
                this.settings!.deleteMultiImage = value;
                break;
        }

        this.saveSettings();
    }

    setSettings = (setting: UserSettings) => {
        this.settings = setting;
        this.saveSettings();
    }

    private loadSettings = () => {
        if(this.user && !this.settings)
        {
            const data = localStorage.getItem(this.user.displayName);
            if(data)
            {
                this.settings = JSON.parse(data);
            }
            else
            {
                this.initSettings();
            }
        }
    }

    private saveSettings = () => {
        if(this.user && this.settings)
        {
            localStorage.setItem(this.user.displayName, JSON.stringify(this.settings));
        }
    }

    private initSettings = () => {
        this.settings = generateUserSettings();
        this.saveSettings();
    }
}