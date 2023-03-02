class AppError extends Error{
    status:string
    statusCode:number
    isOperational:boolean

    constructor(message,statusCode){
        super(message);

        this.status = `${statusCode}`.startsWith(`4`) ? `fail` : `error`
        this.statusCode = statusCode
        this.isOperational = true
    }
};

export default AppError;