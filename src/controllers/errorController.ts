import AppError from "../utils/appError";


const handleDuplicateField = err => {
    console.log(err);
    //const value =  
    const message = `Duplicate field value: ${err.detail}`;
    return new AppError(message,400);
};

//Handle JWT Errors
const handleJwtError = () => new AppError("Invalid JWT token. Please log in again!",401);
const handleJwtExpiration = () => new AppError("Token has expired! Please log in again!",401);

//Send Error based on environment
const sendDevError = (err,res) => {
    res.status(err.statusCode).json({
        status:err.status,
        error:err,
        message:err.message,
        stack:err.stack
    })
};

const sendProdError = (err,res) => {
    if(err.isOperational){
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message
        })
    }else {
        console.error("ERROR",err);
        res.status(500).json({
            status:"error",
            message:"Something went wrong!"
        })
    }
}

export default (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if(process.env.NODE_ENV==="development"){
        sendDevError(err,res);
    }else if (process.env.NODE_ENV==="production"){
        let error = {...err};
        if(error.name == "JsonWebTokenError")error= handleJwtError()
        if(error.code === '23505')error = handleDuplicateField(error);
        sendProdError(error,res);
    }
};