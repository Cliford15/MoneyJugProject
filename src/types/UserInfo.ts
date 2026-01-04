// src/types/UserInfo.ts

export interface UserInfo {
    id: number | null;
    userName: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    walletId: number | null;
    password: string;
    isloggedin: boolean;
}
