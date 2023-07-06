import { Sequelize, DataTypes, Model } from 'sequelize';
const sequelize = new Sequelize(`postgres://postgres:${process.env.DB_PASSWORD}@localhost:5432/twitter`);

class LikeModel extends Model {}

LikeModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
    },
    tweet_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tweets',
            key: 'id'
        },
    },
    comment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'comments',
            key: 'id'
        },
    },
  },
  {
    sequelize,
    modelName: 'Like',
    tableName: 'likes',
    timestamps: true,
    underscored: true
  }
);

(async () => {
  await LikeModel.sync({ alter: true })
  .then(() => {
    console.log("Like table synchronizedsuccessfully!")
  })
  .catch((err) => {
        console.error("Unable to sync the Like table:", err);
 });
})();

export default LikeModel;