import { Client } from "pg";
import { Sequelize } from "sequelize";

async function connectToSequelize() {
    const sequelize = new Sequelize(
      `postgres://postgres:${process.env.DB_PASSWORD}@localhost:5432/twitter`
    );
  
    try {
      await sequelize.authenticate();
      console.log("Connected to Sequelize!");
    } catch (error) {
      console.error("Unable to connect to the Sequelize:", error);
    }
};

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "twitter",
    password: process.env.DB_PASSWORD,
    port:5432
});

client.connect();
connectToSequelize();

client.query('SELECT NOW()', (err,res) => {
    if(err){
        console.error('Error connecting to PostgreSQL:',err);
    }
    else{
        console.log('Connected to PostgreSQL at',res.rows[0].now);
    }
});

export default client;