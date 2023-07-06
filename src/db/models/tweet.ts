import { Sequelize, DataTypes, Model } from 'sequelize';
const sequelize = new Sequelize(`postgres://postgres:${process.env.DB_PASSWORD}@localhost:5432/twitter`);

class TweetModel extends Model {}

TweetModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tweet: {
      type: DataTypes.STRING(280)
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: -90,
        max: 90
      }
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: -180,
        max: 180
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
    }
  },
  {
    sequelize,
    modelName: 'Tweet',
    tableName: 'tweets',
    timestamps: true,
    underscored: true
  }
);

TweetModel.sync({ alter: true })
  .then(() => {
    console.log("Tweet table synchoronized successfully!")
  })
  .catch((err) => {
        console.error("Unable to sync the Tweet table:", err);
 });

export default TweetModel;
