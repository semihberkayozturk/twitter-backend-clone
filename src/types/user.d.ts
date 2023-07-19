export interface User {
    id:number,
    username:string,
    email:string,
    password:string,
    bio:string | null,
    avatar:string | null,
    phone:string | null,
    status:string | null,
};

export interface ReqWithUser extends Request {
    user: {
        id:number;
    };
};