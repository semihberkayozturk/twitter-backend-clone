import { Client } from "pg";

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "twitter",
    password: process.env.DB_PASSWORD,
    port:5432
});

client.connect();

client.query('SELECT NOW()', (err,res) => {
    if(err){
        console.error('Error connecting to PostgreSQL:',err);
    }
    else{
        console.log('Connected to PostgreSQL at',res.rows[0].now);
    }
});

export default client;