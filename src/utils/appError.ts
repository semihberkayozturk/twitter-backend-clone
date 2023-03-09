interface AppErrorProps {
    statusCode:number;
};

class AppError extends Error{
    status:string
    statusCode:number
    isOperational:boolean

    constructor(message,statusCode){
        super(message);

        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith(`4`) ? `fail` : `error`
        this.isOperational = true

        Error.captureStackTrace(this,this.constructor)
    }
};

export default AppError;