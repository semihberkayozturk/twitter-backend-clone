import AppError from "../utils/appError";

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
}