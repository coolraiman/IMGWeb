export interface UserSettings {
    deleteTag: boolean;
    deleteMultiTags: boolean;
    deleteImage: boolean;
    deleteMultiImage: boolean;
}

export function generateUserSettings(): UserSettings {
    let settings: UserSettings = {deleteTag:true, deleteMultiTags:true, deleteImage:true, deleteMultiImage:true};
    return settings;
}

export enum SettingName {
    DeleteTag,
    DeleteMultiTag,
    DeleteImage,
    DeleteMultiImage
}