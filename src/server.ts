import dotenv from "dotenv";
import app from "./app";

dotenv.config();

//TODO
//1-catch uncaught exception
//2-unhandled rejection
//3-Handle uncaught exception

const port = process.env.PORT || 3000;
const server = app.listen(port,() => {
    console.log(`Listening on port ${port}...`);
});

export default server;