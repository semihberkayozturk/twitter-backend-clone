export interface User {
    id:number,
    username:string,
    email:string,
    password:string,
    bio:string,
    avatar:string,
    phone:string,
    status:string
};

export interface ReqWithUser extends Request {
    user: {
        id:number;
    };
};