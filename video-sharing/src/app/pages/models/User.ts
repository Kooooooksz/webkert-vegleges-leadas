export interface User{
    uid: string;
    email: string;
    username: string;
    name: {
        firstname: string;
        lastname: string;
    }
    phone: string;
    address: string;
    birth: Date;
}