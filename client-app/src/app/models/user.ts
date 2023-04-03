export interface User {
    username: string;
    displayName: string;
    token: string;
    spaceUsed: number;
    spaceAllowed: number;
}

export interface UserFormValues {
    email: string;
    password: string;
    displayName?: string;
    username?: string;
}