import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import ImageStore from "./imageStore";
import ModalStore from "./modalStore";
import TagStore from "./tagStore";
import UserStore from "./userStore";

interface Store {
    commonStore: CommonStore;
    userStore: UserStore;
    modalStore: ModalStore;
    tagStore: TagStore;
    imageStore : ImageStore;
}

export const store: Store = {
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore(),
    tagStore: new TagStore(),
    imageStore: new ImageStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}