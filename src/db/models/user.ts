import { Sequelize, DataTypes, Model } from 'sequelize';
const sequelize = new Sequelize(
  `postgres://postgres:${process.env.DB_PASSWORD}@localhost:5432/twitter?sslmode=disable`,
  {
    logging: false
  }
);

class UserModel extends Model {
  declare id : number;
  declare password : string;
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    bio: {
      type: DataTypes.STRING(400)
    },
    avatar: {
      type: DataTypes.STRING(200)
    },
    phone: {
      type: DataTypes.STRING(25)
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true
  }
);


(async () => {
  await UserModel.sync({ alter: true })
  .then(() => {
    console.log("User table synchronized successfully!")
  })
  .catch((err) => {
        console.error("Unable to sync the User table:", err);
 });
})();

export default UserModel;