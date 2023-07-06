import { Client } from "pg";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  //`postgres://postgres:${process.env.DB_PASSWORD}@localhost:5432/twitter?sslmode=disable`,
  'postgres://postgres:secret@postgres:5432/twitter?sslmode=disable',
  {
    logging: false
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to Sequelize!');
  } catch (error) {
    console.error('Unable to connect to Sequelize:', error);
  }
})();

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "twitter",
    password: "secret",
    port:5432
});

client.connect();

client.query('SELECT NOW()', (err, res) => {
  if (err) {
      console.error('Error connecting to PostgreSQL:', err);
  } else {
      console.log('Connected to PostgreSQL at', res.rows[0].now);
  }
});


export default {client,sequelize};