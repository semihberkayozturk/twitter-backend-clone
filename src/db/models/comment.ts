import { Sequelize, DataTypes, Model } from 'sequelize';
const sequelize = new Sequelize(`postgres://postgres:${process.env.DB_PASSWORD}@localhost:5432/twitter`);

class CommentModel extends Model {}

CommentModel.init(
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
    contents : {
        type: DataTypes.STRING(240),
        allowNull: false,
    },
    tweet_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tweets',
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
  await CommentModel.sync({ alter: true })
  .then(() => {
    console.log("Comment table synchronized successfully!")
  })
  .catch((err) => {
        console.error("Unable to sync the Comment table:", err);
 });
})();

export default CommentModel;